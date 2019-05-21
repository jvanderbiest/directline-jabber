export class Directline {
  public static readonly token_endpoint = 'https://directline.botframework.com/v3/directline/tokens/generate';
  public static readonly conversation_endpoint = 'https://directline.botframework.com/v3/directline/conversations';
}

export class ActivityTypes {
  public static readonly conversationUpdate = 'conversationUpdate';
}

export class ActivityRoles {
  public static readonly bot = "bot";
  public static readonly user = "user";
}

export class Extensions {
  public static readonly chatdown = '.chat';
  public static readonly transcript = '.transcript';
}
