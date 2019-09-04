import { expect } from 'chai';
import { Processor } from '../processor';
import { ActivityHandler } from '../activityHandler';
import { TranscriptGenerator } from '../transcriptGenerator';
import * as sinon from 'sinon';
import { JabberActivity } from '../domain/jabberActivity';
import { FileInfo } from '../domain/fileInfo';
import { Activity } from '../domain/activity';
var proxyquire = require('proxyquire');

describe('Processor tests', () => {
	var fileSearcherStub: any = {};
	var sut: Processor;
	var activityHandler: ActivityHandler;
	var transcriptGenerator: TranscriptGenerator;
	const baseFile = "c:\\folder\\file.transcript";
	const baseFolder = "c:\\folder";

	beforeEach(async () => {
		var proxyQuire = proxyquire('../processor', { './fileSearcher': fileSearcherStub });

		activityHandler = new ActivityHandler(null)
		transcriptGenerator = new TranscriptGenerator(null, null);

		sut = new proxyQuire.Processor(activityHandler, transcriptGenerator);
	});

	describe('start', () => {
		it('should not process file if there are no activities', async () => {
			sinon.stub(transcriptGenerator, "single").resolves(null);
			sinon.stub(activityHandler, "process");

			await sut.start(Array<string>(baseFile), null, false, null);

			expect((transcriptGenerator.single as sinon.SinonStub).calledWithExactly(new FileInfo(baseFile))).to.be.true;
			expect((activityHandler.process as sinon.SinonStub).notCalled).to.be.true;
		});

		it('should not process a file if the extension is not recognized', async () => {
			sinon.stub(transcriptGenerator, "single").resolves(null);
			sinon.stub(activityHandler, "process");

			fileSearcherStub.FileSearcher.recursive = function () {
				var files = new Array<any>();
				files.push({fullPath: 'c:\\conversation.foo' });
				files.push({fullPath: baseFile });
				return files;
			};

			await sut.start(null, Array<string>(baseFolder), false, null);

			// only basefile has been processed
			expect((transcriptGenerator.single as sinon.SinonStub).calledWithExactly(new FileInfo(baseFile))).to.be.true;
			expect((activityHandler.process as sinon.SinonStub).notCalled).to.be.true;
		});

		it('should process file if there are activities', async () => {
			var activities = new Array<JabberActivity>();
			activities.push(new JabberActivity())

			sinon.stub(transcriptGenerator, "single").resolves(activities);
			sinon.stub(activityHandler, "process");

			await sut.start(Array<string>(baseFile), null, false, null);

			expect((transcriptGenerator.single as sinon.SinonStub).calledWithExactly(new FileInfo(baseFile))).to.be.true;
			expect((activityHandler.process as sinon.SinonStub).calledWithExactly(sinon.match(activities))).to.be.true;
		});
		
		it('should process folder file if there are activities', async () => {
			var activities = new Array<JabberActivity>();
			activities.push(new JabberActivity())

			sinon.stub(transcriptGenerator, "single").resolves(activities);
			sinon.stub(activityHandler, "process");

			fileSearcherStub.FileSearcher.recursive = function () {
				var files = new Array<any>();
				files.push({fullPath: baseFile });
				return files;
			};

			await sut.start(null, Array<string>(baseFolder), false, null);

			expect((transcriptGenerator.single as sinon.SinonStub).calledWithExactly(new FileInfo(baseFile))).to.be.true;
			expect((activityHandler.process as sinon.SinonStub).calledWithExactly(sinon.match(activities))).to.be.true;
		});

		it('should preprocess file and merge activities', async () => {
			var preprocessActivities = new Array<JabberActivity>();
			var preprocessActivity = new JabberActivity();
			preprocessActivity.name = "preprocess";
			preprocessActivities.push(preprocessActivity);

			var conversationActivities = new Array<JabberActivity>();
			var conversationActivity = new JabberActivity();
			conversationActivity.name = "converstation";
			conversationActivities.push(conversationActivity);

			var allActivities = preprocessActivities.concat(conversationActivities);
			
			var singleStub = sinon.stub(transcriptGenerator, "single");
			singleStub.onCall(0).resolves(preprocessActivities);
			singleStub.onCall(1).resolves(conversationActivities);
			sinon.stub(activityHandler, "process");

			var preprocessFile = "c:\\file.transcript";
			await sut.start(Array<string>(baseFile), null, false, preprocessFile);

			expect((transcriptGenerator.single as sinon.SinonStub).getCall(0).calledWithExactly(new FileInfo(preprocessFile))).to.be.true;
			expect((transcriptGenerator.single as sinon.SinonStub).getCall(1).calledWithExactly(new FileInfo(baseFile))).to.be.true;
			expect((activityHandler.process as sinon.SinonStub).calledWithExactly(sinon.match(allActivities))).to.be.true;
		});
	});
});