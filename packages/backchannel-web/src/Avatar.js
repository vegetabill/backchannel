import React from "react";
import { Avatar as Avataaar } from "react-avataaars";

const options = {
  // clothes: "sweater",
  // eyebrow: "angry",
  // style: "circle",
};

const Avatar = ({ user }) => {
  if (user.system) {
    return (
      <img alt="System User" className="avatar" src="/system-avatar.jpg" />
    );
  }

  return (
    <Avataaar
      className="avatar"
      hash={user.id}
      style={{ width: "100px", height: "100px" }}
      options={options}
    />
  );
};

export default Avatar;
