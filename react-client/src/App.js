import React, { useState, useEffect } from "react";
import { Container } from "reactstrap";
import "./App.css";
import Activity from "./messages/Activity";
import { connectToChannel } from "./Channel";
// import { MessageType, CategorySystem, ProtocolMessage } from "./server-types";

const componentsForEventType = new Map([["ACTION", Activity]]);

function App() {
  const [events, setEvents] = useState([]);
  const [channel, setChannel] = useState();

  useEffect(() => {
    const channel = connectToChannel(
      "root",
      process.env.REACT_APP_WS_ENDPOINT || "ws://localhost:3001"
    );
    channel.onChannelStatusUpdate(setChannel);
    channel.onAction((action) => {
      setEvents([...events, action]);
    });
  }, []);

  const children = events.map((event) => {
    console.log(event);
    const Comp = componentsForEventType.get(event.type);
    return <Comp key={event.id} {...event.payload} />;
  });

  return (
    <main>
      <h1>{channel ? channel.alias : "Not Yet Connected"}</h1>
      <h2>
        {channel
          ? `Joined along with ${channel.members.length} others.`
          : "Waiting for channel info."}
      </h2>
      <Container>{children}</Container>
    </main>
  );
}

export default App;
