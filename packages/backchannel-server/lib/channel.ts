import {
  User,
  ProtocolMessage,
  MessageCategory,
  buildMessage,
  parseMessage,
  WsClosureCode,
} from "backchannel-common";
import * as shortId from "shortid";
import * as WebSocket from "ws";
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
  close(code: WsClosureCode): void;
}

const intConfig = (name: string, defaultValue: number): number => {
  const strVal = process.env[name];
  if (strVal) {
    const value = parseInt(strVal);
    logger.info(`Config override: ${name}=${value}`);
    return value;
  }
  return defaultValue;
};

const REPLAY_LIMIT = intConfig("REPLA_LIMIT", 5);
const MAX_CHANNELS = intConfig("MAX_CHANNELS", 8);

const toWire = (msg: ProtocolMessage): string => JSON.stringify(msg);
const EXPIRATION_WARNING_TIME_SEC = intConfig(
  "EXPIRATION_WARNING_TIME_SEC",
  300
);
const CHANNEL_LIFETIME_SEC = intConfig("CHANNEL_LIFETIME_SEC", 90 * 60);
const getExpirationDate = () =>
  new Date(Date.now() + CHANNEL_LIFETIME_SEC * 1000);
const shouldBroadcast = (msg: ProtocolMessage): boolean => true;

export function createController() {
  const channels = new Map<string, Channel>();

  const stats = () => {
    return {
      channels: channels.size,
      users: [...channels.values()].reduce((sum) => sum + 1, 0),
    };
  };

  const createReaper = (channel: Channel) => {
    const millisUntilWarning =
      channel.expiresAt.getTime() -
      Date.now() -
      EXPIRATION_WARNING_TIME_SEC * 1000;
    logger.debug(
      `Channel ${channel.id} will expire in ${
        CHANNEL_LIFETIME_SEC / 60
      } minutes`
    );
    setTimeout(() => {
      logger.info(
        `Channel ${channel.id} will expire in ${
          EXPIRATION_WARNING_TIME_SEC / 60
        } minutes`
      );
      channel.broadcast(
        buildMessage(
          MessageCategory.ChannelExpirationWarning,
          null,
          `Channel expiring in ${EXPIRATION_WARNING_TIME_SEC / 60} minutes.`
        )
      );
      setTimeout(() => {
        channel.broadcast(buildMessage(MessageCategory.ChannelClosed));
        channel.close(WsClosureCode.ChannelExpired);
        channels.delete(channel.id);
      }, EXPIRATION_WARNING_TIME_SEC * 1000);
    }, millisUntilWarning);
  };

  const create = (): Channel => {
    const channel = createChannel();
    channels.set(channel.id, channel);
    createReaper(channel);
    return channel;
  };

  const get = (id: string) => channels.get(id);

  const hasCapacity = (): boolean => {
    const emptyChannels = [...channels.values()].filter(
      (c) => c.getMembers().length === 0
    );
    if (emptyChannels.length > 0) {
      logger.info(`Reaping empty channels: ${emptyChannels.join(", ")}`);
      emptyChannels.forEach((c) => {
        channels.delete(c.id);
        c.close(WsClosureCode.ChannelInactivity);
      });
    }
    return channels.size < MAX_CHANNELS;
  };

  return {
    hasCapacity,
    stats,
    create,
    get,
  };
}

export function assignSocketToChannel(channel: Channel, ws: WebSocket): void {
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
        `unable to send to ${recipient.id} / ${recipient.name}. maybe they disconnected`
      );
    }
  }

  function broadcast(msg: ProtocolMessage): void {
    if (msg.category === MessageCategory.SentChat) {
      recordChat(msg);
    }
    const msgStr = toWire(msg);
    connections.forEach((ws) => {
      try {
        ws.send(msgStr);
      } catch {
        logger.warn(`Error broadcasting msg: ${msgStr}`);
      }
    });
  }

  function getMembers() {
    return [...connections.keys()];
  }

  function close(code: WsClosureCode) {
    logger.info(`Channel ${id} closing with code ${code}`);
    [...connections.values()].forEach((ws) => ws.close(code));
    connections.clear();
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
    close,
  };
}
