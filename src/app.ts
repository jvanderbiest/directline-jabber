import commander = require('commander');
import log = require('npmlog');
import { Processor } from './processor';
import { RequestHandler } from './requestHandler';
import { TranscriptGenerator } from './trancriptGenerator';
import { ActivityHandler } from './activityHandler';
import { resolve } from 'bluebird';

class App {
    bootstrap() {
        function commaSeparatedList(value : string, dummyPrevious : string) {
            return value.split(',');
          }

        commander
            .version('0.1.0')
            .description('a tool that communicates over directline that will test your Chatdown conversations')

        commander
            .command('test')
            .option('-fi, --files [files]', 'chatdown file(s) to test. Add multiple by comma seperating them.', commaSeparatedList)
            .option('-fo, --folders [folders]', 'folder(s) with chatdown files to test', commaSeparatedList)
            .option('-s, --secret [secret]', 'directline secret for authentication', null)
            .option('-e, --endpoint [endpoint]', 'endpoint to retrieve directline token', null)
            .option('-isfo, --includeSubfolders', 'includes subfolders when scanning for chatdown files', true)
            .option('-v, --verbose', 'enables verbose logging', false)
            .description('test a scenario using directline')
            .action(async function(options: any) {
                if ((!options.files || options.files.length <= 0) && (!options.folders || options.folders.length <= 0)) {
                    log.error('ERR', 'please specify chatdown file(s) (--files) and/or folder(s) (--folders) that contains your chatdown files');
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
                await processor.start(options.files, options.folders, options.includeSubfolders);
            });

        commander.parse(process.argv);
    }
}

var app = new App();
app.bootstrap();