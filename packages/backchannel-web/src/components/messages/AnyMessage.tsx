import React from "react";
import { Alert } from "reactstrap";
import Chat from "./Chat";
import MembershipChange, { ChangeType } from "./MembershipChange";
import { ProtocolMessage, MessageCategory } from "backchannel-common";
import {
  GroupedMessage,
  isGroupedMessage,
  GroupedCategory,
} from "../../util/MessageGrouping";

const Activity: React.FunctionComponent<{
  message: ProtocolMessage | GroupedMessage;
  draft: boolean;
}> = ({ message, draft }) => {
  if (isGroupedMessage(message)) {
    const { messages } = message;
    switch (message.category) {
      case GroupedCategory.MultiJoined:
        return (
          <MembershipChange
            members={messages.map((m) => m.actor)}
            type={ChangeType.Join}
          />
        );
      case GroupedCategory.MultiLeft:
        return (
          <MembershipChange
            members={messages.map((m) => m.actor)}
            type={ChangeType.Left}
          />
        );
      case GroupedCategory.MultiChatSent:
        const first = messages[0];
        return (
          <Chat
            sender={first.actor}
            lines={messages.map((m) => m.payload)}
            draft={draft}
            sentAt={first.timestamp}
          />
        );
    }
  } else {
    const { category, actor, timestamp, payload } = message;
    switch (category) {
      case MessageCategory.JoinedChannel:
        return <MembershipChange members={[actor]} type={ChangeType.Join} />;
      case MessageCategory.LeftChannel:
        return <MembershipChange members={[actor]} type={ChangeType.Left} />;
      case MessageCategory.SentChat:
        return (
          <Chat
            sender={actor}
            lines={[payload]}
            draft={draft}
            sentAt={timestamp}
          />
        );
    }
  }

  return (
    <Alert color="error">
      Unable to render {message.category} {message.id}
    </Alert>
  );
};

export default Activity;
