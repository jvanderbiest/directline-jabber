/// <reference types="node" />

declare module 'chatdown' {
  export interface Attachment {
      contentType: string;
      contentUrl: string;
      content: string;
    }
    
    export interface ChannelAccount {
      id: string;
      name: string;
      role: string;
    }
    
    export interface ConversationAccount {
      isGroup: string;
      name: string;
      id: string;
    }
    
    export interface Activity {
      attachments: Attachment[];
      text: string;
      timestamp: string;
      id: string;
      type: string;
      from: ChannelAccount;
      recipient: ChannelAccount;
      conversation: string;
    }

  export default function readContents(fileContents: string, args: {}): Promise<Activity[]>;
}