import { Attachment } from "./activity";
import { JabberHeroCard } from "./jabberHeroCard";
import { AttachmentContentTypes } from "./attachmentContentTypes";

export class JabberAttachment implements Attachment {
    
    content: object;
    contentType: string;
    contentUrl: string;
    name: string;
    thumbnailUrl: string;

    isHeroCard() : boolean {
        return this.contentType == AttachmentContentTypes.heroCard;
    }

    parse(attachment: any): JabberAttachment {
        if (!attachment) { return; }

        this.contentType = attachment.contentType;

        if (this.isHeroCard()) {
            this.content = new JabberHeroCard().parse(attachment.content);
        }
        else {
            throw Error(`Unsupported attachment type '${this.contentType}'`);
        }

        this.contentUrl = attachment.contentUrl;
        this.name = attachment.name;
        this.thumbnailUrl = attachment.thumbnailUrl;

        return this;
    }
}