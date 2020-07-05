import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { ReactComponent as Spinner } from "../assets/loader.svg";
import { createChannel } from "../util/rest-api-client";
import Routes from "../routes";

function CreateChannelPage() {
  const [channelId, setChannelId] = useState("");

  useEffect(() => {
    createChannel().then((channel) => {
      setChannelId(channel.channelId);
    });
  }, []);

  return (
    <>
      <header>
        <h1>New Channel</h1>
      </header>
      <main>
        {channelId ? (
          <Redirect to={Routes.JOIN_CHANNEL.build(channelId)} />
        ) : (
          <Spinner />
        )}
      </main>
    </>
  );
}

export default CreateChannelPage;
