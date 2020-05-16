import { User, ProtocolMessage, MessageCategory } from "backchannel-common";
import * as shortId from "shortid";
import * as WebSocket from "ws";
import logger from "./logger";

export interface Channel {
  id: string;
  name?: string;
  createdAt: Date;
  expirationDate: Date;
  history: Array<ProtocolMessage>;
  broadcast(msg: ProtocolMessage): void;
  sendToUser(recipient: User, msg: ProtocolMessage): void;
  register(user: User, socket: WebSocket): void;
  unregister(user: User): void;
  getMembers(): Array<User>;
}

export function createChannel(name: string): Channel {
  const toWire = (msg: ProtocolMessage): string => JSON.stringify(msg);
  const hourFromNow = Date.now() + 1000 * 60 * 60;

  const connections = new Map<User, WebSocket>();

  const history = [];

  function recordChat(msg: ProtocolMessage) {
    history.push(msg);
    if (history.length > 5) {
      history.shift();
    }
  }

  function register(user: User, socket: WebSocket): void {
    logger.debug(`${user.name} joined ${name}.`);

    connections.set(user, socket);
  }

  function unregister(user: User) {
    logger.debug(`${user.name} left ${name}.`);
    connections.delete(user);
  }

  function sendToUser(recipient: User, msg: ProtocolMessage): void {
    const recipientConn = connections.get(recipient);
    if (recipientConn) {
      recipientConn.send(toWire(msg));
    } else {
      logger.warn(
        `unable to send to ${recipient.name}. maybe they disconnected`
      );
    }
  }

  function broadcast(msg: ProtocolMessage): void {
    if (msg.category === MessageCategory.SentChat) {
      recordChat(msg);
    }
    const msgStr = toWire(msg);
    connections.forEach((ws) => {
      ws.send(msgStr);
    });
  }

  function getMembers() {
    return [...connections.keys()];
  }

  return {
    id: shortId.generate(),
    createdAt: new Date(),
    name,
    history,
    expirationDate: new Date(hourFromNow),
    broadcast,
    sendToUser,
    register,
    unregister,
    getMembers,
  };
}
