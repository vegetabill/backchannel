import React from "react";
import Avatar from "./Avatar";
import { Spinner } from "reactstrap";
import { User } from "backchannel-common";
import { Container, Row, Col } from "reactstrap";
import { Channel } from "../model/Channel";

const Header: React.FunctionComponent<{
  user: User;
  members: Array<User>;
  channel: Channel;
}> = ({ user, members, channel }) => {
  return (
    <header>
      <Container>
        <Row>
          <Col>
            <h2>
              {user.name ? (
                <Avatar large user={user} />
              ) : (
                <Spinner color="info" />
              )}
              {user.name} / #{channel.id}
            </h2>
          </Col>

          {members.map((member) => (
            <Col key={member.id}>
              <Avatar user={member} />
            </Col>
          ))}
        </Row>
      </Container>
    </header>
  );
};

export default Header;
