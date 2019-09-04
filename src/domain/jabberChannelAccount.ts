import { ChannelAccount } from "./activity";

export class JabberChannelAccount implements ChannelAccount {
    id: string;
    name: string;
    role: string;

    parse(channelAccount: any, userId: string, userIdPrefix: string): JabberChannelAccount {
        if (!channelAccount) { return; }

        if (channelAccount.role != "bot") {
            var accountId = "";
            if (userIdPrefix) {
                accountId = userIdPrefix;
            }
            if (userId) {
                accountId += userId;
            }
            else {
                accountId += channelAccount.id;
            }
            this.id = accountId;
        }
        else {
            this.id = channelAccount.id;
        }

        this.name = channelAccount.name;
        this.role = channelAccount.role;
        return this;
    }
}