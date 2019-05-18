[![Build Status](https://travis-ci.com/jvanderbiest/directline-jabber.svg?branch=master)](https://travis-ci.com/jvanderbiest/directline-jabber) [![Coverage Status](https://coveralls.io/repos/github/jvanderbiest/directline-jabber/badge.svg?branch=master)](https://coveralls.io/github/jvanderbiest/directline-jabber?branch=master)

# DirectLine Jabber
DirectLine-Jabber is a testing tool that communicates over the [DirectLine channel](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-channel-connect-directline?view=azure-bot-service-4.0) to test your Microsoft BotFramework transcripts.
This node.js application, written in typescript, reads your [Chatdown](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/Chatdown) conversation file and sends all chat activity to DirectLine. It will try to match the expected text of the bot with the one in the conversation file. 

The current release 0.1.0 is a beta release and only supports a limited scenario.

# Installation
DirectLine-Jabber requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the app.

```sh
$ cd directline-jabber
$ npm install
```

Run examples:
```sh
$ node app test --file <chatdownFilePath> --secret [directLineSecret] 
$ node app test --folder <chatdownFolderPath> --endpoint [tokenEndpoint] 
```

# Commandline arguments
| Command | Alias | Description | Remarks
| --- | --- | --- | --- |
| `--files` | `-fi` | chatdown file(s) to test. | Comma seperate for multiple
| `--folders` | `-fo` | folder(s) with chatdown files to test | Comma seperate for multiple
| `--secret` | `-s` | directline secret for authentication | Mutually exclusive with `endpoint`
| `--endpoint` | `-e` | endpoint to retrieve directline token | Mutually exclusive with `secret`
| `--includeSubfolders` | `-isfo` | includes subfolders when scanning for chatdown files' | defaults to `true`
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