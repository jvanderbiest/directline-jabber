[![npm](https://img.shields.io/npm/v/directline-jabber.svg)](https://www.npmjs.com/package/directline-jabber) [![Build Status](https://travis-ci.com/jvanderbiest/directline-jabber.svg?branch=master)](https://travis-ci.com/jvanderbiest/directline-jabber) [![Coverage Status](https://coveralls.io/repos/github/jvanderbiest/directline-jabber/badge.svg?branch=master)](https://coveralls.io/github/jvanderbiest/directline-jabber?branch=master)


# DirectLine Jabber
DirectLine-Jabber focusses on automated integration testing for the [Microsoft BotFramework](https://github.com/microsoft/botframework-sdk). Using your [BotFramework emulator](https://github.com/microsoft/BotFramework-Emulator) transcript files it will check if your bot responds as it is supposed to respond.

It tests your conversations by authenticating and sending the activities over [Direct Line]((https://docs.microsoft.com/en-us/azure/bot-service/bot-service-channel-connect-directline?view=azure-bot-service-4.0)). 

# Prerequisites
- [node.js](https://nodejs.org/) v10+
- a deployed bot instance
- a Direct Line channel

# Commandline arguments
| Command | Flag | Description | Remarks
| --- | --- | --- | --- |
| `--files` |  | transcript file(s) to test. | Comma seperate for multiple
| `--dirs` |  | directory or directories with transcript files to test | Comma seperate for multiple
| `--preprocess` | | activities to process prior to the actual conversation file | 
| `--userid` | `-u` | replaces user id in activities | 
| `--useridprefix` | | prefixes userId in activities | 
| `--secret` |  | directline secret for authentication | Mutually exclusive with `endpoint`
| `--endpoint` |  | endpoint to retrieve directline token | Mutually exclusive with `secret`
| `--recursive` | `-r` | recursivly scanning for files in directory' | defaults to `true`
| `--verbose` | `-v` | enables verbose logging | defaults to `false`

# Authentication
## Secret
You can use the secret key that comes with your Direct Line channel in your Azure bot channels registration.

## Token
If your bot exposes a [token endpoint](https://docs.microsoft.com/en-us/azure/bot-service/rest-api/bot-framework-rest-direct-line-3-0-authentication?view=azure-bot-service-4.0) that generates a token from the directlineSecret you can use that. Your token endpoint response response should be a token object `{token: ''}`, a token string or a stringified token string. Click [here](https://github.com/jvanderbiest/directline-jabber-demo) for a demo implementation.

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
There is a complete tutorial available: https://github.com/jvanderbiest/directline-jabber-demo

## Preprocessing
In case you need to execute other activities prior to your conversation activities, you can use the preproccess flag to specify the activities file. This could be used to send custom events before your tests are executing.

## UserId
You could use a fixed user id in activities or use a prefix for each user id.

# Azure Devops Pipeline Task

![Directline Jabber](https://github.com/jvanderbiest/directline-jabber-az-pipeline/blob/master/images/extension-icon.png)

There is a task available on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=jvanderbiest.directline-jabber-task) to use for automated testing. Pipeline source can be found [here](https://github.com/jvanderbiest/directline-jabber-az-pipeline)

# License
DirectLine-Jabber is licensed under The MIT License (MIT). Which means that you can use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the application. But you always need to state that this repository is the original author of this application.
