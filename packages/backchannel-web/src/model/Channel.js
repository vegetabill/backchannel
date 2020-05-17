import { actionFromMessage } from "./Actions";

export function connectToChannel(name, endpoint) {
  const ws = new WebSocket(endpoint);
  let dispatch = () => false;

  const useDispatcher = (dispatchFunc) => {
    dispatch = dispatchFunc;
  };

  ws.addEventListener("open", () => {
    console.log(`connected to channel ${name}`);
  });

  ws.addEventListener("close", () => {
    console.log(`disconnected to channel ${name}`);
  });

  ws.addEventListener("message", ({ data }) => {
    const msg = JSON.parse(data);
    console.debug(`channel[${name}] received: `, msg);
    const action = actionFromMessage(msg);
    dispatch(action);
  });

  function send(msg) {
    ws.send(JSON.stringify(msg));
  }

  return {
    useDispatcher,
    send,
  };
}
