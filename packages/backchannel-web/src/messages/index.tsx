import React from "react";
import { Alert } from "reactstrap";
import Chat from "./Chat";
import { ProtocolMessage, MessageCategory } from "backchannel-common";

const Activity: React.FunctionComponent<{
  message: ProtocolMessage;
}> = ({ message }) => {
  const { category, actor, timestamp, payload } = message;
  switch (category) {
    case MessageCategory.JoinedChannel:
      return <Alert color="success">{actor.name} has joined.</Alert>;
    case MessageCategory.LeftChannel:
      return <Alert color="warning">{actor.name} left.</Alert>;
    case MessageCategory.SentChat:
      return <Chat sender={actor} body={payload} sentAt={timestamp} />;
    default:
      return (
        <Alert color="error">
          Unable to render {message.category} {message.id}
        </Alert>
      );
  }
};

export default Activity;
