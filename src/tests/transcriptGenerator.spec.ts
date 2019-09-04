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

			var activities = await sut.single(new FileInfo("c:\\dir\\file.transcript"));

			expect(activities.filter(x => x.type == ActivityTypes.typing).length).to.equal(0, 'There should be no typing activities');
		});


		it('should only return activities if file extension matches', async () => {
			var activities = await sut.single(new FileInfo("c:\\dir\\file.foo"));

			expect(activities.length).to.equal(0, 'There should be no activities');
		});

		it('should throw when activities are not an array', async () => {
			fsStub.readFileSync = function () {
				return `{"some": "json"}`;
			};

			var error = await sut.single(new FileInfo("c:\\dir\\file.transcript")).catch(err => err);
			expect(error.message).to.equal("Activities have been found but were in incorrect format. Activities should be part of an array.");
		});
	});
});