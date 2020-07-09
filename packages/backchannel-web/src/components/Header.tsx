import React from "react";
import Avatar from "./Avatar";
import { Spinner } from "reactstrap";
import { User } from "backchannel-common";
import { Container, Row, Col } from "reactstrap";
import { Channel, ConnectionStatus } from "../model/Channel";
import { Link } from "react-router-dom";
import routes from "../Routes";

const DisconnectedHeader = () => (
  <header className="header--disconnected">
    <Container>
      <Row>
        <Col>
          <h2>
            <span role="img" aria-label="no entry sign">
              ⛔
            </span>{" "}
            Connection Lost
          </h2>
          <a href="#reload" onClick={() => window.location.reload()}>
            Retry Connection
          </a>
        </Col>
      </Row>
    </Container>
  </header>
);

const ClosedHeader: React.FunctionComponent<{ user: User }> = ({ user }) => (
  <header className="header--disconnected">
    <Container>
      <Row>
        <Col>
          <h2>
            {user.name ? <Avatar large user={user} /> : null}
            {user.name}
          </h2>
        </Col>

        <Col>
          <h3>Channel has closed.</h3>
          <Link to={routes.ROOT.build()}>Return home.</Link>
        </Col>
      </Row>
    </Container>
  </header>
);

const ExpiringHeader: React.FunctionComponent<{ user: User }> = ({ user }) => (
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
            {user.name}
          </h2>
        </Col>

        <Col>
          <h3>⏱ Channel is expiring soon.</h3>
        </Col>
      </Row>
    </Container>
  </header>
);

const Header: React.FunctionComponent<{
  user: User;
  members: Array<User>;
  channel: Channel;
  connectionStatus: ConnectionStatus;
}> = ({ user, members, channel, connectionStatus }) => {
  switch (connectionStatus) {
    case ConnectionStatus.Closed:
      return <ClosedHeader user={user} />;
    case ConnectionStatus.UnexpectedDisconnect:
      return <DisconnectedHeader />;
    case ConnectionStatus.Expiring:
      return <ExpiringHeader user={user} />;
    default:
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
                  {user.name}
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
  }
};

export default Header;
