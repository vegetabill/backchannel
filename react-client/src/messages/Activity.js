import React from "react";
import { Alert } from "reactstrap";

const Joined = ({ actor }) => {
  return <Alert color="success">{actor.name} has joined.</Alert>;
};

const Left = ({ actor }) => {
  return <Alert color="warning">{actor.name} left.</Alert>;
};

function Activity({ action, actor }) {
  if (action === "JOIN_CHANNEL") {
    return <Joined actor={actor} />;
  }
  if (action === "LEFT_CHANNEL") {
    return <Left actor={actor} />;
  }
}

export default Activity;
