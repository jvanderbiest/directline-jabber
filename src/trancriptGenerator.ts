

import path = require('path');
import chalk = require('chalk');
import chatdown from 'chatdown';
import { Activity } from 'chatdown-domain';
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

  async single(file: string): Promise<Activity[]> {
    // var fileContents = txtfile.readSync(path.resolve(file));
    var fileContents = fs.readFileSync(path.resolve(file), 'utf8');
    var args = { in: file };

    var activities: Activity[];
    await chatdown(fileContents, args).then((fileActivities: Activity[]) => {
      activities = fileActivities;
    });

    return activities;
  }
}
