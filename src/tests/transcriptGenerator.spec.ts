import { expect } from 'chai';
import { FileInfo } from '../domain/fileInfo';
import { TranscriptGenerator } from '../transcriptGenerator';
import { FileSeedHelper } from './helpers/fileSeedHelper';
import { ActivityTypes } from '../constants';
var proxyquire = require('proxyquire');

describe('Transcript generator tests', () => {
	var fsStub: any = {};
	var sut : TranscriptGenerator;

	beforeEach(async () => {
		var proxyQuire = proxyquire('../transcriptGenerator', { 'fs': fsStub });
		
		sut = new proxyQuire.TranscriptGenerator();
	});

	describe('single', () => {
		it('should parse and filter out typing activities from transcript 1 file', async () => {
			fsStub.readFileSync = function () {
				return FileSeedHelper.transcript1();
			};

			var activities = await sut.single(new FileInfo("c:\\dir\\file.transcript"), false);

			expect(activities.filter(x => x.type == ActivityTypes.typing).length).to.equal(0, 'There should be no typing activities');
		});

		it('should parse and filter out empty from or recipient from chatdown file', async () => {
			fsStub.readFileSync = function () {
				return FileSeedHelper.chatdown1();
			};

			var activities = await sut.single(new FileInfo("c:\\dir\\file.chat"), false);

			expect(activities.filter(x => !x.from || !x.recipient).length).to.equal(0, 'There should no activities with undefined role or recipient');
		});

		it('should only return activities if file extension matches', async () => {
			var activities = await sut.single(new FileInfo("c:\\dir\\file.foo"), false);

			expect(activities.length).to.equal(0, 'There should be no activities');
		});

		it('should not process chatdown conversations when executed from Azure Devops pipeline task',  async () => {
			fsStub.readFileSync = function () {
				return FileSeedHelper.chatdown1();
			};

			var activities = await sut.single(new FileInfo("c:\\dir\\file.chat"), true);

			expect(activities.length).to.equal(0, 'There should be no activities');
		});

		it('should process chatdown conversations when not executed from Azure Devops pipeline task',  async () => {
			fsStub.readFileSync = function () {
				return FileSeedHelper.chatdown1();
			};

			var activities = await sut.single(new FileInfo("c:\\dir\\file.chat"), false);

			expect(activities.length).to.greaterThan(0, 'There should be activities');
		});
	});
});