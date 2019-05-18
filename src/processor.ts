import { TranscriptGenerator } from './trancriptGenerator';
import { RequestHandler } from './requestHandler';
import log = require('npmlog');
import { ActivityHandler } from './activityHandler';
import { Stats } from './stats';
import { FileInfo } from './domain/fileInfo';
var readdirp = require('readdirp');

/** Handles the complete process to test transcripts with directline */
export class Processor {
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
     * @param files an array of filepaths
     * @param folders an array of folders to scan for .chat files
     * @param includeSubFolders includes sub folders when scanning up to 15 levels deep
     */
    async start(files: string[], folders: string[], includeSubFolders: boolean) {
        var filesToProcess = await this.readFilesFolders(files, folders, includeSubFolders);

        this._stats = new Stats(filesToProcess.length);

        for (var fileToProcess of filesToProcess) {
            await this.single(fileToProcess);
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
                const files = await readdirp.promise(folder, { fileFilter: '*.chat', depth: includeSubFolders ? 15 : 0 });
                files.map((file : any) => filesToProcess.push(new FileInfo(file.fullPath)));
            }
        }

        return filesToProcess;
    }

    /**
      * Processes a single test file
      *
      * @param {string} file - The filepath of the .chat file
      *
      */
    private async single(file: FileInfo) {
        this._stats.beginTest();

        log.verbose("FILE", `Loading file ${file}`);
        var activities = await this._transcriptGenerator.single(file.path);

        if (!activities || activities.length <= 0) {
            log.warn("WRN", `No activities could be found in ${file.path}`);
        }
        else {
            await this._activityHandler.process(activities);
            this._stats.endTest(file, null);
        }
    }
}