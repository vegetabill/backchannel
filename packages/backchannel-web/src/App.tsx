import React, { useReducer, useEffect } from "react";
import reducer, { registerChannel } from "./state/Reducer";
import { Container } from "reactstrap";
import "./style/App.css";
import AnyMessage from "./components/messages/AnyMessage";
import ChatEditor from "./components/ChatEditor";
import { connectToChannel } from "./model/Channel";
import { Provider } from "./state/Context";
import Header from "./components/Header";
import { groupMessages } from "./util/MessageGrouping";

const initialState = {
  messages: [],
  members: [],
  outbox: [],
  user: { name: "", id: "" },
};

const channelName = "root";

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const channel = connectToChannel(
      channelName,
      process.env.REACT_APP_WS_ENDPOINT || "ws://localhost:3001"
    );
    channel.useDispatcher(dispatch);
    registerChannel(channel);
  }, []);

  const { messages, members, user, outbox } = state;

  const groupedMessages = groupMessages(messages);

  return (
    <Provider value={{ state, dispatch }}>
      <Header user={user} members={members} room={channelName} />
      <main>
        <Container>
          {groupedMessages.map((msg) => (
            <AnyMessage key={msg.id} draft={false} message={msg} />
          ))}
          {outbox.map((msg) => (
            <AnyMessage key={msg.id} draft={true} message={msg} />
          ))}
        </Container>
        <ChatEditor />
      </main>
      <footer>
        <a href="https://github.com/vegetabill/backchannel">backchannel</a>
      </footer>
    </Provider>
  );
}

export default App;
