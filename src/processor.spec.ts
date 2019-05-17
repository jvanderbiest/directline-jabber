import { expect } from 'chai';
import { Processor } from './processor';
import { ActivityHandler } from './activityHandler';
import { TranscriptGenerator } from './trancriptGenerator';
import * as sinon from 'sinon';
import { Activity } from 'chatdown-domain';
import { TestActivity } from './activityHandler.spec';

describe('Processor tests', () => {
	var sut: Processor;
	var activityHandler: ActivityHandler;
	var transcriptGenerator: TranscriptGenerator;
	const baseFile = "c:\\folder\\file.chat";

	beforeEach(async () => {
		activityHandler = new ActivityHandler(null)
		transcriptGenerator = new TranscriptGenerator();

		sut = new Processor(activityHandler, transcriptGenerator);
	});

	describe('single - should process a single file', () => {
		it('should not process if there are no activities', async () => {
			sinon.stub(transcriptGenerator, "single").resolves(null);
			sinon.stub(activityHandler, "process");

			await sut.single(baseFile);

			expect((transcriptGenerator.single as sinon.SinonStub).calledWithExactly(baseFile)).to.be.true;
			expect((activityHandler.process as sinon.SinonStub).notCalled).to.be.true;
		});

		it('should process if there are activities', async () => {
			var activities = new Array<Activity>();
			activities.push(new TestActivity())

			sinon.stub(transcriptGenerator, "single").resolves(activities);
			sinon.stub(activityHandler, "process");

			await sut.single(baseFile);

			expect((transcriptGenerator.single as sinon.SinonStub).calledWithExactly(baseFile)).to.be.true;
			expect((activityHandler.process as sinon.SinonStub).calledWithExactly(sinon.match(activities))).to.be.true;
		});
	});
});