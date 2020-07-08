import { actionFromMessage, ActionType } from "./Actions";
import {
  MessageCategory,
  apiRoutes,
  WsClosureCodes,
  ProtocolMessage,
  buildMessage,
} from "backchannel-common";

const ENDPOINT_ROOT =
  process.env.REACT_APP_WS_ENDPOINT || "ws://localhost:3001";

export interface Channel {
  id: string;
  nickname: string;
  send(msg: ProtocolMessage): void;
}

export const disconnectedChannel: Channel = {
  id: "",
  nickname: "",
  send: () => undefined,
};

export const notFoundChannel: Channel = {
  id: "Not Found",
  nickname: "",
  send: () => undefined,
};

export function connectToChannel(
  channelId: string,
  dispatch: Function
): () => void | undefined {
  const channelPath = apiRoutes.CHANNEL_WEBSOCKET.build(channelId);
  const ws = new WebSocket(`${ENDPOINT_ROOT}${channelPath}`);

  function send(msg: ProtocolMessage) {
    ws.send(JSON.stringify(msg));
  }

  function onOpen() {
    console.log(`connected to channel ${channelId}`);
    dispatch({
      type: ActionType.ChannelConnected,
      payload: {
        send,
        id: channelId,
        nickname: "🐻 Osito's Honeypot 🐝",
      },
    });
    send(buildMessage(MessageCategory.ConnectToChannel, undefined, channelId));
  }

  function onClose(closeEvent: CloseEvent) {
    console.log(`disconnected from channel ${channelId}`);
    if (closeEvent.code === WsClosureCodes.ChannelNotFound) {
      dispatch({
        type: ActionType.ChannelNotFound,
        payload: channelId,
      });
    }
    dispatch({
      type: ActionType.ChannelDisconnected,
      payload: channelId,
    });
  }

  function onError(err: Event) {
    console.error(err);
  }

  function onMessage({ data }: any) {
    const msg = JSON.parse(data);
    console.debug(`channel[${channelId}] received: `, msg);
    const action = actionFromMessage(msg);
    dispatch(action);
  }

  ws.addEventListener("open", onOpen);
  ws.addEventListener("close", onClose);
  ws.addEventListener("error", onError);
  ws.addEventListener("message", onMessage);

  function unsubscribeAll() {
    ws.removeEventListener("open", onOpen);
    ws.removeEventListener("close", onClose);
    ws.removeEventListener("error", onError);
    ws.removeEventListener("message", onMessage);
    if (ws.readyState !== ws.CLOSED) {
      ws.close();
    }
  }

  return unsubscribeAll;
}
