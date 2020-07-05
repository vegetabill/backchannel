// 3p
import { MessageCategory } from "backchannel-common";
import * as cors from "cors";
import * as express from "express";
import * as http from "http";
import * as WebSocket from "ws";
import { connectToChannel, createController } from "./lib/channel";
// 1p
import logger from "./lib/logger";
import { parseMessage } from "./lib/protocol-message";

const app = express();

const origin = process.env.WEB_APP_ORIGIN || "http://localhost:3000";
app.use(cors({ origin }));
logger.info(`Allowing CORS requests from ${origin}`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const channelController = createController();

const healthCheck = () => Promise.resolve(true);

app.get("/ping", (_, resp) => {
  healthCheck().then(() => resp.sendStatus(200));
});

app.get("/stats", (_, resp) => resp.send(channelController.stats()));

app.post("/channels", (_, resp) => {
  if (channelController.hasCapacity()) {
    const channel = channelController.create();
    logger.info(`Channel ${channel.id} created.`);
    resp.status(201);
    resp.send({ channelId: channel.id });
  } else {
    logger.warn(`Channel creation request denied due to capacity exceeded`);
    resp.sendStatus(503);
  }
});

wss.on("connection", (ws: WebSocket, request: http.IncomingMessage) => {
  const { socket } = request;
  logger.debug(`Connection from ${socket.remoteAddress}/${socket.remotePort}`);

  const firstMessageListener = (event) => {
    ws.removeEventListener("message", firstMessageListener);

    const msg = parseMessage(event);
    logger.debug(`First message received, ${JSON.stringify(msg)}`);
    if (msg.category === MessageCategory.ConnectToChannel) {
      const channelId = msg.payload;
      logger.debug(`Connecting to ${channelId}`);
      const channel = channelController.get(channelId);
      if (channel) {
        connectToChannel(channel, ws);
      } else {
        logger.warn(`No such channel ${channelId}. Disconnecting`);
        setTimeout(() => ws.close(), Math.floor(Math.random() * 1000));
      }
    } else {
      logger.error("Protocol error: initial message must be ConnectToChannel");
      ws.close(-1, "Protocol error: initial message must be ConnectToChannel");
    }
  };
  ws.addEventListener("message", firstMessageListener);
});

const port = process.env.PORT || 3001;

server.listen(port, () => {
  logger.info(`listening on ${JSON.stringify(server.address())}`);
});
