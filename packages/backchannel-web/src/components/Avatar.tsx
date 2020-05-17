import React from "react";
import { User } from "backchannel-common";
import { Avatar as Avataaar } from "react-avataaars";

const Avatar: React.FunctionComponent<{
  user: User;
  large?: boolean;
}> = ({ user, large = false }) => {
  const classes = ["avatar", `avatar--${large ? "large" : "small"}`];
  return <Avataaar className={classes.join(" ")} hash={user.id} />;
};

export default Avatar;
