import path = require('path');
import { FileInfo } from './domain/fileInfo';
import { Extensions, ActivityTypes } from './constants';
import { JabberActivity } from './domain/jabberActivity';
import fs = require('fs');
import { Activity } from './domain/activity';

/**
 * Transcript generator which consumes a .transcript file to generate mock transcripts.
 */
export class TranscriptGenerator {

  /**
    * Generates a transcript for a single file
    *
    * @param {FileInfo} file - A fileInfo object that contains a reference to a file on disk
    * @param {boolean} isAzureDevopsTask - Determines if the method is executed from an Azure Devops pipeline task
    * @return {Promise<Activity[]} A promise with an array of activities that have been generated from the file
    */

  async single(file: FileInfo, isAzureDevopsTask: boolean): Promise<Activity[]> {
    var fileContents = fs.readFileSync(path.resolve(file.path), 'utf8');
    var activities: Activity[] = new Array<Activity>();

    if (file.extension == Extensions.transcript) {
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
