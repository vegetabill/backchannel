import React from "react";
import { Alert } from "reactstrap";
import Chat from "./Chat";
import { ProtocolMessage, MessageCategory, User } from "backchannel-common";

export interface Channel {
  id: string;
  name?: string;
  createdAt: Date;
  expirationDate: Date;
  connections: Map<User, WebSocket>;
}

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
