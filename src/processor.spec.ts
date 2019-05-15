import { expect } from 'chai';
import { Processor } from './processor';
import { ActivityHandler } from './activityHandler';
import { TranscriptGenerator } from './trancriptGenerator';
import * as sinon from 'sinon';
import { Activity, Attachment, ChannelAccount } from 'chatdown-domain';
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
		
		transcriptSpy = sinon.spy(transcriptGenerator.single);
		activityHandlerSpy = sinon.spy(activityHandlerStub.process);

		processor = new Processor(activityHandlerStub, transcriptGenerator)
	});

	describe('single - should process a single file', () => {
		it('should not process if there are no activities', async () => {
			transcriptGenerator.single = function () { return null };

			processor.single("c:\\folder\\file.chat");

			expect(transcriptSpy.calledOnce);
			expect(activityHandlerSpy.notCalled)
		});

		it('should process if there are activities', async () => {
			var activities = new Array<Activity>();
			activities.push(new TestActivity())
			transcriptGenerator.single = function () { return new Promise((resolve) => resolve(activities)); };

			processor.single("c:\\folder\\file.chat");

			expect(transcriptSpy.calledOnce);
			expect(activityHandlerSpy.calledOnce)
		});
	});	
});

export class TestActivity implements Activity {
	attachments: Attachment[];	
	text: string;
	timestamp: string;
	id: number;
	type: string;
	from: ChannelAccount;
	recipient: ChannelAccount;
	conversation: string;
}