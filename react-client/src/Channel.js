import Actions from "./actions";

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
    if (msg.type === "SYSTEM" && msg.payload.category === "CHANNEL_STATUS") {
      const payload = msg.payload.data;
      dispatch({ name: Actions.CHANNEL_JOINED, payload });
    } else {
      dispatch({ name: Actions.ACTION_RECEIVED, payload: msg });
    }
  });

  return {
    useDispatcher,
  };
}
