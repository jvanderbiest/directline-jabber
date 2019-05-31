import { expect } from 'chai';
import { Processor } from '../processor';
import { ActivityHandler } from '../activityHandler';
import { TranscriptGenerator } from '../transcriptGenerator';
import * as sinon from 'sinon';
import { JabberActivity } from '../domain/jabberActivity';
import { FileInfo } from '../domain/fileInfo';
import { Activity } from 'chatdown';
var proxyquire = require('proxyquire');

describe('Processor tests', () => {
	var fileFinderStub: any = {};
	var sut: Processor;
	var activityHandler: ActivityHandler;
	var transcriptGenerator: TranscriptGenerator;
	const baseFile = "c:\\folder\\file.chat";
	const baseFolder = "c:\\folder";

	beforeEach(async () => {
		var proxyQuire = proxyquire('../processor', { './fileFinder': fileFinderStub });

		activityHandler = new ActivityHandler(null)
		transcriptGenerator = new TranscriptGenerator();

		sut = new proxyQuire.Processor(activityHandler, transcriptGenerator);
	});

	describe('start', () => {
		it('should not process file if there are no activities', async () => {
			sinon.stub(transcriptGenerator, "single").resolves(null);
			sinon.stub(activityHandler, "process");

			await sut.start(Array<string>(baseFile), null, false);

			expect((transcriptGenerator.single as sinon.SinonStub).calledWithExactly(new FileInfo(baseFile))).to.be.true;
			expect((activityHandler.process as sinon.SinonStub).notCalled).to.be.true;
		});

		it('should not process a file if the extension is not recognized', async () => {
			sinon.stub(transcriptGenerator, "single").resolves(null);
			sinon.stub(activityHandler, "process");

			fileFinderStub.findFile = function () {
				var files = new Array<any>();
				files.push({fullPath: 'c:\\conversation.foo' });
				files.push({fullPath: baseFile });
				return files;
			};

			await sut.start(null, Array<string>(baseFolder), false);

			// only basefile has been processed
			expect((transcriptGenerator.single as sinon.SinonStub).calledWithExactly(new FileInfo(baseFile))).to.be.true;
			expect((activityHandler.process as sinon.SinonStub).notCalled).to.be.true;
		});

		it('should process file if there are activities', async () => {
			var activities = new Array<Activity>();
			activities.push(new JabberActivity())

			sinon.stub(transcriptGenerator, "single").resolves(activities);
			sinon.stub(activityHandler, "process");

			await sut.start(Array<string>(baseFile), null, false);

			expect((transcriptGenerator.single as sinon.SinonStub).calledWithExactly(new FileInfo(baseFile))).to.be.true;
			expect((activityHandler.process as sinon.SinonStub).calledWithExactly(sinon.match(activities))).to.be.true;
		});
		
		it('should process folder file if there are activities', async () => {
			var activities = new Array<Activity>();
			activities.push(new JabberActivity())

			sinon.stub(transcriptGenerator, "single").resolves(activities);
			sinon.stub(activityHandler, "process");

			fileFinderStub.findFile = function () {
				var files = new Array<any>();
				files.push({fullPath: baseFile });
				return files;
			};

			await sut.start(null, Array<string>(baseFolder), false);

			expect((transcriptGenerator.single as sinon.SinonStub).calledWithExactly(new FileInfo(baseFile))).to.be.true;
			expect((activityHandler.process as sinon.SinonStub).calledWithExactly(sinon.match(activities))).to.be.true;
		});
	});
});