[![Build Status](https://travis-ci.com/jvanderbiest/directline-jabber.svg?branch=master)](https://travis-ci.com/jvanderbiest/directline-jabber) [![Coverage Status](https://coveralls.io/repos/github/jvanderbiest/directline-jabber/badge.svg?branch=master)](https://coveralls.io/github/jvanderbiest/directline-jabber?branch=master)

# DirectLine Jabber
DirectLine-Jabber is a testing tool that communicates over the [DirectLine channel](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-channel-connect-directline?view=azure-bot-service-4.0) to test your Microsoft BotFramework transcripts.
This node.js application, written in typescript, reads your [Chatdown](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/Chatdown) conversation file and sends all chat activity to DirectLine. It will try to match the expected text of the bot with the one in the conversation file. 

The current release 0.1.0 is a beta release and only supports a limited scenario.

# Installation
DirectLine-Jabber requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ cd directline-jabber
$ npm install
$ node app test <chatdownFilePath> -s [directLineSecret] 
```

# Debugging
You can enable verbose logging by adding a `-v` or `--verbose` argument to the commandline statement

# Tests
Currently there are no tests, this is planned for an upcoming release.

# Sample
![DirectLine-Jabber Chatdown example](/docs/screenshots/chatdown-conversation.png?raw=true "Chatdown conversation")
![DirectLine-Jabber in action](/docs/screenshots/cmd-directline-jabber.png?raw=true "Command Line")

# License
MIT