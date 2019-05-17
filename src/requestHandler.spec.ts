import { expect, assert } from 'chai';
import { Activity } from 'chatdown-domain';
import { RequestHandler } from './requestHandler';
import { Directline } from './constants';
import { AuthenticationResponse } from './domain/responses/authenticationResponse';
import { TestActivity } from './activityHandler.spec';
import { EventActivityRequest } from './domain/requests/eventActivityRequest';
const nock = require('nock')

describe('Request handler tests', () => {
	var sut: RequestHandler;

	const directlineSecret = "directlineSecret";
	beforeEach(async () => {
		sut = new RequestHandler(directlineSecret);
	});

	
	describe('sendActivity', () => {
		it('should send an activity', async () => {
			var authResponse = new AuthenticationResponse();
			authResponse.conversationId = "conversationId";
			authResponse.expires_in = 1234;
			authResponse.token = "token";

			var testActivity = new TestActivity();

			nock(`${Directline.conversation_endpoint}/${authResponse.conversationId}`)
				.post(`/activities`, testActivity)
				.matchHeader("authorization", (value : string) => value == `Bearer ${authResponse.token}`)
				.reply(200);

				await sut.sendActivity(authResponse, testActivity);
		});
	});

	describe('sendEventActivity', () => {
		it('should send an event activity', async () => {
			var authResponse = new AuthenticationResponse();
			authResponse.conversationId = "conversationId";
			authResponse.expires_in = 1234;
			authResponse.token = "token";

			var eventActivityRequest = new EventActivityRequest();

			nock(`${Directline.conversation_endpoint}/${authResponse.conversationId}`)
				.post(`/activities`, eventActivityRequest)
				.matchHeader("authorization", (value : string) => value == `Bearer ${authResponse.token}`)
				.reply(200);

				await sut.sendEventActivity(authResponse, eventActivityRequest);
		});
	});

	describe('getActivityResponse', () => {
		it('should retrieve activities', async () => {
			var watermark = 1;
			var authResponse = new AuthenticationResponse();
			authResponse.conversationId = "conversationId";
			authResponse.expires_in = 1234;
			authResponse.token = "token";

			var activities = new Array<Activity>();
			var testActivity = new TestActivity();
			activities.push(testActivity);

			nock(`${Directline.conversation_endpoint}/${authResponse.conversationId}`)
				.get(`/activities?watermark=${watermark}`)
				.matchHeader("authorization", (value : string) => value == `Bearer ${authResponse.token}`)
				.reply(200, {
					activities: activities
				});

				var response = await sut.getActivityResponse(authResponse, watermark);
				assert.equal(response.length, activities.length);
				
		});
	});

	describe('authenticate', () => {
		it('should throw an authentication error when authenticating', async () => {
			nock(Directline.token_endpoint)
				.post('')
				.matchHeader("authorization", (value : string) => value == `Bearer ${directlineSecret}`)
				.reply(400);

				await sut.authenticate().catch(error => {
					expect(error).to.be.an('Error');
				});			
		});

		it('should throw an authentication error when retrieving conversation token', async () => {
			var token = 'token';

			nock(Directline.token_endpoint)
				.post('')
				.matchHeader("authorization", (value : string) => value == `Bearer ${directlineSecret}`)
				.reply(200, {
					conversationId: "",
					expires_in: '',
					token: token
				});

			nock(Directline.conversation_endpoint)
				.post('')
				.matchHeader("authorization", (value : string) => value == `Bearer ${token}`)
				.reply(400);

				await sut.authenticate().catch(error => {
					expect(error).to.be.an('Error');
				});			
		});

		it('should retrieve authentication token, then get a conversation token with the authentication token', async () => {
			var expectedConversationId = "cid";
			var expectedExpiresIn = 12345;
			var expectedToken = "token";

			nock(Directline.token_endpoint)
				.post('')
				.matchHeader("authorization", (value : string) => value == `Bearer ${directlineSecret}`)
				.reply(200, {
					conversationId: expectedConversationId,
					expires_in: expectedExpiresIn,
					token: expectedToken
				});

			nock(Directline.conversation_endpoint)
				.post('')
				.matchHeader("authorization", (value : string) => value == `Bearer ${expectedToken}`)
				.reply(200, {
					conversationId: expectedConversationId,
					expires_in: expectedExpiresIn,
					token: expectedToken
				});

				var response = await sut.authenticate();
			assert.equal(response.conversationId, expectedConversationId);
			assert.equal(response.expires_in, expectedExpiresIn);
			assert.equal(response.token, expectedToken);
		});
	});
});