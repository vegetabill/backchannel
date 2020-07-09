import React from "react";
import { Link } from "react-router-dom";
import { Jumbotron } from "reactstrap";
import Routes from "../Routes";
import Footer from "../components/Footer";

function HomePage() {
  return (
    <>
      <header>
        <h1>Backchannel</h1>
        <h2>Anonymous, emphemeral chat.</h2>
      </header>
      <main className="landing">
        <Jumbotron>
          <h1 className="display-3">
            Keep your team's watercooler conversations private.
          </h1>
          <h2>Stop using company Slack for unofficial banter.</h2>
          <p className="lead">
            Start a new channel for your next Zoom meeting and exchange memes
            and comment on company announcements, securely and privately.
            Randomly assigned identities means you are protected in the event of
            screenshots by confederates.
          </p>
          <p>
            Read more about{" "}
            <a href="https://nypost.com/2018/03/22/slack-will-allow-employers-to-read-your-private-messages/">
              Slack admin abilities
            </a>{" "}
            that undermine privacy.
          </p>
          <form>
            <Link
              className="btn btn-primary btn-lg"
              to={Routes.CREATE_CHANNEL.build()}
            >
              Create a Channel
            </Link>
          </form>
        </Jumbotron>
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
    </>
  );
}

export default HomePage;
