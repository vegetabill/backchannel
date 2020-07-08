import * as shortId from "shortid";
import * as WebSocket from "ws";
import { MessageCategory, ProtocolMessage, User } from "./types";

export const UnknownUser: User = {
  id: "unknown-user",
  name: "Unknown User",
};

export function buildMessage(
  category: MessageCategory,
  actor?: User,
  payload?: string
): ProtocolMessage {
  return {
    id: shortId.generate(),
    timestamp: new Date(),
    category,
    actor: actor || UnknownUser,
    payload: payload || "",
  };
}

export function parseMessage(event: WebSocket.MessageEvent) {
  const data = event.data as string;
  return JSON.parse(data) as ProtocolMessage;
}
