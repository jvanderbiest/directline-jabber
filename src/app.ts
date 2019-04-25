

import commander = require('commander');
import log = require('npmlog');
import { Processor } from './processor';

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

                var processor = new Processor();
                await processor.handleTestFile(file, options);
            });

        commander.parse(process.argv);
    }
}

var app = new App();
app.bootstrap();