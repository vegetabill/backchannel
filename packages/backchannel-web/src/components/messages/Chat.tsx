import React from "react";
import { Row, Media, Spinner, Col } from "reactstrap";
import Avatar from "../Avatar";
import strftime from "strftime";
import { User } from "backchannel-common";
import ChatBody from "./ChatBody";
const Chat: React.FunctionComponent<{
  sender: User;
  lines: Array<string>;
  sentAt: Date;
  draft: boolean;
}> = ({ sender, lines, sentAt, draft }) => {
  return (
    <Row>
      <Col>
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
            <ChatBody lines={lines} />
          </Media>
        </Media>
      </Col>
    </Row>
  );
};

export default Chat;
