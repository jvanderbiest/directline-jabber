import { TranscriptGenerator } from './trancriptGenerator';
import { RequestHandler } from './requestHandler';
import log = require('npmlog');
import { ActivityHandler } from './activityHandler';

/** Handles the complete process to test transcripts with directline */
export class Processor {
    _activityHandler: ActivityHandler;
    _requestHandler: RequestHandler;
    _transcriptGenerator: TranscriptGenerator;

    constructor(
        activityHandler: ActivityHandler,
        transcriptGenerator: TranscriptGenerator) {
        this._activityHandler = activityHandler;
        this._transcriptGenerator = transcriptGenerator;
    }

    /**
      * Processes a single test file
      *
      * @param {string} file - The filepath of the .chat file
      *
      * @example
      *
      *     handleFile('c:\folder\file.chat')
      */
    async single(file: string) {
        log.verbose("FILE", `Loading file ${file}`);
        var activities = await this._transcriptGenerator.single(file);

        if (!activities || activities.length <= 0) {
            log.error("ERR", `No activities could be found in ${file}`);
        }
        else {
            await this._activityHandler.process(activities);
            log.info("success", "Conversation was successful!");
        }
    }
}