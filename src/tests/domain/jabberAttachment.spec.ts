import { expect, assert } from 'chai';
import { JabberAttachment } from '../../domain/jabberAttachment';
import { AttachmentContentTypes } from '../../domain/attachmentContentTypes';
import { JabberHeroCard } from '../../domain/jabberHeroCard';

describe('A jabber attachment', () => {
	var sut: JabberAttachment;

	beforeEach(async () => {
		sut = new JabberAttachment();
	});

	describe('parse', () => {
		it('should parse a hero attachement and return a valid object', async () => {
			
			var heroAttachment = {
				content: { text: 'text' },
				contentType: AttachmentContentTypes.heroCard,
				contentUrl: "contentUrl",
				name: "name",
				thumbnailUrl: "thumbnailUrl"
			}
	
			var heroCard = sut.parse(heroAttachment);
			assert.isNotNull(heroCard.content as JabberHeroCard);
			expect(heroCard.contentType).equals(heroAttachment.contentType);
			expect(heroCard.contentUrl).equals(heroAttachment.contentUrl);
			expect(heroCard.name).equals(heroAttachment.name);
			expect(heroCard.thumbnailUrl).equals(heroAttachment.thumbnailUrl);
		});

		it('should parse and return undefined object', async () => {
			var heroCard = sut.parse(null);
			assert.isUndefined(heroCard);
		});

		it('should parse and throw when contentType is unknown', async () => {
			var heroAttachment = {
				contentType: "not-supported-content-type",
			}

			expect(sut.parse.bind(sut, heroAttachment)).to.throw(Error, `Unsupported attachment type '${heroAttachment.contentType}'`);
		});
	});
});