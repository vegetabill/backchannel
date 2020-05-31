import React from "react";
import { User } from "backchannel-common";
import { toSentence } from "../../util/StringUtils";

export enum ChangeType {
  Join = "joined",
  Left = "left",
}

const MembershipChange: React.FunctionComponent<{
  members: Array<User>;
  type: ChangeType;
}> = ({ members, type }) => {
  const names = members.map((m) => m.name);
  const msg = `${toSentence(names)} ${
    members.length > 1 ? "have" : "has"
  } ${type}.`;
  return (
    <div className={`membershipChange membershipChange--${type}`}>{msg}</div>
  );
};

export default MembershipChange;
