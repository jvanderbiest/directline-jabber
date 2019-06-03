import path = require('path');
import { FileInfo } from './domain/fileInfo';
import { Extensions, ActivityTypes } from './constants';
import { JabberActivity } from './domain/jabberActivity';
import fs = require('fs');
import * as chatdown from 'chatdown';
import log = require('npmlog');

/**
 * Transcript generator which consumes a .chat file to generate mock transcripts. Uses existing tool "chatdown" (https://github.com/microsoft/botbuilder-tools/tree/master/packages/Chatdown)
 */
export class TranscriptGenerator {

  /**
    * Generates a transcript for a single file
    *
    * @param {FileInfo} file - A fileInfo object that contains a reference to a file on disk
    * @param {boolean} isAzureDevopsTask - Determines if the method is executed from an Azure Devops pipeline task
    * @return {Promise<Activity[]} A promise with an array of activities that have been generated from the file
    */

  async single(file: FileInfo, isAzureDevopsTask: boolean): Promise<chatdown.Activity[]> {
    var fileContents = fs.readFileSync(path.resolve(file.path), 'utf8');
    var activities: chatdown.Activity[] = new Array<chatdown.Activity>();

    if (file.extension == Extensions.chatdown) {
      if (isAzureDevopsTask) {
        log.warn("WRN", `Chatdown is not supported using azure devops pipeline tasks. Please convert to a transcript file first.`)
      }
      else {
        var args = { in: file.path };
        await chatdown.default(fileContents, args).then((fileActivities: chatdown.Activity[]) => {
          activities = fileActivities.filter(x => x.from && x.recipient);
        });
      }
    }
    else if (file.extension == Extensions.transcript) {
      var jsonActivities = JSON.parse(fileContents);

      if (Array.isArray(jsonActivities)) {
        for (var activity of jsonActivities) {
          var jabberActivity = new JabberActivity().parse(activity);

          // filter out typing activities at an early stage so we don't have to deal with them later.
          if (jabberActivity.type != ActivityTypes.typing) {
            activities.push(jabberActivity);
          }
        }
      }
    }

    return activities;
  }
}
