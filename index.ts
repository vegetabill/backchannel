// 3p
import * as express from "express";
import * as http from "http";
import * as WebSocket from "ws";

// 1p
import logger from "./lib/logger";
import { buildMessage } from "./lib/events";
import { generateUser } from "./lib/user";
import { ProtocolMessage, User, Action } from "./lib/types";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const actives = new Map();

function sendToAllOthers(user: User, message: ProtocolMessage): void {
  [...actives.keys()]
    .filter((u) => u !== user)
    .forEach((u) => actives.get(u).send(JSON.stringify(message)));
}

wss.on("connection", (ws: WebSocket, request: http.IncomingMessage) => {
  const user = generateUser();
  logger.debug(`${user.name} connecting...`);
  actives.set(user, ws);

  logger.debug(`${user.name} joined from ${request.socket.remoteAddress}`);
  sendToAllOthers(user, buildMessage(user, Action.JoinedChannel));
  ws.on("close", () => {
    logger.debug(`${user.name} left channel.`);
    actives.delete(user);
    sendToAllOthers(user, buildMessage(user, Action.LeftChannel));
  });
});

const port = process.env.PORT || 3001;

server.listen(port, () => {
  logger.info(`listening on ${JSON.stringify(server.address())}`);
});
