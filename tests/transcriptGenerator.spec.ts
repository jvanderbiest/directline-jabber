import { expect, assert } from 'chai';
import { ActivityHandler } from '../src/activityHandler';
import * as sinon from 'sinon';
import { Activity } from 'chatdown-domain';
import { RequestHandler } from '../src/requestHandler';
import { ActivityHelper } from './helpers/activityHelper';

import { FileInfo } from '../src/domain/fileInfo';
import rewiremock from 'rewiremock';
import { ImportMock, MockManager } from 'ts-mock-imports';
import * as fsModule from 'fs';
import { TranscriptGenerator } from '../src/trancriptGenerator';
import { FileSeedHelper } from './helpers/fileSeedHelper';
import { ActivityTypes } from '../src/constants';
var proxyquire = require('proxyquire');

describe('Transcript generator tests', () => {
	var fsStub: any = {};
	var sut : TranscriptGenerator;

	beforeEach(async () => {
		var proxyQuire = proxyquire('../src/trancriptGenerator', { 'fs': fsStub });
		
		
		sut = new proxyQuire.TranscriptGenerator();
	});

	describe('single', () => {
		it('should parse and filter out typing activities from transcript file', async () => {
			fsStub.readFileSync = function () {
				return FileSeedHelper.transcript1();
			};

			var activities = await sut.single(new FileInfo("c:\dir\file.transcript"));

			expect(activities.filter(x => x.type == ActivityTypes.typing).length).to.equal(0, 'There should be no typing activities');
		});

		it('should parse and filter out empty from or recipient from chatdown file', async () => {
			fsStub.readFileSync = function () {
				return FileSeedHelper.chatdown1();
			};

			var activities = await sut.single(new FileInfo("c:\dir\file.chat"));

			expect(activities.filter(x => !x.from || !x.recipient).length).to.equal(0, 'There should no activities with undefined role or recipient');
		});

		it('should only return activities if file extension matches', async () => {
			var activities = await sut.single(new FileInfo("c:\dir\file.foo"));

			expect(activities.length).to.equal(0, 'There should be no activities');
		});
	});
});