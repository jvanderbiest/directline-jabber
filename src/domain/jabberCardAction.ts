import { CardAction } from "./activity";

export class JabberCardAction implements CardAction {
    channelData: string;
    displayText: string;
    image: string;
    text: string;
    title: string;
    type: string;
    value: object;

    parse(cardAction: any): JabberCardAction {
        if (!cardAction) { return; }

        this.channelData = cardAction.channelData;
        this.displayText = cardAction.displayText;
        this.image = cardAction.image;
        this.text = cardAction.text;
        this.title = cardAction.title;
        this.type = cardAction.type;
        this.value = cardAction.value;
        return this;
    }
}
