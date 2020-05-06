import React, { useReducer, useEffect } from "react";
import reducer from "./reducers";
import { Container } from "reactstrap";
import "./App.css";
import Message from "./messages";
import { connectToChannel } from "./channel";

const initialState = {
  messages: [],
  members: [],
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    connectToChannel(
      "root",
      process.env.REACT_APP_WS_ENDPOINT || "ws://localhost:3001"
    ).useDispatcher(dispatch);
  }, []);

  const { messages, members } = state;

  const subheading = () => {
    if (members) {
      if (members.length === 1) {
        return "You're alone in the channel. 😭";
      } else {
        return `${members.length - 1} conspirators also in the channel.`;
      }
    }
  };

  return (
    <main>
      <h1>{messages && messages.length ? null : "Not Yet Connected"}</h1>
      <h2>{subheading()}</h2>
      <Container>
        {messages.map((msg) => (
          <Message message={msg} />
        ))}
      </Container>
    </main>
  );
}

export default App;
