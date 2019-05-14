

import commander = require('commander');
import log = require('npmlog');
import { Processor } from './processor';
import { RequestHandler } from './requestHandler';
import { TranscriptGenerator } from './trancriptGenerator';
import { ActivityHandler } from './activityHandler';

class App {
    bootstrap() {
        commander
            .version('0.1.0')
            .description('a tool that communicates over directline that will test your Chatdown conversations')

        commander
            .command('test <file>')
            .alias('t')
            .option('-s, --secret <secret>', 'The secret to use when communicating with directline', null)
            .option('-v, --verbose', 'Enable verbose logging for troubleshooting', false)
            .description('test a scenario using directline')
            .action(async function(file: string, options: any) {
                if (options.verbose) {
                    log.level = 'verbose';
                }
                else {
                    log.level = 'info';
                }

                var requestHandler = new RequestHandler(options.secret);
                var activityHandler = new ActivityHandler(requestHandler);
                var transcriptGenerator = new TranscriptGenerator()
                var processor = new Processor(activityHandler, transcriptGenerator);
                await processor.single(file);
            });

        commander.parse(process.argv);
    }
}

var app = new App();
app.bootstrap();