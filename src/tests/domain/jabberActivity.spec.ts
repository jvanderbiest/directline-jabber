import { expect, assert } from 'chai';
import { AttachmentContentTypes } from '../../domain/attachmentContentTypes';
import { JabberActivity } from '../../domain/jabberActivity';

describe('A jabber activity', () => {
	var sut: JabberActivity;

	beforeEach(async () => {
		sut = new JabberActivity();
	});

	describe('parse', () => {
		it('should parse and return a valid object', async () => {

			var anyJabberActivity = {
				name: "name",
				attachments: [{ contentType: AttachmentContentTypes.heroCard }],
				text: "text",
				timestamp: "timestamp",
				channelId: "channelId",
				id: "id",
				type: "type",
				conversation: "conversation"
			}

			var jabberActivity = sut.parse(anyJabberActivity, null, null);
			expect(jabberActivity.name).equals(anyJabberActivity.name);
			expect(jabberActivity.attachments).to.have.length(1);
			expect(jabberActivity.text).equals(anyJabberActivity.text);
			expect(jabberActivity.timestamp).equals(anyJabberActivity.timestamp);
			expect(jabberActivity.channelId).equals(anyJabberActivity.channelId);
			expect(jabberActivity.id).equals(anyJabberActivity.id);
			expect(jabberActivity.type).equals(anyJabberActivity.type);
			expect(jabberActivity.conversation).equals(anyJabberActivity.conversation);
		});

		it('should parse and return undefined object', async () => {
			var jabberActivity = sut.parse(null, null, null);
			assert.isUndefined(jabberActivity);
		});
	});
});