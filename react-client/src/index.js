import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App socket={window.io()} />
  </React.StrictMode>,
  document.getElementById("root")
);
