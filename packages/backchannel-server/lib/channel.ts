import { User, ProtocolMessage, MessageCategory } from "backchannel-common";
import * as shortId from "shortid";
import * as WebSocket from "ws";
import { buildMessage, parseMessage } from "./protocol-message";
import { generateUser } from "./user";
import logger from "./logger";

export interface Channel {
  id: string;
  createdAt: Date;
  expiresAt: Date;
  history: Array<ProtocolMessage>;
  broadcast(msg: ProtocolMessage): void;
  sendToUser(recipient: User, msg: ProtocolMessage): void;
  register(user: User, socket: WebSocket): void;
  unregister(user: User): void;
  getMembers(): Array<User>;
}

const REPLAY_LIMIT = 5;
const MAX_CHANNELS = parseInt(process.env.MAX_CHANNELS) || 8;

const toWire = (msg: ProtocolMessage): string => JSON.stringify(msg);
const getExpirationDate = () => new Date(Date.now() + 1000 * 60 * 15); //15 minutes
const shouldBroadcast = (msg: ProtocolMessage): boolean => true;

export function createController() {
  const channels = new Map<string, Channel>();

  const stats = () => {
    return {
      channels: channels.size,
      users: [...channels.values()].reduce((sum) => sum + 1, 0),
    };
  };

  const create = (): Channel => {
    const channel = createChannel();
    channels.set(channel.id, channel);
    return channel;
  };

  const get = (id: string) => channels.get(id);

  return {
    hasCapacity: () => channels.size < MAX_CHANNELS,
    stats,
    create,
    get,
  };
}

export function connectToChannel(channel: Channel, ws: WebSocket): void {
  const user = generateUser();
  channel.register(user, ws);
  channel.sendToUser(user, buildMessage(MessageCategory.IdentityGranted, user));

  channel.getMembers().forEach((existingMemeber) => {
    channel.sendToUser(
      user,
      buildMessage(MessageCategory.JoinedChannel, existingMemeber)
    );
  });
  channel.history.forEach((msg) => channel.sendToUser(user, msg));
  channel.broadcast(buildMessage(MessageCategory.JoinedChannel, user));

  ws.addEventListener("message", (event: WebSocket.MessageEvent): void => {
    const protoMsg = parseMessage(event);
    if (shouldBroadcast(protoMsg)) {
      channel.broadcast(protoMsg);
    }
  });

  ws.on("close", () => {
    channel.unregister(user);
    channel.broadcast(buildMessage(MessageCategory.LeftChannel, user));
  });
}

export function createChannel(): Channel {
  const id = shortId.generate();
  const connections = new Map<User, WebSocket>();

  const history = [];

  function recordChat(msg: ProtocolMessage) {
    history.push(msg);
    if (history.length > REPLAY_LIMIT) {
      history.shift();
    }
  }

  function register(user: User, socket: WebSocket): void {
    logger.debug(`${user.name} joined ${id}.`);

    connections.set(user, socket);
  }

  function unregister(user: User) {
    logger.debug(`${user.name} left ${id}.`);
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
    id,
    createdAt: new Date(),
    history,
    expiresAt: getExpirationDate(),
    broadcast,
    sendToUser,
    register,
    unregister,
    getMembers,
  };
}
