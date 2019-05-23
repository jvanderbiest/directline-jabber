
import log = require('npmlog');
import { Activity } from 'chatdown-domain';
import { RequestHandler } from './requestHandler';
import { ActivityRoles } from './constants';

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
    async process(activities: Activity[]): Promise<void> {
        var authResponse = await this._requestHandler.authenticate();

        var totalReplies = 0;

        // do not use foreach with async, it's not supported without modification.
        for (var i = 0; i < activities.length; i++) {
            if (activities[i].from.role == ActivityRoles.bot) {
                totalReplies = 1;
                for (var j = 1; j < activities.length - i; j++) {
                    if (activities[i + j].from.role == ActivityRoles.bot) {
                        totalReplies++;
                    }
                    else {
                        break;
                    }
                }

                var activityEvents = await this._requestHandler.getActivityResponse(authResponse);
                var currentActivityEventId = activityEvents.length - totalReplies;

                for (var n = currentActivityEventId; n < activityEvents.length; n++) {
                    var iterations = 0;
                    if (activities[i + iterations].text.trim() == activityEvents[n].text.trim()) {
                        log.verbose("match", `text from file: ${activityEvents[0].text} matches bot text ${activityEvents[0].text}`);
                    }
                    else {
                        var errorMsg = `expected: ${activityEvents[0].text} but was ${activities[i + iterations].text}`;
                        log.error("mismatch", errorMsg);
                        throw new Error(errorMsg)
                    }
                    iterations++;
                }
            }
            else {
                await this._requestHandler.sendActivity(authResponse, activities[i]);
            }
        }
    }
}