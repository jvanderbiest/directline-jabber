import { expect, assert } from 'chai';
import { AttachmentContentTypes } from '../../domain/attachmentContentTypes';

import { JabberChannelAccount } from '../../domain/jabberChannelAccount';

describe('A jabber activity', () => {
	var sut: JabberChannelAccount;

	beforeEach(async () => {
		sut = new JabberChannelAccount();
	});

	// should parse and use user id prefix and user id
	describe('parse', () => {
		it('should parse and return a valid object', async () => {

			var anyJabberChannelAccount = {
				id: "id",
				name: "name",
				role: "role"
			}

			var jabberChannelAccount = sut.parse(anyJabberChannelAccount, null,null);
			expect(jabberChannelAccount.id).equals(anyJabberChannelAccount.id);
			expect(jabberChannelAccount.name).equals(anyJabberChannelAccount.name);
			expect(jabberChannelAccount.role).equals(anyJabberChannelAccount.role);
		});

		it('should parse and use the user id and user prefix when having a user channelAccount', async () => {
			var userId = "12345";
			var userPrefix = "12345";

			var anyJabberChannelAccount = {
				id: "id",
				name: "name",
				role: "user"
			}

			var jabberChannelAccount = sut.parse(anyJabberChannelAccount, userId, userPrefix);
			expect(jabberChannelAccount.id).equals(`${userPrefix}${userId}`);
			expect(jabberChannelAccount.name).equals(anyJabberChannelAccount.name);
			expect(jabberChannelAccount.role).equals(anyJabberChannelAccount.role);
		});

		it('should parse and return undefined object', async () => {
			var jabberChannelAccount = sut.parse(null, null, null);
			assert.isUndefined(jabberChannelAccount);
		});
	});
});