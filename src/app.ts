import commander = require('commander');
import log = require('npmlog');
import { Processor } from './processor';
import { RequestHandler } from './requestHandler';
import { TranscriptGenerator } from './trancriptGenerator';
import { ActivityHandler } from './activityHandler';
import { resolve } from 'bluebird';

class App {
    bootstrap() {
        commander
            .version('0.1.0')
            .description('a tool that communicates over directline that will test your Chatdown conversations')

        commander
            .command('test')
            .option('-fi, --file [file]', 'chatdown file to test', null)
            .option('-fo, --folder [folder]', 'folder with chatdown files to test', null)
            .option('-s, --secret [secret]', 'directline secret for authentication', null)
            .option('-e, --endpoint [endpoint]', 'endpoint to retrieve directline token', null)
            .option('-v, --verbose', 'enables verbose logging', false)
            .description('test a scenario using directline')
            .action(async function(options: any) {
                if (!options.file && !options.folder) {
                    log.error('ERR', 'please specify a chatdown file (--file) or a folder (--folder) that contains your chatdown files');
                    return;
                }

                if (!options.secret && !options.endpoint) {
                    log.error('ERR', 'please specify a secret or an endpoint for authentication');
                    return;
                }

                if (options.verbose) {
                    log.level = 'verbose';
                }
                else {
                    log.level = 'info';
                }

                var requestHandler = new RequestHandler(options.secret, options.endpoint);
                var activityHandler = new ActivityHandler(requestHandler);
                var transcriptGenerator = new TranscriptGenerator()
                var processor = new Processor(activityHandler, transcriptGenerator);
                await processor.single(options.file);
            });

        commander.parse(process.argv);
    }
}

var app = new App();
app.bootstrap();