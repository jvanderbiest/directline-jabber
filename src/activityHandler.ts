import log = require('npmlog');
import { RequestHandler } from './requestHandler';
import { ActivityRoles } from './constants';
import { Activity, Attachment } from './domain/activity';
import { JabberActivity } from './domain/jabberActivity';
import { JabberAttachment } from './domain/jabberAttachment';
import { JabberHeroCard } from './domain/jabberHeroCard';
var equal = require('fast-deep-equal');

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
      * @param {JabberActivity[]} activities - An array of transcribed activities
      */
    async process(activities: JabberActivity[]): Promise<void> {
        var authResponse = await this._requestHandler.authenticate();

        // ids of messages that are handled
        var messages = new Array<string>();
        var expectedTotalBotReplies = 0;

        // do not use foreach with async, it's not supported without modification.
        for (var i = 0; i < activities.length; i++) {
            // when we expect the bot to reply, check if there is a match
            if (activities[i].from.role == ActivityRoles.bot) {
                expectedTotalBotReplies = 1;

                // check if the next activity is also a bot activity so we can handle it at once.
                for (var j = 1; j < activities.length - i; j++) {
                    if (activities[i + j].from.role == ActivityRoles.bot) {
                        expectedTotalBotReplies++;
                    }
                    else {
                        break;
                    }
                }

                var allActivityEvents = (await this._requestHandler.getActivityResponse(authResponse));
                var activityEvents = allActivityEvents.filter((x: JabberActivity) => !messages.includes(x.id));

                if (activityEvents.length - expectedTotalBotReplies != 0) {
                    throw Error(`We are expecting ${expectedTotalBotReplies} bot replies but we retrieved ${activityEvents.length} bot replies. A total of ${messages.length} messages have been sent so far.`);
                }

                for (var n = 0; n < expectedTotalBotReplies; n++) {
                    var expectedActivity = activities[i + n];
                    var actualActivity = activityEvents[n];

                    this.assertText(expectedActivity, actualActivity);
                    this.assertAttachments(expectedActivity, actualActivity)

                    messages.push(actualActivity.id);
                }

                // if we handled more bot replies (other than the current one), make sure we skip them in our for loop
                i += expectedTotalBotReplies - 1;
            }
            else {
                // send out user queries
                var activityResponse = await this._requestHandler.sendActivity(authResponse, activities[i]);
                messages.push(activityResponse.id);
            }
        }
    }

    assertText(expected: Activity, actual: Activity) {
        var expectedText = expected.text.trim();
        var actualText = actual.text.trim();

        // only assert if there is text available
        if (!expectedText && !actualText) {
            return;
        }

        if (expectedText == actualText) {
            log.verbose("match", `text from transcript: ${expectedText} matches actual bot text`);
        }
        else {
            var errorMsg = `expected: '${expectedText}' but was '${actualText}'`;
            log.error("text mismatch", errorMsg);
            throw new Error(errorMsg);
        }
    }

    assertAttachments(expected: JabberActivity, actual: JabberActivity) {
        if (expected.attachments || actual.attachments) {
            if (expected.attachments.length != actual.attachments.length) {
                throw new Error(`Button count mismatch, expected ${expected.attachments.length} but got ${actual.attachments.length}`);
            }

            for (var i = 0; i < expected.attachments.length; i++) {
                
                    this.compareHeroCards(expected.attachments[i], actual.attachments[i])
            }
        }
    }

    compareHeroCards(expectedAttachment: JabberAttachment, actualAttachment: JabberAttachment) {
        if (expectedAttachment.isHeroCard() || actualAttachment.isHeroCard()) {
            log.verbose("COMPARE", "comparing hero cards");
            var isEqual = equal(expectedAttachment, actualAttachment);
            if (!isEqual) {
                throw Error(`Hero cards were not equal.\n\n Expected: ${JSON.stringify(expectedAttachment)} \n\nBut was: ${JSON.stringify(actualAttachment)}`);
            }
        }
    }
}