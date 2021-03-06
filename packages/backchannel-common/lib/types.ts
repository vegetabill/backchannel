export interface User {
  id: string;
  name: string;
}

export enum MessageCategory {
  ChannelExpirationWarning = "CHANNEL_EXPIRATION_WARNING",
  ChannelClosed = "CHANNEL_CLOSED",
  SystemError = "SYSTEM_ERROR",
  ConnectToChannel = "CONNECT_TO_CHANNEL",
  JoinedChannel = "JOIN_CHANNEL",
  IdentityGranted = "IDENTITY_GRANTED",
  LeftChannel = "LEFT_CHANNEL",
  SentChat = "SENT_CHAT",
  WentIdle = "WENT_IDLE",
  ReturnedToActive = "RETURNED_TO_ACTIVE",
  StartingTyping = "STARTED_TYPING",
  StoppedTyping = "STOPPED_TYPING",
  DeletedChat = "DELETED_CHAT",
  EditedChat = "EDITED_CHAT",
}

export interface ProtocolMessage {
  id: string;
  category: MessageCategory;
  payload: string;
  actor: User;
  timestamp: Date;
}

export enum WsClosureCode {
  ChannelNotFound = 4004,
  ChannelExpired = 4005,
  ChannelInactivity = 4006,
}
