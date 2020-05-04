import React from "react";
import { Alert } from "reactstrap";

const Joined = ({ actor }) => {
  return <Alert color="success">{actor.name} has joined.</Alert>;
};

const Left = ({ actor }) => {
  return <Alert color="warning">{actor.name} left.</Alert>;
};

function Activity({ action, actor }) {
  if (action === "user.joined") {
    return <Joined actor={actor} />;
  }
  if (action === "user.left") {
    return <Left actor={actor} />;
  }
}

export default Activity;
