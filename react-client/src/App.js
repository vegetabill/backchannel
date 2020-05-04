import React, { useState } from "react";
import { Container } from "reactstrap";
import "./App.css";
import Activity from "./messages/Activity";

const componentsForEventType = new Map([["activity", Activity]]);

function App({ ws }) {
  const [events, setEvents] = useState([]);
  const [connectionState, setConnectionState] = useState("CLOSED");

  ws.addEventListener("open", () => {
    console.log("connected");
    setConnectionState("OPEN");
  });

  ws.addEventListener("close", () => {
    setConnectionState("CLOSED");
  });

  ws.addEventListener("message", (msg) => {
    console.log("msg => ", msg);
  });

  const children = events.map((event) => {
    console.log(event);
    const Comp = componentsForEventType.get(event.name);
    return <Comp key={event.id} {...event} />;
  });

  return (
    <main>
      <Container>{children}</Container>
    </main>
  );
}

export default App;
