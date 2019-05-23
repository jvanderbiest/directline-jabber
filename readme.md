[!npm](https://img.shields.io/npm/v/directline-jabber.svg) [![Build Status](https://travis-ci.com/jvanderbiest/directline-jabber.svg?branch=master)](https://travis-ci.com/jvanderbiest/directline-jabber) [![Coverage Status](https://coveralls.io/repos/github/jvanderbiest/directline-jabber/badge.svg?branch=master)](https://coveralls.io/github/jvanderbiest/directline-jabber?branch=master)


# DirectLine Jabber
DirectLine-Jabber focusses on automated integration testing for the [Microsoft BotFramework](https://github.com/microsoft/botframework-sdk). Using your [BotFramework emulator](https://github.com/microsoft/BotFramework-Emulator) transcripts or [Chatdown](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/Chatdown) files it will check if your bot responds as it is supposed to respond.

It tests your conversations by authenticating and sending the activities over [Direct Line]((https://docs.microsoft.com/en-us/azure/bot-service/bot-service-channel-connect-directline?view=azure-bot-service-4.0)). 

The current release 1.0.0 supports a limited scenario with text and attachments only. Other scenario's with adaptive cards are scheduled for a later release.

# Prerequisites
- [node.js](https://nodejs.org/) v10+
- a deployed bot instance
- a Direct Line channel

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
## Secret
You can use the secret key that comes with your Direct Line channel in your Azure bot channels registration.

## Token
If your bot exposes a [token endpoint](https://docs.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-direct-line-3-0-authentication?view=azure-bot-service-4.0) that generates a token from the directlineSecret you can use that. Your token endpoint response response should be a token object `{token: ''}`, a token string or a stringified token string.

# Installation
Install the dependencies and start the app.

```sh
$ cd directline-jabber
$ npm install
```

Run examples:
```sh
$ node app test --files <filePath,...> --secret [directLineSecret] 
$ node app test --dirs <directory,...> --endpoint [tokenEndpoint] 
```

# Testing
```sh
$ npm test
```

# Sample
![DirectLine-Jabber Chatdown example](/docs/screenshots/chatdown-conversation.png?raw=true "Chatdown conversation")
![DirectLine-Jabber in action](/docs/screenshots/cmd-directline-jabber.png?raw=true "Command Line")

# License
DirectLine-Jabber is licensed under The MIT License (MIT). Which means that you can use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the application. But you always need to state that this repository is the original author of this application.