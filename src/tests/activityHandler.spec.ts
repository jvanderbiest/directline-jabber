import { expect } from 'chai';
import { ActivityHandler } from '../activityHandler';
import * as sinon from 'sinon';
import { RequestHandler } from '../requestHandler';
import { ActivityHelper } from './helpers/activityHelper';
import { ResourceResponse } from '../domain/responses/resourceResponse';
import { JabberActivity } from '../domain/jabberActivity';

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

			var serverActivities = new Array<JabberActivity>();
			serverActivities.push(botActivity);

			sinon.stub(requestHandler, "getActivityResponse").resolves(serverActivities);

			var activities = new Array<JabberActivity>();
			activities.push(botActivity);

			var sendActivityResponse = new ResourceResponse();
			sendActivityResponse.id = '1';
			sinon.stub(requestHandler, "sendActivity").resolves(sendActivityResponse);

			await sut.process(activities);

			expect((requestHandler.authenticate as sinon.SinonStub).calledOnce).to.be.true;
			expect((requestHandler.getActivityResponse as sinon.SinonStub).calledOnce).to.be.true;
			expect((requestHandler.sendActivity as sinon.SinonStub).notCalled).to.be.true;
		});

		it('should throw an error when the bot message does not match our expected message', async () => {
			var serverActivities = new Array<JabberActivity>();
			serverActivities.push(ActivityHelper.generateBotActivity("this is what the bot should NOT reply"));

			sinon.stub(requestHandler, "getActivityResponse").resolves(serverActivities);

			var sendActivityResponse = new ResourceResponse();
			sendActivityResponse.id = '1';
			sinon.stub(requestHandler, "sendActivity").resolves(sendActivityResponse);

			var activities = new Array<JabberActivity>();
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

			var activities = new Array<JabberActivity>();
			activities.push(userActivity);

			sinon.stub(requestHandler, "getActivityResponse");
			var sendActivityResponse = new ResourceResponse();
			sendActivityResponse.id = '1';
			sinon.stub(requestHandler, "sendActivity").resolves(sendActivityResponse);

			await sut.process(activities);

			expect((requestHandler.authenticate as sinon.SinonStub).calledOnce).to.be.true;
			expect((requestHandler.getActivityResponse as sinon.SinonStub).notCalled).to.be.true;
			expect((requestHandler.sendActivity as sinon.SinonStub).calledOnceWithExactly(null, sinon.match(userActivity))).to.be.true;
		});

		it('should handle conversationUpdate event by sending it to directline', async () => {
			var conversationUpdateActivity = ActivityHelper.generateConversationUpdateEvent();

			sinon.stub(requestHandler, "getActivityResponse");

			var activities = new Array<JabberActivity>();
			activities.push(conversationUpdateActivity);
			
			var sendActivityResponse = new ResourceResponse();
			sendActivityResponse.id = '1';
			sinon.stub(requestHandler, "sendActivity").resolves(sendActivityResponse);

			await sut.process(activities);

			expect((requestHandler.authenticate as sinon.SinonStub).calledOnce).to.be.true;
			expect((requestHandler.getActivityResponse as sinon.SinonStub).notCalled).to.be.true;
			expect((requestHandler.sendActivity as sinon.SinonStub).calledOnce).to.be.true;
		});

		it('should match a hero card', async () => {
			var heroCardActivity = ActivityHelper.generateHeroCardActivity(ActivityHelper.generateHeroCardAttachment(ActivityHelper.generateHeroCard()));

			var serverActivities = new Array<JabberActivity>();
			serverActivities.push(heroCardActivity);

			sinon.stub(requestHandler, "getActivityResponse").resolves(serverActivities);

			var activities = new Array<JabberActivity>();
			activities.push(heroCardActivity);
			
			var sendActivityResponse = new ResourceResponse();
			sendActivityResponse.id = '1';
			sinon.stub(requestHandler, "sendActivity").resolves(sendActivityResponse);

			await sut.process(activities);

			expect((requestHandler.authenticate as sinon.SinonStub).calledOnce).to.be.true;
			expect((requestHandler.getActivityResponse as sinon.SinonStub).calledOnce).to.be.true;
			expect((requestHandler.sendActivity as sinon.SinonStub).notCalled).to.be.true;
		});

		it('should throw when hero cards are different', async () => {
			var serverHeroCardActivity = ActivityHelper.generateHeroCardActivity(ActivityHelper.generateHeroCardAttachment(ActivityHelper.generateHeroCard()));

			var serverActivities = new Array<JabberActivity>();
			serverActivities.push(serverHeroCardActivity);

			sinon.stub(requestHandler, "getActivityResponse").resolves(serverActivities);

			var heroCardActivity = ActivityHelper.generateHeroCardActivity(ActivityHelper.generateHeroCardAttachment(ActivityHelper.generateHeroCard()));
			heroCardActivity.attachments[0].contentUrl = "some.url-that-is-different";
			var activities = new Array<JabberActivity>();
			activities.push(heroCardActivity);
			
			var error = await sut.process(activities).catch(error => error);
			expect(error.message).to.be.a('string').and.satisfy((msg : any) => msg.startsWith("Hero cards were not equal."));
		});

		it('should throw if hero card buttons lenght is different', async () => {
			var serverHeroCardActivity = ActivityHelper.generateHeroCardActivity(ActivityHelper.generateHeroCardAttachment(ActivityHelper.generateHeroCard()));

			var serverActivities = new Array<JabberActivity>();
			serverActivities.push(serverHeroCardActivity);

			sinon.stub(requestHandler, "getActivityResponse").resolves(serverActivities);

			var heroCardActivity = ActivityHelper.generateHeroCardActivity(ActivityHelper.generateHeroCardAttachment(ActivityHelper.generateHeroCard()));
			 heroCardActivity.attachments.push(ActivityHelper.generateHeroCardAttachment(ActivityHelper.generateHeroCard()));
			var activities = new Array<JabberActivity>();
			activities.push(heroCardActivity);
			
			var error = await sut.process(activities).catch(error => error);
			expect(error.message).to.be.a('string').and.satisfy((msg : any) => msg.startsWith("Button count mismatch"));
		});

		it('should throw when the expected bot replies do not match the number of server replies', async () => {
			var expectedText = "this is what the bot should reply";
			var botActivity = ActivityHelper.generateBotActivity(expectedText);

			var serverActivities = new Array<JabberActivity>();
			// we add 3 server replies, so it will not match what we expect
			serverActivities.push(botActivity, botActivity, botActivity);

			sinon.stub(requestHandler, "getActivityResponse").resolves(serverActivities);

			var activities = new Array<JabberActivity>();
			// we expect 2 bot messages
			activities.push(botActivity, botActivity);

			var error = await sut.process(activities).catch(error => error);
			expect(error.message).to.equal("We are expecting 2 bot replies but we retrieved 3 bot replies. A total of 0 messages have been sent so far.");

		});
	});
});