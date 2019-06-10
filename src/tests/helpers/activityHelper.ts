import { JabberChannelAccount } from "../../domain/jabberChannelAccount";
import { ActivityRoles, ActivityTypes } from "../../constants";
import { JabberActivity } from "../../domain/jabberActivity";

export class ActivityHelper {
    static generateBotRole(): JabberChannelAccount {
        var botChannelAccount = new JabberChannelAccount();
        botChannelAccount.role = ActivityRoles.bot;
        return botChannelAccount;
    }

    static generateBotActivity(text?: string) : JabberActivity {
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
    
    static generateConversationUpdateEvent() : JabberActivity {
        var activity = new JabberActivity();
        activity.id = "1";
        activity.from = ActivityHelper.generateUserRole();
        activity.recipient = ActivityHelper.generateBotRole();
        activity.type = 'conversationUpdate';
        return activity;
    }
}