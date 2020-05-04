import React, { useState } from "react";
import { Container } from "reactstrap";
import "./App.css";
import Activity from "./messages/Activity";

const componentsForEventType = new Map([["activity", Activity]]);

function App({ socket }) {
  const [events, setEvents] = useState([]);

  socket.on("activity", (event) =>
    setEvents([...events, { name: "activity", ...event }])
  );

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
