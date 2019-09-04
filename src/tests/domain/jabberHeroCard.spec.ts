import { expect, assert } from 'chai';
import { JabberHeroCard } from '../../domain/jabberHeroCard';

describe('A jabber hero card', () => {
	var sut: JabberHeroCard;

	beforeEach(async () => {
		sut = new JabberHeroCard();
	});

	describe('parse', () => {
		it('should return a valid object', async () => {
			
			var anyheroCard = {
				buttons: [{text: 'b1'}, {text: 'b2'}],
				images: [{url: 'https://ima.ge'}],
				subtitle: "subtitle",
				tap: {text: 'tap1'},
				text: "display-text",
				title: "title"
			}
	
			var heroCard = sut.parse(anyheroCard);
			expect(heroCard.buttons).to.have.length(2);
			expect(heroCard.images).to.have.length(1);
			expect(heroCard.subtitle).equals(anyheroCard.subtitle);
			expect(heroCard.tap.text).equals(anyheroCard.tap.text);
			expect(heroCard.text).equals(anyheroCard.text);
			expect(heroCard.title).equals(anyheroCard.title);
		});

		it('should return undefined object', async () => {
			var heroCard = sut.parse(null);
			assert.isUndefined(heroCard);
		});
	});
});