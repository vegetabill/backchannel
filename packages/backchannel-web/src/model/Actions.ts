import { MessageCategory, ProtocolMessage } from "backchannel-common";

/**
 * For React app-only actions
 */
export enum ActionType {
  SentChat = "SENT_CHAT",
  ChannelConnected = "CHANNEL_CONNECTED",
  ChannelDisconnected = "CHANNEL_DISCONNECTED",
  ChannelNotFound = "CHANNEL_NOT_FOUND",
  ChannelClosed = "CHANNEL_CLOSED",
}

export interface AppAction {
  type: ActionType;
  payload: any;
}

export interface RemoteAction {
  category: MessageCategory;
  message: ProtocolMessage;
}

export function actionFromMessage(message: ProtocolMessage): RemoteAction {
  return {
    category: message.category,
    message,
  };
}
