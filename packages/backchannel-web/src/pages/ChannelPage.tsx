import React, { useReducer, useEffect } from "react";
import reducer, { initialState } from "../state/Reducer";
import { Container } from "reactstrap";
import AnyMessage from "../components/messages/AnyMessage";
import ChatEditor from "../components/ChatEditor";
import { connectToChannel, notFoundChannel } from "../model/Channel";
import { Provider } from "../state/Context";
import Header from "../components/Header";
import { groupMessages } from "../util/MessageGrouping";
import { useParams, Redirect } from "react-router-dom";
import routes from "../Routes";

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { channelId } = useParams();
  const { messages, members, user, outbox, channel } = state;

  useEffect(() => connectToChannel(channelId, dispatch), [channelId]);

  if (channel === notFoundChannel) {
    return <Redirect to={routes.NOT_FOUND.build()} />;
  }

  const groupedMessages = groupMessages(messages);

  return (
    <Provider value={{ state, dispatch }}>
      <Header user={user} members={members} channel={channel} />
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
