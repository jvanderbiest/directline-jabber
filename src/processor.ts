import { FileSubmitter } from './fileSubmitter';
import { RequestHandler } from './requestHandler';
import log = require('npmlog');

export class Processor {
    async handleTestFile(file: string, options: any) {
        log.info("FILE", `Loading file ${file}`);
        var fileActivities = await new FileSubmitter().single(file);

        var requestHandler = new RequestHandler();
        var authResponse = await requestHandler.authenticate(options.secret);

        // var eventActivity = new EventActivityRequest();
        // eventActivity.from = new EventActivityFrom();
        // eventActivity.from.id = 'b503a35a-5ec3-440a-865f-c5d997f3217e';
        // eventActivity.from.name = 'user';
        // eventActivity.name = 'welcome';
        // eventActivity.type = 'event';
        // eventActivity.value = '';

        var watermark = 0;

        // do not use foreach with async, it's not supported without modification.
        for (var x of fileActivities) {
            if (x.type == "conversationUpdate") {
                continue;
            }

            if (x.from.role == "bot") {
                // we will get the replies back from the directline channel to match with the ones of the bot
                var activityEvents = await requestHandler.getActivityResponse(authResponse, watermark);

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
                await requestHandler.sendActivity(authResponse, x);

                // when the user uploads an attachment, the bot will reply with the attachment, we can skip that
                if (x.attachments && x.attachments.length > 0) {
                    watermark++;
                }
            }
        }

        log.info("success", "Conversation was successful!");
    }
  }
  
