import * as WebSocket from "ws";

export interface User {
  id: string;
  name: string;
}

export interface Payload {
  actor: User;
  action: string;
}

export enum CategorySystem {
  ChannelStatus = "CHANNEL_STATUS",
  ChannelExpirationWarning = "CHANNEL_EXPIRATION_WARNING",
  ChannelClosed = "CHANNEL_CLOSED",
  SystemError = "SYSTEM_ERROR",
}

export enum Action {
  JoinedChannel = "JOIN_CHANNEL",
  LeftChannel = "LEFT_CHANNEL",
  SentChat = "SENT_CHAT",
  WentIdle = "WENT_IDLE",
  ReturnedToActive = "RETURNED_TO_ACTIVE",
  StartingTyping = "STARTED_TYPING",
  StoppedTyping = "STOPPED_TYPING",
  DeletedChat = "DELETED_CHAT",
  EditedChat = "EDITED_CHAT",
}

export interface ActionPayload {
  actor: User;
  action: Action;
  timestamp?: Date;
}

export interface SystemPayload {
  data: any;
  category: CategorySystem;
  timestamp: Date;
}

export enum MessageType {
  Action = "ACTION",
  System = "SYSTEM",
}

export interface ProtocolMessage {
  type: MessageType;
  id: string;
  payload: ActionPayload | SystemPayload;
}

export interface Room {
  id: string;
  nickname?: string;
  createdAt: Date;
  expirationDate: Date;
  members: Map<User, WebSocket>;
}
