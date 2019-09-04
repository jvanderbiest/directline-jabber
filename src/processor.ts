import { TranscriptGenerator } from './transcriptGenerator';
import { RequestHandler } from './requestHandler';
import { ActivityHandler } from './activityHandler';
import { Stats } from './stats';
import { FileInfo } from './domain/fileInfo';
import { Extensions } from './constants';
import log = require('npmlog');
import { FileSearcher } from "./fileSearcher";
import { Activity } from './domain/activity';
import { JabberActivity } from './domain/jabberActivity';

/** Handles the complete process to test transcripts with directline */
class Processor {
    _activityHandler: ActivityHandler;
    _requestHandler: RequestHandler;
    _transcriptGenerator: TranscriptGenerator;

    _stats: Stats;

    constructor(
        activityHandler: ActivityHandler,
        transcriptGenerator: TranscriptGenerator) {
        this._activityHandler = activityHandler;
        this._transcriptGenerator = transcriptGenerator;
    }

    /**
     * Starts processing files and folders
     * @param {Array<string>} files - an array of filepaths
     * @param {Array<string>} folders - an array of folders to scan for .chat files
     * @param {boolean} includeSubFolders - includes sub folders when scanning
     * @param {string} preprocessFile - a file that contains activities to process before the actual conversation
     */
    async start(files: Array<string>, folders: Array<string>, includeSubFolders: boolean, preprocessFile: string) {
        var preProcessActivities = new Array<JabberActivity>();
        
        if (preprocessFile) {
            var preprocessFiles = new Array<string>();
            preprocessFiles.push(preprocessFile);

            var filesToPreProcess = await this.readFilesFolders(preprocessFiles, null, false);
            preProcessActivities = await this._transcriptGenerator.single(filesToPreProcess[0]);
        }

        var filesToProcess = await this.readFilesFolders(files, folders, includeSubFolders);
        

        this._stats = new Stats(filesToProcess.length);
        

        for (var fileToProcess of filesToProcess) {
            await this.single(preProcessActivities, fileToProcess);
        }
    }

    private async readFilesFolders(files: string[], folders: string[], includeSubFolders: boolean): Promise<FileInfo[]> {
        var filesToProcess = new Array<FileInfo>();

        if (files && files.length > 0) {
            for (var file of files) {
                filesToProcess.push(new FileInfo(file));
            }
        }

        if (folders && folders.length > 0) {
            for (var folder of folders) {
                var extensions = new Array<string>();
                extensions.push(Extensions.transcript);

                const files = FileSearcher.recursive(folder, extensions, includeSubFolders);

                files.map((file: any) => {
                    // compatibility with azure devops task. There is doesn't return fullPath.
                    if (file.fullPath) {
                        filesToProcess.push(new FileInfo(file.fullPath));
                    }
                    else {
                        filesToProcess.push(new FileInfo(file));
                    }
                });
            }
        }

        // remove and warn for invalid files
        for (var i = filesToProcess.length - 1; i >= 0; i--) {
            var ext = filesToProcess[i].extension;
            if (ext !== Extensions.transcript) {
                log.warn("WRN", `${filesToProcess[i].path} has an unknown extension and will be skipped. Only '*${Extensions.transcript}' files are recognized`);
                filesToProcess.splice(i, 1);
            }
        }

        return filesToProcess;
    }

    /**
      * Processes a single test file
      * @param {string} file - The filepath of the .chat file
      * @param {Array<JabberActivity>} preprocessActivities to process prior to the actual conversation
      */
    private async single(preprocessActivities: Array<JabberActivity>, file: FileInfo) {
        this._stats.beginTest();

        log.verbose("FILE", `Loading file ${file}`);
        var activities = await this._transcriptGenerator.single(file);

        if (!activities || activities.length <= 0) {
            log.warn("WRN", `No activities could be found in ${file.path}`);
        }
        else {
            if (preprocessActivities && preprocessActivities.length > 0) {
                log.verbose("PREPROCESS", `Inserting ${preprocessActivities.length} preprocessing activities before conversation activities`)
                activities = preprocessActivities.concat(activities);
            }

            await this._activityHandler.process(activities);
            this._stats.endTest(file, null);
        }
    }
}

export { Processor }
export { ActivityHandler } from './activityHandler';
export { RequestHandler } from './requestHandler';
export { TranscriptGenerator } from './transcriptGenerator';