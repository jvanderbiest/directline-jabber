import { expect, assert } from 'chai';
import { ActivityHandler } from './activityHandler';
import * as sinon from 'sinon';
import { Activity} from 'chatdown-domain';
import { RequestHandler } from './requestHandler';
import { ActivityTypes, ActivityRoles } from './constants';
import { JabberActivity } from './domain/jabberActivity';
import { JabberAttachment } from './domain/jabberAttachment';

describe('Activity handler tests', () => {
	var sut: ActivityHandler;
	var requestHandler: RequestHandler;

	beforeEach(async () => {
		requestHandler = new RequestHandler(null, null);
		sinon.stub(requestHandler, "authenticate").resolves(null);

		sut = new ActivityHandler(requestHandler);
	});

	describe('process', () => {
		it('should ignore conversationUpdate activities', async () => {
			var activities = new Array<Activity>();
			var conversationActivity = new JabberActivity();
			conversationActivity.type = ActivityTypes.conversationUpdate;
			activities.push(conversationActivity);
			activities.push(conversationActivity);

			sinon.stub(requestHandler, "getActivityResponse");

			await sut.process(activities);

			expect((requestHandler.authenticate as sinon.SinonStub).calledOnce).to.be.true;
			expect((requestHandler.getActivityResponse as sinon.SinonStub).notCalled).to.be.true;
		});

		it('should match server activity text when we expect a bot message', async () => {
			var expectedText = "this is what the bot should reply";

			var serverActivities = new Array<Activity>();
			var serverActivity = new JabberActivity();
			serverActivity.text = expectedText;
			serverActivities.push(serverActivity);

			sinon.stub(requestHandler, "getActivityResponse").resolves(serverActivities);

			var activities = new Array<Activity>();
			var botActivity = new JabberActivity();
			botActivity.from.role = ActivityRoles.bot;
			botActivity.text = expectedText;
			activities.push(botActivity);

			sinon.stub(requestHandler, "sendActivity");

			await sut.process(activities);

			expect((requestHandler.authenticate as sinon.SinonStub).calledOnce).to.be.true;
			expect((requestHandler.getActivityResponse as sinon.SinonStub).calledOnce).to.be.true;
			expect((requestHandler.sendActivity as sinon.SinonStub).notCalled).to.be.true;
		});

		it('should throw an error when the bot message does not match our expected message', async () => {
			var serverActivities = new Array<Activity>();
			var serverActivity = new JabberActivity();
			serverActivity.text = "this is what the bot should NOT reply";
			serverActivities.push(serverActivity);

			sinon.stub(requestHandler, "getActivityResponse").resolves(serverActivities);
			sinon.stub(requestHandler, "sendActivity");

			var activities = new Array<Activity>();
			var botActivity = new JabberActivity();
			botActivity.from.role = ActivityRoles.bot;
			botActivity.text = "this is what the bot should reply";
			activities.push(botActivity);

			await sut.process(activities).catch(error => {
				expect(error).to.be.an('Error', 'Expected this is what the bot should NOT reply but got this is what the bot should reply');
			});

			expect((requestHandler.authenticate as sinon.SinonStub).calledOnce).to.be.true;
			expect((requestHandler.sendActivity as sinon.SinonStub).notCalled).to.be.true;
			expect((requestHandler.getActivityResponse as sinon.SinonStub).calledOnce).to.be.true;
		});

		it('should send a server activity when we have user input', async () => {
			var activities = new Array<Activity>();
			var userActivity = new JabberActivity();
			userActivity.from.role = ActivityRoles.user;
			activities.push(userActivity);
			
			sinon.stub(requestHandler, "getActivityResponse");
			sinon.stub(requestHandler, "sendActivity");

			await sut.process(activities);

			expect((requestHandler.authenticate as sinon.SinonStub).calledOnce).to.be.true;
			expect((requestHandler.getActivityResponse as sinon.SinonStub).notCalled).to.be.true;
			expect((requestHandler.sendActivity as sinon.SinonStub).calledOnceWithExactly(null, sinon.match(userActivity))).to.be.true;
		});

		it('should increase the watermark when the user sends an attachment', async () => {
			var activities = new Array<Activity>();

			var userActivity = new JabberActivity();
			userActivity.from.role = ActivityRoles.user;
			userActivity.attachments = new Array<JabberAttachment>();
			userActivity.attachments.push(new JabberAttachment());
			activities.push(userActivity);

			var botActivity = new JabberActivity();
			botActivity.from.role = ActivityRoles.bot;
			botActivity.text = "this is what the bot should reply";
			activities.push(botActivity);

			var getActivities = new Array<Activity>();
			getActivities.push(botActivity);
			sinon.stub(requestHandler, "getActivityResponse").resolves(getActivities);
			sinon.stub(requestHandler, "sendActivity");

			await sut.process(activities);

			expect((requestHandler.authenticate as sinon.SinonStub).calledOnce).to.be.true;
			expect((requestHandler.getActivityResponse as sinon.SinonStub).calledOnceWithExactly(null, 1)).to.be.true;;
			expect((requestHandler.sendActivity as sinon.SinonStub).calledOnceWithExactly(null, userActivity)).to.be.true;;
		});
	});
});