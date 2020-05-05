import {
  User,
  Action,
  ProtocolMessage,
  MessageType,
  CategorySystem,
} from "./types";
import * as shortId from "shortid";

export function buildAction(actor: User, action: Action): ProtocolMessage {
  return {
    type: MessageType.Action,
    id: shortId.generate(),
    payload: {
      timestamp: new Date(),
      actor,
      action,
    },
  };
}

export function buildSystemMessage(category: CategorySystem, data: any) {
  return {
    type: MessageType.System,
    id: shortId.generate(),
    payload: {
      category,
      timestamp: new Date(),
      data,
    },
  };
}
