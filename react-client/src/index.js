import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import App from "./App";

const websocketEndpoint =
  process.env.REACT_APP_WS_ENDPOINT || "ws://localhost:3001";
const ws = new WebSocket(websocketEndpoint);

ReactDOM.render(
  <React.StrictMode>
    <App ws={ws} />
  </React.StrictMode>,
  document.getElementById("root")
);
