

import path = require('path');
import chalk = require('chalk');
import chatdown from 'chatdown';
import { Activity } from 'chatdown-domain';
var fs = require('fs');

export class FileSubmitter {
  async single(file: string) : Promise<Activity[]> {
    // var fileContents = txtfile.readSync(path.resolve(file));
    var fileContents = fs.readFileSync(path.resolve(file), 'utf8');
    var args = { in: file };

    var activities : Activity[];
    await chatdown(fileContents, args).then((fileActivities: Activity[]) => {
      activities = fileActivities;
    });

    return activities;
  }
}
