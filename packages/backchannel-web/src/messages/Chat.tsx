import React from "react";
import { Row, Media, Badge } from "reactstrap";
import Avatar from "../Avatar";
import strftime from "strftime";
import { User } from "backchannel-common";

const Chat: React.FunctionComponent<{
  sender: User,
  body: string,
  sentAt: Date,
}> = ({ sender, body, sentAt }) => {
  return (
    <Row>
      <Media>
        <Media left>
          <Avatar user={sender} />
        </Media>
        <Media body>
          <Media heading>
            {sender.name}{" "}
            <Badge color="secondary">
              {strftime("%H:%M:%S", new Date(sentAt))}
            </Badge>
          </Media>
          {body}
        </Media>
      </Media>
    </Row>
  );
};

export default Chat;
