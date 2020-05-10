// 3p
import * as express from "express";
import * as http from "http";
import * as WebSocket from "ws";

// 1p
import logger from "./lib/logger";
import { buildMessage } from "./lib/protocol-message";
import { generateUser } from "./lib/user";
import { createChannel, Channel } from "./lib/channel";
import { MessageCategory, ProtocolMessage } from "backchannel-common";

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const channels = new Map<string, Channel>();
const rootChannel = createChannel("root");
channels.set(rootChannel.id, rootChannel);

wss.on("connection", (ws: WebSocket, request: http.IncomingMessage) => {
  const shouldBroadcast = (msg: ProtocolMessage): boolean => true;
  const sendObj = (obj) => {
    ws.send(JSON.stringify(obj));
  };
  const channel = channels.get(rootChannel.id);
  const { connections } = channel;
  const user = generateUser();
  logger.debug(`${user.name} connecting...`);
  connections.set(user, ws);
  const { socket } = request;
  logger.info(
    `${user.name} joined from ${socket.remoteAddress}/${socket.remotePort}`
  );
  sendObj(buildMessage(MessageCategory.IdentityGranted, user));

  [...connections.keys()].forEach((u) => {
    sendObj(buildMessage(MessageCategory.JoinedChannel, u));
  });
  channel.history.forEach((msg) => sendObj(msg));

  ws.onmessage = (event: WebSocket.MessageEvent): void => {
    const data = event.data as string;
    logger.debug(`rcvd from ${user.name} => ${data}`);
    const protoMsg = JSON.parse(data) as ProtocolMessage;
    if (shouldBroadcast(protoMsg)) {
      channel.broadcast(protoMsg);
    }
  };

  channel.broadcast(buildMessage(MessageCategory.JoinedChannel, user));
  ws.on("close", () => {
    logger.debug(`${user.name} left channel.`);
    connections.delete(user);
    channel.broadcast(buildMessage(MessageCategory.LeftChannel, user));
  });
});

const port = process.env.PORT || 3001;

server.listen(port, () => {
  logger.info(`listening on ${JSON.stringify(server.address())}`);
});
