import { MessageCategory, ProtocolMessage } from "backchannel-common";

/**
 * For React app-only actions
 */
export enum ActionType {
  SentChat = "SENT_CHAT",
  ChannelConnected = "CHANNEL_CONNECTED",
}

export interface AppAction {
  type: ActionType;
  payload: string;
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
