import React, { useReducer, useEffect } from "react";
import reducer, { initialState } from "../state/Reducer";
import { Container } from "reactstrap";
import AnyMessage from "../components/messages/AnyMessage";
import ChatEditor from "../components/ChatEditor";
import { connectToChannel, ConnectionStatus } from "../model/Channel";
import { Provider } from "../state/Context";
import Header from "../components/Header";
import { groupMessages } from "../util/MessageGrouping";
import { useParams, useHistory } from "react-router-dom";
import Footer from "../components/Footer";

const isReadonly = (status: ConnectionStatus): boolean =>
  [ConnectionStatus.UnexpectedDisconnect, ConnectionStatus.Closed].includes(
    status
  );

function App() {
  const history = useHistory();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { channelId } = useParams();
  const { connectionStatus, messages, members, user, outbox, channel } = state;

  useEffect(() => connectToChannel(channelId, dispatch, history), [
    channelId,
    history,
  ]);

  const readOnly = isReadonly(connectionStatus);
  const groupedMessages = groupMessages(messages);

  return (
    <Provider value={{ state, dispatch }}>
      <Header
        user={user}
        connectionStatus={connectionStatus}
        members={members}
        channel={channel}
      />
      <main className={`channel ${readOnly ? "channel--readonly" : ""}`}>
        <Container>
          {groupedMessages.map((msg) => (
            <AnyMessage key={msg.id} draft={false} message={msg} />
          ))}
          {outbox.map((msg) => (
            <AnyMessage key={msg.id} draft={true} message={msg} />
          ))}
        </Container>
        <ChatEditor readOnly={readOnly} />
      </main>
      <Footer />
    </Provider>
  );
}

export default App;
