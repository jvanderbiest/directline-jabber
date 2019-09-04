import { JabberChannelAccount } from "../../domain/jabberChannelAccount";
import { ActivityRoles, ActivityTypes } from "../../constants";
import { JabberActivity } from "../../domain/jabberActivity";
import { JabberAttachment } from "../../domain/jabberAttachment";
import { AttachmentContentTypes } from "../../domain/attachmentContentTypes";
import { JabberHeroCard } from "../../domain/jabberHeroCard";
import { JabberCardAction } from "../../domain/jabberCardAction";

export class ActivityHelper {
    static generateBotRole(): JabberChannelAccount {
        var botChannelAccount = new JabberChannelAccount();
        botChannelAccount.role = ActivityRoles.bot;
        return botChannelAccount;
    }

    static generateBotActivity(text?: string): JabberActivity {
        var activity = new JabberActivity();
        activity.id = "1";
        activity.text = text;
        activity.from = ActivityHelper.generateBotRole();
        activity.recipient = ActivityHelper.generateUserRole();
        return activity;
    }

    static generateUserRole(): JabberChannelAccount {
        var userChannelAccount = new JabberChannelAccount();
        userChannelAccount.role = ActivityRoles.user;
        return userChannelAccount;
    }

    static generateUserActivity(text?: string): JabberActivity {
        var activity = new JabberActivity();
        activity.id = "1";
        activity.text = text;
        activity.from = ActivityHelper.generateUserRole();
        activity.recipient = ActivityHelper.generateBotRole();
        return activity;
    }

    static generateConversationUpdateEvent(): JabberActivity {
        var activity = new JabberActivity();
        activity.id = "1";
        activity.from = ActivityHelper.generateUserRole();
        activity.recipient = ActivityHelper.generateBotRole();
        activity.type = 'conversationUpdate';
        return activity;
    }

    static generateHeroCardActivity(...attachments: Array<JabberAttachment>): JabberActivity {
        var activity = new JabberActivity();
        activity.id = "1";
        activity.text = "";
        activity.from = ActivityHelper.generateBotRole();
        activity.recipient = ActivityHelper.generateUserRole();
        activity.attachments = attachments;
        return activity;
    }

    static generateHeroCardAttachment(heroCard: JabberHeroCard): JabberAttachment {
        var attachment = new JabberAttachment();
        attachment.contentType = AttachmentContentTypes.heroCard;
        attachment.content = heroCard;
        return attachment;
    }

    static generateHeroCard(): JabberHeroCard {
        var heroCard = new JabberHeroCard();

        var anyButton1 = {
            channelData: "channel-data",
            displayText: "display-text",
            image: "https://some.ima.ge",
            title: "title",
            type: "type",
            value: {}
        }

        var button1 = new JabberCardAction().parse(anyButton1);
        button1.text = "Yes";

        var button2 = new JabberCardAction();
        button2.text = "No";

        heroCard.buttons.push(button1, button2);
        return heroCard;
    }
}