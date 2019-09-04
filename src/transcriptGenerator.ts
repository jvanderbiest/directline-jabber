import path = require('path');
import { FileInfo } from './domain/fileInfo';
import { Extensions, ActivityTypes } from './constants';
import { JabberActivity } from './domain/jabberActivity';
import fs = require('fs');
import log = require('npmlog');
import { Activity } from './domain/activity';

/**
 * Transcript generator which consumes a .transcript file to generate mock transcripts.
 */
export class TranscriptGenerator {
  _userId: string;
  _userIdPrefix: string;

  constructor(userId: string, userIdPrefix: string) {
    this._userId = userId;
    this._userIdPrefix = userIdPrefix;
  }

  /**
    * Generates a transcript for a single file
    *
    * @param {FileInfo} file - A fileInfo object that contains a reference to a file on disk
    * @return {Promise<Activity[]} A promise with an array of activities that have been generated from the file
    */

  async single(file: FileInfo): Promise<JabberActivity[]> {
    var fileContents = fs.readFileSync(path.resolve(file.path), 'utf8');
    var activities: JabberActivity[] = new Array<JabberActivity>();

    if (file.extension == Extensions.transcript) {
      var jsonActivities = JSON.parse(fileContents);

      if (Array.isArray(jsonActivities)) {
        for (var activity of jsonActivities) {
          var jabberActivity = new JabberActivity().parse(activity, this._userId, this._userIdPrefix);

          // filter out typing activities at an early stage so we don't have to deal with them later.
          if (jabberActivity.type != ActivityTypes.typing) {
            activities.push(jabberActivity);
          }
        }
      }
      else if (jsonActivities) {
        throw new Error(`Activities have been found but were in incorrect format. Activities should be part of an array.`);
      }
    }

    return activities;
  }
}
