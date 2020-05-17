import React, { useReducer, useEffect } from "react";
import reducer, { registerChannel } from "./state/Reducer";
import { Container } from "reactstrap";
import "./style/App.css";
import Message from "./components/messages";
import ChatEditor from "./components/ChatEditor";
import { connectToChannel } from "./model/Channel";
import { Provider } from "./state/Context";
import Header from "./components/Header";

const initialState = {
  messages: [],
  members: [],
  outbox: [],
  user: { name: "", id: "" },
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const channel = connectToChannel(
      "root",
      process.env.REACT_APP_WS_ENDPOINT || "ws://localhost:3001"
    );
    channel.useDispatcher(dispatch);
    registerChannel(channel);
  }, []);

  const { messages, members, user, outbox } = state;

  return (
    <Provider value={{ state, dispatch }}>
      <Header user={user} members={members} room="root" />
      <main>
        <Container>
          {messages.map((msg) => (
            <Message key={msg.id} draft={false} message={msg} />
          ))}
          {outbox.map((msg) => (
            <Message key={msg.id} draft={true} message={msg} />
          ))}
        </Container>
        <ChatEditor />
      </main>
      <footer>backchannel</footer>
    </Provider>
  );
}

export default App;
