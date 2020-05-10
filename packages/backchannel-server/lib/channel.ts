import { User, ProtocolMessage, MessageCategory } from "backchannel-common";
import * as shortId from "shortid";
import * as WebSocket from "ws";

export interface Channel {
  id: string;
  name?: string;
  createdAt: Date;
  expirationDate: Date;
  connections: Map<User, WebSocket>;
  history: Array<ProtocolMessage>;
  broadcast(msg: ProtocolMessage): void;
}

export function createChannel(name?: string): Channel {
  const hourFromNow = Date.now() + 1000 * 60 * 60;

  const connections = new Map<User, WebSocket>();

  const history = [];

  function recordChat(msg: ProtocolMessage) {
    history.push(msg);
    if (history.length > 5) {
      history.shift();
    }
  }

  function broadcast(msg: ProtocolMessage): void {
    if (msg.category === MessageCategory.SentChat) {
      recordChat(msg);
    }
    const msgStr = JSON.stringify(msg);
    connections.forEach((ws) => {
      ws.send(msgStr);
    });
  }

  return {
    id: shortId.generate(),
    createdAt: new Date(),
    name,
    history,
    connections,
    expirationDate: new Date(hourFromNow),
    broadcast,
  };
}
