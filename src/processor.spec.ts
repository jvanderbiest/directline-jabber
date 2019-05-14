import { expect } from 'chai';
import { Processor } from './processor';
import { ActivityHandler } from './activityHandler';
import { TranscriptGenerator } from './trancriptGenerator';
import * as sinon from 'sinon';
// import * as spies from 'chai-spies';

describe('Processor tests', () => {
	var processor: Processor;
	var activityHandlerStub: ActivityHandler;
	var transcriptGenerator: TranscriptGenerator;
	var transcriptSpy: sinon.SinonSpy<any>;
	var activityHandlerSpy: sinon.SinonSpy<any>;

	before(async () => {
		activityHandlerStub = sinon.createStubInstance(ActivityHandler);
		transcriptGenerator = sinon.createStubInstance(TranscriptGenerator);

		transcriptGenerator.single = function () { return null };
		transcriptSpy = sinon.spy(transcriptGenerator.single);
		activityHandlerSpy = sinon.spy(activityHandlerStub.process);

		processor = new Processor(activityHandlerStub, transcriptGenerator)
	});

	describe('single - should process a single file', () => {
		it('should not process if there are no activities', async () => {

			processor.single("c:\\folder\\file.chat");

			expect(transcriptSpy.calledOnce);
			expect(activityHandlerSpy.notCalled)
		});
	});
});