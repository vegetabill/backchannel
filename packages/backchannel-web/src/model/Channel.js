import { actionFromMessage } from "./Actions";
import { MessageCategory } from "backchannel-common";

export function connectToChannel(channelId, endpoint) {
  const ws = new WebSocket(endpoint);
  let dispatch = () => false;

  const useDispatcher = (dispatchFunc) => {
    dispatch = dispatchFunc;
  };

  ws.addEventListener("open", () => {
    console.log(`connected to channel ${channelId}`);
    send({
      category: MessageCategory.ConnectToChannel,
      payload: channelId,
    });
  });

  ws.addEventListener("close", () => {
    console.log(`disconnected from channel ${channelId}`);
  });

  function send(msg) {
    ws.send(JSON.stringify(msg));
  }

  return new Promise((resolve, reject) => {
    const initialListner = ({ data }) => {
      ws.removeEventListener("message", initialListner);

      if (data.category === MessageCategory.IdentityGranted) {
        ws.addEventListener("message", ({ data }) => {
          const msg = JSON.parse(data);
          console.debug(`channel[${channelId}] received: `, msg);
          const action = actionFromMessage(msg);
          dispatch(action);
        });
        resolve({ useDispatcher, send });
      }
    };
    ws.addEventListener("message", initialListner);

    ws.addEventListener("error", reject);
  });
}
