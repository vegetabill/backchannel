import React from "react";
import { Row, Media, Spinner } from "reactstrap";
import Avatar from "../Avatar";
import strftime from "strftime";
import { User } from "backchannel-common";

const Chat: React.FunctionComponent<{
  sender: User;
  body: string;
  sentAt: Date;
  draft: boolean;
}> = ({ sender, body, sentAt, draft }) => {
  return (
    <Row>
      <Media>
        <Media left>
          {draft ? <Spinner color="success" /> : <Avatar user={sender} />}
        </Media>
        <Media body className={draft ? "outgoingMessage" : undefined}>
          <Media heading>
            {sender.name}{" "}
            <span className="chatTimestamp" color="secondary">
              {draft ? "sending..." : strftime("%H:%M:%S", new Date(sentAt))}
            </span>
          </Media>
          <p className="media-body__text">{body}</p>
        </Media>
      </Media>
    </Row>
  );
};

export default Chat;
