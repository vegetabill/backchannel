import React from "react";
import { Alert } from "reactstrap";
import { ProtocolMessage, MessageCategory } from "backchannel-common";

const Activity: React.FunctionComponent<{
  message: ProtocolMessage;
}> = ({ message }) => {
  const { category, actor } = message;
  if (category === MessageCategory.JoinedChannel) {
    return <Alert color="success">{actor.name} has joined.</Alert>;
  }
  if (category === MessageCategory.LeftChannel) {
    return <Alert color="warning">{actor.name} left.</Alert>;
  }
  return null;
};

export default Activity;
