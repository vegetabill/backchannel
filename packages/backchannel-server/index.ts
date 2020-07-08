// 3p
import { apiRoutes, WsClosureCodes } from "backchannel-common";
import * as cors from "cors";
import * as express from "express";
import * as http from "http";
import * as WebSocket from "ws";
// 1p
import { assignSocketToChannel, createController } from "./lib/channel";
import logger from "./lib/logger";

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

app.post(apiRoutes.CHANNELS_RESOURCE.indexPath, (_, resp) => {
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
  const { url } = request;
  const channelId = apiRoutes.CHANNEL_WEBSOCKET.matcher(url);
  const channel = channelId && channelController.get(channelId);

  if (!channel) {
    logger.warn(`No such channel ${channelId}. Disconnecting`);
    ws.close(WsClosureCodes.ChannelNotFound);
  } else {
    assignSocketToChannel(channel, ws);
  }
});

wss.on("error", (err) => logger.error(err));

const port = process.env.PORT || 3001;

server.listen(port, () => {
  logger.info(`listening on ${JSON.stringify(server.address())}`);
});
