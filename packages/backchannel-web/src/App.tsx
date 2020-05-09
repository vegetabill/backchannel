import React, { useReducer, useEffect, createContext } from "react";
import reducer, { registerChannel } from "./reducers";
import { Container } from "reactstrap";
import "./App.css";
import Message from "./messages";
import ChatEditor from "./ChatEditor";
import { connectToChannel } from "./channel";
import { Provider } from "./Context";
import Avatar from "./Avatar";
import { Spinner } from "reactstrap";

const initialState = {
  messages: [],
  members: [],
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

  const { messages, members, user } = state;

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
    <Provider value={{ state, dispatch }}>
      <main>
        <h2>
          {user.name ? <Avatar user={user} /> : <Spinner color="info" />}
          {subheading()}
        </h2>
        <Container>
          {messages.map((msg) => (
            <Message message={msg} />
          ))}
        </Container>
        <ChatEditor />
      </main>
    </Provider>
  );
}

export default App;
