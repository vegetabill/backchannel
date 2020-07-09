import React from "react";
import { Alert } from "reactstrap";

const ChannelExpirationWarning: React.FunctionComponent<{
  notice: string;
}> = ({ notice }) => {
  return <Alert color="warning">{notice}</Alert>;
};

export default ChannelExpirationWarning;
