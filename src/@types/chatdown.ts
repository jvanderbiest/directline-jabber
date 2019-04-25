/// <reference types="node" />

declare module 'chatdown-domain' {
  export interface Activity {
    attachments: Attachment[],
    text: string,
    timestamp: string,
    id: number,
    type: string,
    from: ChannelAccount,
    recipient: ChannelAccount,
    conversation: string
  }

  export interface Attachment {
    contentType: string,
    contentUrl: string,
    content: string
  }

  export interface ChannelAccount {
    id: string,
    name: string,
    role: string
  }
  
  export interface ConversationAccount {
    isGroup: string,
    name: string,
    id: string
  }
}

declare module 'chatdown' {
  import { Activity } from "chatdown-domain";

  function readContents(fileContents: string, args: {}): Promise<Activity[]>
  export = readContents;
}
