import { expect, assert } from 'chai';
import { RequestHandler } from '../requestHandler';
import { Directline } from '../constants';
import { AuthenticationResponse } from '../domain/responses/authenticationResponse';
import { EventActivityRequest } from '../domain/requests/eventActivityRequest';
import { JabberActivity } from '../domain/jabberActivity';
import { ResourceResponse } from '../domain/responses/resourceResponse';
import { Activity } from '../domain/activity';
const nock = require('nock')

describe('Request handler tests', () => {
	var sut: RequestHandler;

	const directlineSecret = "directlineSecret";
	const tokenEndpoint = "https://some.end.point";

	describe('sendActivity', () => {
		it('should send an activity', async () => {
			var authResponse = new AuthenticationResponse();
			authResponse.conversationId = "conversationId";
			authResponse.expires_in = 1234;
			authResponse.token = "token";

			var testActivity = new JabberActivity();

			nock(`${Directline.conversation_endpoint}/${authResponse.conversationId}`)
				.post(`/activities`, testActivity)
				.matchHeader("authorization", (value: string) => value == `Bearer ${authResponse.token}`)
				.reply(200, {
					body: new ResourceResponse()
				});

			sut = new RequestHandler(directlineSecret, null);
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
				.matchHeader("authorization", (value: string) => value == `Bearer ${authResponse.token}`)
				.reply(200, {
					body: new ResourceResponse()
				});

			sut = new RequestHandler(directlineSecret, null);
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
			var testActivity = new JabberActivity();
			activities.push(testActivity);

			nock(`${Directline.conversation_endpoint}/${authResponse.conversationId}`)
				.get(`/activities?watermark=${watermark}`)
				.matchHeader("authorization", (value: string) => value == `Bearer ${authResponse.token}`)
				.reply(200, {
					activities: activities
				});

			sut = new RequestHandler(directlineSecret, null);
			var response = await sut.getActivityResponse(authResponse, watermark);
			assert.equal(response.length, activities.length);

		});
	});

	describe('authenticate', () => {
		it('should throw an authentication error when authenticating', async () => {
			nock(Directline.token_endpoint)
				.post('')
				.matchHeader("authorization", (value: string) => value == `Bearer ${directlineSecret}`)
				.reply(400);

			sut = new RequestHandler(directlineSecret, null);
			await sut.authenticate().catch(error => {
				expect(error).to.be.an('Error');
			});
		});

		it('should throw an authentication error when retrieving conversation token', async () => {
			var token = 'token';

			nock(Directline.token_endpoint)
				.post('')
				.matchHeader("authorization", (value: string) => value == `Bearer ${directlineSecret}`)
				.reply(200, {
					conversationId: "",
					expires_in: '',
					token: token
				});

			nock(Directline.conversation_endpoint)
				.post('')
				.matchHeader("authorization", (value: string) => value == `Bearer ${token}`)
				.reply(400);

			sut = new RequestHandler(directlineSecret, null);
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
				.matchHeader("authorization", (value: string) => value == `Bearer ${directlineSecret}`)
				.reply(200, {
					conversationId: expectedConversationId,
					expires_in: expectedExpiresIn,
					token: expectedToken
				});

			nock(Directline.conversation_endpoint)
				.post('')
				.matchHeader("authorization", (value: string) => value == `Bearer ${expectedToken}`)
				.reply(200, {
					conversationId: expectedConversationId,
					expires_in: expectedExpiresIn,
					token: expectedToken
				});

			sut = new RequestHandler(directlineSecret, null);
			var response = await sut.authenticate();
			assert.equal(response.conversationId, expectedConversationId);
			assert.equal(response.expires_in, expectedExpiresIn);
			assert.equal(response.token, expectedToken);
		});

		it('should parse with JSON string token', async () => {
			await assertTokenAuthentication("token", 'token')
		});

		it('should parse with JSON stringified string token', async () => {
			await assertTokenAuthentication("\"token\"", 'token');
		});

		it('should parse with JSON token object', async () => {
			await assertTokenAuthentication({ 'token': 'mytoken' }, 'mytoken');
		});

		async function assertTokenAuthentication(endpointToken: any, expectedToken: string) {
			var conversationToken = "token";
			var subPath = "/foo";

			nock(tokenEndpoint)
				.get(subPath)
				.reply(200, endpointToken);

			nock(Directline.conversation_endpoint)
				.post('')
				.matchHeader("authorization", (value: string) => value == `Bearer ${expectedToken}`)
				.reply(200, {
					token: conversationToken
				});

			sut = new RequestHandler(null, `${tokenEndpoint}${subPath}`);
			var response = await sut.authenticate();
			assert.equal(response.token, conversationToken);
		}
	});
});