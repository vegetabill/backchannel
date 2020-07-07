import { actionFromMessage, ActionType } from "./Actions";
import { MessageCategory, apiRoutes } from "backchannel-common";

const ENDPOINT_ROOT =
  process.env.REACT_APP_WS_ENDPOINT || "ws://localhost:3001";

export function connectToChannel(channelId, dispatch) {
  const channelPath = apiRoutes.CHANNEL_WEBSOCKET.build(channelId);
  const ws = new WebSocket(`${ENDPOINT_ROOT}${channelPath}`);

  function send(msg) {
    ws.send(JSON.stringify(msg));
  }

  return new Promise((resolve, reject) => {
    ws.addEventListener("open", () => {
      console.log(`connected to channel ${channelId}`);
      dispatch({
        type: ActionType.ChannelConnected,
        payload: {
          send,
          id: channelId,
          nickname: "🐻 Osito's Honeypot 🐝",
        },
      });
      send({
        category: MessageCategory.ConnectToChannel,
        payload: channelId,
      });
    });

    ws.addEventListener("close", () => {
      console.log(`disconnected from channel ${channelId}`);
    });

    ws.addEventListener("error", (err) => {
      console.error(err);
      reject(err);
    });

    ws.addEventListener("message", ({ data }) => {
      const msg = JSON.parse(data);
      console.debug(`channel[${channelId}] received: `, msg);
      const action = actionFromMessage(msg);
      dispatch(action);
    });
  });
}
