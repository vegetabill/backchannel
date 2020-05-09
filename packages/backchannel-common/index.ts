import * as WebSocket from "ws";

export interface User {
  id: string;
  name: string;
}

export interface Channel {
  id: string;
  name?: string;
  createdAt: Date;
  expirationDate: Date;
  connections: Map<User, WebSocket>;
}

export enum MessageCategory {
  ChannelExpirationWarning = "CHANNEL_EXPIRATION_WARNING",
  ChannelClosed = "CHANNEL_CLOSED",
  SystemError = "SYSTEM_ERROR",
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
