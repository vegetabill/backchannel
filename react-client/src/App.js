import React, { useReducer, useEffect } from "react";
import reducer from "./reducers";
import { Container } from "reactstrap";
import "./App.css";
import Activity from "./messages/Activity";
import { connectToChannel } from "./channel";

const componentsForActionType = new Map([["ACTION", Activity]]);

const initialState = {
  actions: [],
  channel: null,
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    connectToChannel(
      "root",
      process.env.REACT_APP_WS_ENDPOINT || "ws://localhost:3001"
    ).useDispatcher(dispatch);
  }, []);

  const { actions, channel } = state;

  const children = actions.map((action) => {
    const Comp = componentsForActionType.get(action.type);
    return <Comp key={action.id} {...action.payload} />;
  });

  const subheading = () => {
    if (channel) {
      if (channel.members.length === 1) {
        return "You're alone in the channel. 😭";
      } else {
        return `${
          channel.members.length - 1
        } conspirators also in the channel.`;
      }
    }
  };

  return (
    <main>
      <h1>{channel ? channel.alias : "Not Yet Connected"}</h1>
      <h2>{subheading()}</h2>
      <Container>{children}</Container>
    </main>
  );
}

export default App;
