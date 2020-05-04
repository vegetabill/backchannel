import { User, Action, ProtocolMessage } from "./types";
import * as shortId from "shortid";

export function buildMessage(actor: User, action: Action): ProtocolMessage {
  return {
    type: "activity",
    id: shortId.generate(),
    payload: {
      timestamp: new Date(),
      actor,
      action,
    },
  };
}
