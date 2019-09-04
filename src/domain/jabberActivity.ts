import { JabberAttachment } from './jabberAttachment';
import { JabberChannelAccount } from './jabberChannelAccount';
import { Activity } from './activity';

export class JabberActivity implements Activity {
    name: string;
    attachments: JabberAttachment[];
    text: string;
    timestamp: string;
    channelId: string;
    id: string;
    type: string;
    from: JabberChannelAccount;
    recipient: JabberChannelAccount;
    conversation: string;

    parse(activity: any): JabberActivity {
        if (!activity) { return; }
        
        if (activity.attachments && activity.attachments.length > 0) {
            this.attachments = new Array<JabberAttachment>();
            for (var attachment of activity.attachments) {
                this.attachments.push(new JabberAttachment().parse(attachment));
            }
        }

        this.name = activity.name;
        this.channelId = activity.channelId;
        this.text = activity.text;
        this.timestamp = activity.timestamp;
        this.id = activity.id;
        this.type = activity.type;

        this.from = new JabberChannelAccount().parse(activity.from);
        this.recipient = new JabberChannelAccount().parse(activity.recipient);
        this.conversation = activity.conversation;
        return this;
    }
}