import { expect, assert } from 'chai';
import { JabberCardAction } from '../../domain/jabberCardAction';

describe('A jabber card action', () => {
	var sut: JabberCardAction;

	beforeEach(async () => {
		sut = new JabberCardAction();
	});

	describe('parse', () => {
		it('should return a valid object', async () => {
			
			var anyCardAction = {
				channelData: "channel-data",
				displayText: "display-text",
				image: "https://some.ima.ge",
				title: "title",
				type: "type",
				value: {}
			}
	
			var cardAction = sut.parse(anyCardAction);
			expect(cardAction.channelData).equals(anyCardAction.channelData);
			expect(cardAction.displayText).equals(anyCardAction.displayText);
			expect(cardAction.image).equals(anyCardAction.image);
			expect(cardAction.title).equals(anyCardAction.title);
			expect(cardAction.value).to.deep.equal(anyCardAction.value);
		});

		it('should return undefined object', async () => {
			var cardAction = sut.parse(null);
			assert.isUndefined(cardAction);
		});
	});
});