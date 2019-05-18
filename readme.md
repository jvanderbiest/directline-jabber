[![Build Status](https://travis-ci.com/jvanderbiest/directline-jabber.svg?branch=master)](https://travis-ci.com/jvanderbiest/directline-jabber) [![Coverage Status](https://coveralls.io/repos/github/jvanderbiest/directline-jabber/badge.svg?branch=master)](https://coveralls.io/github/jvanderbiest/directline-jabber?branch=master)

# DirectLine Jabber
DirectLine-Jabber is a testing tool that communicates over the [DirectLine channel](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-channel-connect-directline?view=azure-bot-service-4.0) to test your Microsoft BotFramework transcripts.
This node.js application, written in typescript, reads your [Chatdown](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/Chatdown) conversation file and sends all chat activity to DirectLine. It will try to match the expected text of the bot with the one in the conversation file. 

The current release 1.0.0 supports a limited scenario with text and attachments only. Other scenario's with adaptive cards are scheduled for a later release.

# Installation
DirectLine-Jabber requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the app.

```sh
$ cd directline-jabber
$ npm install
```

Run examples:
```sh
$ node app test --files <chatdownFilePath(s)> --secret [directLineSecret] 
$ node app test --folders <chatdownFolderPath(s)> --endpoint [tokenEndpoint] 
```

# Commandline arguments
| Command | Flag | Description | Remarks
| --- | --- | --- | --- |
| `--files` | `-f` | chatdown file(s) to test. | Comma seperate for multiple
| `--dirs` | `-d` | directory or directories with chatdown files to test | Comma seperate for multiple
| `--secret` | `-s` | directline secret for authentication | Mutually exclusive with `endpoint`
| `--endpoint` | `-e` | endpoint to retrieve directline token | Mutually exclusive with `secret`
| `--recursive` | `-r` | recursivly scanning for chatdown files in directory' | defaults to `true`
| `--verbose` | `-v` | enables verbose logging | defaults to `false`

# Authentication
You could authenticate with DirectLine using the directline secret that can be found in your bot registration DirectLine channel on Azure. Or if you already have a [token endpoint](https://docs.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-direct-line-3-0-authentication?view=azure-bot-service-4.0) that generates a token from the directlineSecret you could also use that. The returned response should be a token object, a token string or a stringified token string.

# Testing
```sh
$ npm test
```

# Sample
![DirectLine-Jabber Chatdown example](/docs/screenshots/chatdown-conversation.png?raw=true "Chatdown conversation")
![DirectLine-Jabber in action](/docs/screenshots/cmd-directline-jabber.png?raw=true "Command Line")

# License
MIT