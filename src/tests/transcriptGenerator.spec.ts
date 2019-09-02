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


		it('should only return activities if file extension matches', async () => {
			var activities = await sut.single(new FileInfo("c:\\dir\\file.foo"), false);

			expect(activities.length).to.equal(0, 'There should be no activities');
		});
	});
});