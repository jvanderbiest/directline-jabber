import { Attachment } from "./activity";

export class JabberAttachment implements Attachment {
    contentType: string;
    contentUrl: string;
    content: string;

    parse(attachment: any): JabberAttachment {
        if (!attachment) { return; }
        this.contentType = attachment.contentType;
        this.contentUrl = attachment.contentUrl;
        this.content = attachment.content;
        return this;
    }
}
