import log = require('npmlog');
import { RequestHandler } from './requestHandler';
import { ActivityRoles } from './constants';
import { Activity } from './domain/activity';

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

        // ids of messages that are handled
        var messages = new Array<string>(); 
        var totalReplies = 0;

        // do not use foreach with async, it's not supported without modification.
        for (var i = 0; i < activities.length; i++) {
            // when we expect the bot to reply, check if there is a match
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

                var allActivityEvents = (await this._requestHandler.getActivityResponse(authResponse));
                var activityEvents = allActivityEvents.filter((x : Activity) => !messages.includes(x.id));
                
                if (activityEvents.length - totalReplies < 0) {
                    log.error('ERROR', `We are expecting ${totalReplies} bot replies but we retrieved ${activityEvents.length} bot replies. A total of ${messages.length} messages have been sent so far.`);
                }

                var iterations = 0;
                for (var n = 0; n < activityEvents.length; n++) {
                    if (activities[i + iterations].text.trim() == activityEvents[n].text.trim()) {
                        log.verbose("match", `text from file: ${activities[i + iterations].text} matches bot text ${activityEvents[n].text}`);
                    }
                    else {
                        var errorMsg = `expected: '${activities[i + iterations].text}' but was '${activityEvents[n].text}'`;
                        log.error("mismatch", errorMsg);
                        throw new Error(errorMsg);
                    }
                    iterations++;
                    messages.push(activityEvents[n].id);
                }
                
                // skip handling this message as it has already been handled now.
                i += iterations;
            }
            else {
                // send out user queries
                var activityResponse = await this._requestHandler.sendActivity(authResponse, activities[i]);
                messages.push(activityResponse.id);
            }
        }
    }
}