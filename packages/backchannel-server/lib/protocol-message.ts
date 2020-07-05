import { User, ProtocolMessage, MessageCategory } from "backchannel-common";
import * as shortId from "shortid";
import * as WebSocket from "ws";

export function buildMessage(
  category: MessageCategory,
  actor: User,
  payload?: string
): ProtocolMessage {
  return {
    id: shortId.generate(),
    timestamp: new Date(),
    category,
    actor,
    payload,
  };
}

export function parseMessage(event: WebSocket.MessageEvent) {
  const data = event.data as string;
  return JSON.parse(data) as ProtocolMessage;
}
