import React from "react";
import { Link } from "react-router-dom";
import Routes from "../Routes";
import Footer from "../components/Footer";

function HomePage() {
  return (
    <>
      <header>
        <div style={{ padding: "0.75rem 1.5rem" }}>
          <h1 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.01em" }}>
            backchannel
          </h1>
        </div>
      </header>
      <main className="landing">
        <div className="hero">
          <span className="hero__eyebrow">Anonymous &amp; Ephemeral</span>
          <h2 className="hero__title">
            Keep your team's side conversations private.
          </h2>
          <p className="hero__subtitle">
            Start a channel for your next meeting and exchange memes, reactions,
            and commentary — securely. Randomly assigned identities protect you
            even if someone takes a screenshot.
          </p>
          <p className="hero__fine-print">
            Stop using company Slack for unofficial banter.{" "}
            <a href="https://nypost.com/2018/03/22/slack-will-allow-employers-to-read-your-private-messages/">
              Slack admins can read your DMs.
            </a>
          </p>
          <Link className="hero__cta" to={Routes.CREATE_CHANNEL.build()}>
            Create a Channel →
          </Link>
        </div>
      </main>
      <Footer>
        <>
          Photo by{" "}
          <a href="https://unsplash.com/@kate_sade?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
            kate.sade
          </a>{" "}
          on{" "}
          <a href="https://unsplash.com/s/photos/office?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
            Unsplash
          </a>
        </>
      </Footer>
      <small id="applicationVersion">
        backchannel-web version: {process.env.REACT_APP_VERSION || "latest"}
      </small>
    </>
  );
}

export default HomePage;
