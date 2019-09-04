import { HeroCard } from './activity';
import { JabberCardAction } from './jabberCardAction';
import { JabberCardImage } from './jabberCardImage';

export class JabberHeroCard implements HeroCard {
    buttons: JabberCardAction[] = new Array<JabberCardAction>();
    images: JabberCardImage[] = new Array<JabberCardImage>();
    subtitle: string;
    tap: JabberCardAction;
    text: string;
    title: string;

    parse(heroCard: any): HeroCard {
        if (!heroCard) { return; }

        if (heroCard.buttons && heroCard.buttons.length > 0) {
            this.buttons = new Array<JabberCardAction>();
            for (var button of heroCard.buttons) {
                this.buttons.push(new JabberCardAction().parse(button));
            }
        }

        if (heroCard.images && heroCard.images.length > 0) {
            this.images = new Array<JabberCardImage>();
            for (var image of heroCard.images) {
                this.images.push(new JabberCardImage().parse(image));
            }
        }

        this.subtitle = heroCard.subtitle;
        this.tap = new JabberCardAction().parse(heroCard.tap);
        this.text = heroCard.text;
        this.title = heroCard.title;
        return this;
    }
}