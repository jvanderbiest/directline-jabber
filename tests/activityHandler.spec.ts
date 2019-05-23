import { expect, assert } from 'chai';
import { ActivityHandler } from '../src/activityHandler';
import * as sinon from 'sinon';
import { Activity } from 'chatdown-domain';
import { RequestHandler } from '../src/requestHandler';
import { ActivityHelper } from './helpers/activityHelper';

describe('Activity handler tests', () => {
	var sut: ActivityHandler;
	var requestHandler: RequestHandler;

	beforeEach(async () => {
		requestHandler = new RequestHandler(null, null);
		sinon.stub(requestHandler, "authenticate").resolves(null);

		sut = new ActivityHandler(requestHandler);
	});

	describe('process', () => {
		it('should match server activity text when we expect a bot message', async () => {
			var expectedText = "this is what the bot should reply";

			var botActivity = ActivityHelper.generateBotActivity(expectedText);

			var serverActivities = new Array<Activity>();
			serverActivities.push(botActivity);

			sinon.stub(requestHandler, "getActivityResponse").resolves(serverActivities);

			var activities = new Array<Activity>();
			activities.push(botActivity);

			sinon.stub(requestHandler, "sendActivity");

			await sut.process(activities);

			expect((requestHandler.authenticate as sinon.SinonStub).calledOnce).to.be.true;
			expect((requestHandler.getActivityResponse as sinon.SinonStub).calledOnce).to.be.true;
			expect((requestHandler.sendActivity as sinon.SinonStub).notCalled).to.be.true;
		});

		it('should throw an error when the bot message does not match our expected message', async () => {
			var serverActivities = new Array<Activity>();
			serverActivities.push(ActivityHelper.generateBotActivity("this is what the bot should NOT reply"));

			sinon.stub(requestHandler, "getActivityResponse").resolves(serverActivities);
			sinon.stub(requestHandler, "sendActivity");

			var activities = new Array<Activity>();
			activities.push(ActivityHelper.generateBotActivity("this is what the bot should reply"));

			await sut.process(activities).catch(error => {
				expect(error).to.be.an('Error', 'Expected this is what the bot should NOT reply but got this is what the bot should reply');
			});

			expect((requestHandler.authenticate as sinon.SinonStub).calledOnce).to.be.true;
			expect((requestHandler.sendActivity as sinon.SinonStub).notCalled).to.be.true;
			expect((requestHandler.getActivityResponse as sinon.SinonStub).calledOnce).to.be.true;
		});

		it('should send a server activity when we have user input', async () => {
			var userActivity = ActivityHelper.generateUserActivity();

			var activities = new Array<Activity>();
			activities.push(userActivity);

			sinon.stub(requestHandler, "getActivityResponse");
			sinon.stub(requestHandler, "sendActivity");

			await sut.process(activities);

			expect((requestHandler.authenticate as sinon.SinonStub).calledOnce).to.be.true;
			expect((requestHandler.getActivityResponse as sinon.SinonStub).notCalled).to.be.true;
			expect((requestHandler.sendActivity as sinon.SinonStub).calledOnceWithExactly(null, sinon.match(userActivity))).to.be.true;
		});
	});
});