// 3p
import * as express from "express";
import * as http from "http";
import * as WebSocket from "ws";

// 1p
import logger from "./lib/logger";
import { buildMessage } from "./lib/protocol-message";
import { generateUser } from "./lib/user";
import { createChannel } from "./lib/channel";
import {
  Channel,
  User,
  MessageCategory,
  ProtocolMessage,
} from "backchannel-common";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const rooms = new Map<string, Channel>();
const rootRoom = createChannel("root");
rooms.set(rootRoom.id, rootRoom);

wss.on("connection", (ws: WebSocket, request: http.IncomingMessage) => {
  const room = rooms.get(rootRoom.id);
  const { connections } = room;
  const user = generateUser();
  logger.debug(`${user.name} connecting...`);
  connections.set(user, ws);
  logger.debug(`${user.name} joined from ${request.socket.remoteAddress}`);

  const sendToAllOthers = (user: User, message: ProtocolMessage): void => {
    connections.forEach((client, member) => {
      if (member !== user) {
        client.send(JSON.stringify(message));
      }
    });
  };

  [...connections.keys()].forEach((u) => {
    ws.send(JSON.stringify(buildMessage(MessageCategory.JoinedChannel, u)));
  });

  sendToAllOthers(user, buildMessage(MessageCategory.JoinedChannel, user));
  ws.on("close", () => {
    logger.debug(`${user.name} left channel.`);
    connections.delete(user);
    sendToAllOthers(user, buildMessage(MessageCategory.LeftChannel, user));
  });
});

const port = process.env.PORT || 3001;

server.listen(port, () => {
  logger.info(`listening on ${JSON.stringify(server.address())}`);
});
