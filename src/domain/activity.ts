
export interface Attachment {
    content: object;
    contentType: string;
    contentUrl: string;
    name: string;
    thumbnailUrl: string;
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
    name: string;
    attachments: Attachment[];
    text: string;
    timestamp: string;
    id: string;
    type: string;
    from: ChannelAccount;
    recipient: ChannelAccount;
    conversation: string;
  }

  export interface HeroCard {
    buttons: CardAction[];
    images: CardImage[];
    subtitle: string;
    tap: CardAction;
    text: string;
    title: string;
  }

  export interface CardAction {
    channelData: string;
    displayText: string;
    image: string;
    text: string;
    title: string;
    type: string;
    value: object;
  }

  export interface CardImage {
    alt: string;
    tap: string;
    url: string;
  }