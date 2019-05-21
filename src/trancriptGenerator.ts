

import path = require('path');
import chatdown from 'chatdown';
import { Activity, ChannelAccount } from 'chatdown-domain';
import { FileInfo } from './domain/fileInfo';
import { Extensions } from './constants';
import { JabberActivity } from './domain/jabberActivity';

var fs = require('fs');

/**
 * Transcript generator which consumes a .chat file to generate mock transcripts. Uses existing tool "chatdown" (https://github.com/microsoft/botbuilder-tools/tree/master/packages/Chatdown)
 */
export class TranscriptGenerator {

  /**
    * Generates a transcript for a single file
    *
    * @param {string} file - The filepath of the .chat file
    * @return {Promise<Activity[]} A promise with an array of activities that got generated
    *
    * @example
    *
    *     single('c:\folder\file.chat')
    */

  async single(file: FileInfo): Promise<Activity[]> {
    var fileContents = fs.readFileSync(path.resolve(file.path), 'utf8');
    var activities: Activity[] = new Array<Activity>();

    if (file.extension == Extensions.chatdown) {
      var args = { in: file };
      await chatdown(fileContents, args).then((fileActivities: Activity[]) => {
        activities = fileActivities;
      });
    }
    else if (file.extension == Extensions.transcript) {
      var jsonActivities = JSON.parse(fileContents);

      if (Array.isArray(jsonActivities)) {
        for (var activity of jsonActivities) {
          activities.push(new JabberActivity().parse(activity))
        }
      }
    }

    return activities;
  }
}

