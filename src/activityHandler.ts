
import log = require('npmlog');
import { Activity } from 'chatdown-domain';
import { RequestHandler } from './requestHandler';
import { ActivityTypes, ActivityRoles } from './constants';

/** Handles the complete process to test transcripts with directline */
export class ActivityHandler {
    _requestHandler: RequestHandler;

    /**
     * 
     * @param {RequestHandler} requestHandler - Handles http requests
     */
    constructor(requestHandler: RequestHandler) {
        this._requestHandler = requestHandler;
    }

    /**
      * Processes an array of activities by sending them to directline
      *
      * @param {Activity[]} activities - An array of transcribed activities
      */
    async process(activities: Activity[]) : Promise<void> {
        var authResponse = await this._requestHandler.authenticate();
        var watermark = 0;

        // do not use foreach with async, it's not supported without modification.
        for (var x of activities) {
            
            if (x.from.role == ActivityRoles.bot) {
                // we will get the replies back from the directline channel to match with the ones of the bot
                var activityEvents = await this._requestHandler.getActivityResponse(authResponse, watermark);

                watermark++;
                if (x.text == activityEvents[0].text) {
                    log.verbose("match", `text from file: ${activityEvents[0].text} matches bot text ${activityEvents[0].text}`);
                }
                else {
                    var errorMsg = `expected: ${activityEvents[0].text} but was ${activityEvents[0].text}`;
                    log.error("mismatch", errorMsg);
                    throw new Error(`Expected ${activityEvents[0].text} but got ${x.text}`)
                }
            }
            else {
                await this._requestHandler.sendActivity(authResponse, x);

                // when the user uploads an attachment, the bot will reply with the attachment, we can skip that
                if (x.attachments && x.attachments.length > 0) {
                    watermark++;
                }
            }
        }
    }
}