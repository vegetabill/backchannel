import React from "react";
import { Alert } from "reactstrap";
import Chat from "./Chat";
import MembershipChange, { ChangeType } from "./MembershipChange";
import { ProtocolMessage, MessageCategory } from "backchannel-common";

const Activity: React.FunctionComponent<{
  message: ProtocolMessage;
  draft: boolean;
}> = ({ message, draft }) => {
  const { category, actor, timestamp, payload } = message;
  switch (category) {
    case MessageCategory.JoinedChannel:
      return <MembershipChange members={[actor]} type={ChangeType.Join} />;
    case MessageCategory.LeftChannel:
      return <MembershipChange members={[actor]} type={ChangeType.Left} />;
    case MessageCategory.SentChat:
      return (
        <Chat sender={actor} body={payload} draft={draft} sentAt={timestamp} />
      );
    default:
      return (
        <Alert color="error">
          Unable to render {message.category} {message.id}
        </Alert>
      );
  }
};

export default Activity;
