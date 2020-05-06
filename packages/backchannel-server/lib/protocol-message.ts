import { User, ProtocolMessage, MessageCategory } from "backchannel-common";
import * as shortId from "shortid";

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
