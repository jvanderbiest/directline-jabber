import { ChannelAccount } from "chatdown";

export class JabberChannelAccount implements ChannelAccount {
    id: string;
    name: string;
    role: string;

    parse(channelAccount: any): JabberChannelAccount {
        if (!channelAccount) { return; }
        this.id = channelAccount.id;
        this.name = channelAccount.name;
        this.role = channelAccount.role;
        return this;
    }
}