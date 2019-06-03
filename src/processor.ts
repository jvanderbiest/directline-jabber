import { TranscriptGenerator } from './transcriptGenerator';
import { RequestHandler } from './requestHandler';
import { ActivityHandler } from './activityHandler';
import { Stats } from './stats';
import { FileInfo } from './domain/fileInfo';
import { Extensions } from './constants';
import log = require('npmlog');
import { FileSearcher } from "./fileSearcher";

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
     * @param {Array<string>} files an array of filepaths
     * @param {Array<string>} folders an array of folders to scan for .chat files
     * @param {boolean} includeSubFolders includes sub folders when scanning
     * @param {boolean} isAzureDevopsTask - Determines if the method is executed from an Azure Devops pipeline task
     */
    async start(files: Array<string>, folders: Array<string>, includeSubFolders: boolean, isAzureDevopsTask? : boolean) {
        var filesToProcess = await this.readFilesFolders(files, folders, includeSubFolders);

        this._stats = new Stats(filesToProcess.length);

        for (var fileToProcess of filesToProcess) {
            await this.single(fileToProcess, isAzureDevopsTask);
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
                extensions.push(Extensions.chatdown);

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
            if (ext !== Extensions.transcript && ext !== Extensions.chatdown) {
                log.warn("WRN", `${filesToProcess[i].path} has an unknown extension and will be skipped. Only '*${Extensions.transcript}' and '*${Extensions.chatdown}' are recognized`);
                filesToProcess.splice(i, 1);
            }
        }

        return filesToProcess;
    }

    /**
      * Processes a single test file
      *
      * @param {string} file - The filepath of the .chat file
      * @param {boolean} isAzureDevopsTask - Determines if the method is executed from an Azure Devops pipeline task
      *
      */
    private async single(file: FileInfo, isAzureDevopsTask: boolean) {
        this._stats.beginTest();

        log.verbose("FILE", `Loading file ${file}`);
        var activities = await this._transcriptGenerator.single(file, isAzureDevopsTask);

        if (!activities || activities.length <= 0) {
            log.warn("WRN", `No activities could be found in ${file.path}`);
        }
        else {
            await this._activityHandler.process(activities);
            this._stats.endTest(file, null);
        }
    }
}

export { Processor }
export { ActivityHandler } from './activityHandler';
export { RequestHandler } from './requestHandler';
export { TranscriptGenerator } from './transcriptGenerator';