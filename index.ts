// 3p
import * as express from "express";
import * as http from "http";
import * as WebSocket from "ws";

// 1p
import logger from "./lib/logger";
import { buildAction, buildSystemMessage } from "./lib/events";
import { generateUser } from "./lib/user";
import { createRoom } from "./lib/rooms";
import {
  ProtocolMessage,
  User,
  Action,
  CategorySystem,
  Room,
} from "./lib/types";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const rooms = new Map<string, Room>();
const rootRoom = createRoom("root");
rooms.set(rootRoom.id, rootRoom);

wss.on("connection", (ws: WebSocket, request: http.IncomingMessage) => {
  const room = rooms.get(rootRoom.id);
  const { members } = room;
  const user = generateUser();
  logger.debug(`${user.name} connecting...`);
  members.set(user, ws);
  logger.debug(`${user.name} joined from ${request.socket.remoteAddress}`);

  const sendToAllOthers = (user: User, message: ProtocolMessage): void => {
    members.forEach((client, member) => {
      if (member !== user) {
        client.send(JSON.stringify(message));
      }
    });
  };

  ws.send(
    JSON.stringify(
      buildSystemMessage(CategorySystem.ChannelStatus, {
        members: [...members.keys()],
        createdAt: room.createdAt,
        nickname: room.nickname,
        alias: user.name,
      })
    )
  );
  sendToAllOthers(user, buildAction(user, Action.JoinedChannel));
  ws.on("close", () => {
    logger.debug(`${user.name} left channel.`);
    members.delete(user);
    sendToAllOthers(user, buildAction(user, Action.LeftChannel));
  });
});

const port = process.env.PORT || 3001;

server.listen(port, () => {
  logger.info(`listening on ${JSON.stringify(server.address())}`);
});
