import { CardImage } from "./activity";

export class JabberCardImage implements CardImage {
    alt: string;
    tap: string;
    url: string;

    parse(cardImage: any): JabberCardImage {
        if (!cardImage) { return; }

        this.alt = cardImage.alt;
        this.tap = cardImage.tap;
        this.url = cardImage.url;
        return this;
    }
}
