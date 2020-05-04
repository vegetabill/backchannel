export interface User {
  id: string;
  name: string;
}

export interface Payload {
  actor: User;
  action: string;
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

export interface ProtocolMessage {
  type: string;
  id: string;
  payload: {
    actor: User;
    action: Action;
    timestamp?: Date;
  };
}
