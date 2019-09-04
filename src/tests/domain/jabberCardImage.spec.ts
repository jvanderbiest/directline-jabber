import { expect, assert } from 'chai';
import { JabberCardImage } from '../../domain/jabberCardImage';

describe('A jabber card image', () => {
	var sut: JabberCardImage;

	beforeEach(async () => {
		sut = new JabberCardImage();
	});

	describe('parse', () => {
		it('should return a valid object', async () => {
			
			var anyImage1 = {
				alt: "alt",
				tap: "tap",
				url: "url"
			}
	
			var cardImage = sut.parse(anyImage1);
			expect(cardImage.alt).equals(anyImage1.alt);
			expect(cardImage.tap).equals(anyImage1.tap);
			expect(cardImage.url).equals(anyImage1.url);
		});

		it('should return undefined object', async () => {
			var cardImage = sut.parse(null);
			assert.isUndefined(cardImage);
		});
	});
});