export function connectToChannel(name, endpoint) {
  const ws = new WebSocket(endpoint);
  let connectionState = "CLOSED";
  let stateListener = () => null;
  let channelStatusListener = () => null;
  let actionListener = () => null;

  const onConnectionStateChange = (handler) => {
    stateListener = handler;
  };

  const setConnectionState = (value) => {
    connectionState = value;
    stateListener(connectionState);
  };

  ws.addEventListener("open", () => {
    setConnectionState("CONNECTED");
  });

  ws.addEventListener("close", () => {
    setConnectionState("CLOSED");
  });

  const onChannelStatusUpdate = (listener) => {
    channelStatusListener = listener;
  };

  const onAction = (listener) => {
    actionListener = listener;
  };

  ws.addEventListener("message", ({ data }) => {
    const msg = JSON.parse(data);
    console.log("msg => ", msg);
    if (msg.type === "SYSTEM" && msg.payload.category === "CHANNEL_STATUS") {
      const payload = msg.payload.data;
      channelStatusListener(payload);
    } else {
      actionListener(msg);
    }
  });

  return {
    onConnectionStateChange,
    onChannelStatusUpdate,
    onAction,
  };
}
