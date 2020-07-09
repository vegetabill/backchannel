import React from "react";
import { Link } from "react-router-dom";
import img404 from "../assets/randy-laybourne-uXJ1dgzYeRA-unsplash.jpg";
import Footer from "../components/Footer";

function NotFoundPage() {
  return (
    <>
      <header>
        <h1>404 Not Found</h1>
        <h2>
          Return to <Link to="/">Backchannel Home</Link>
        </h2>
      </header>
      <main>
        <img src={img404} alt="lost dog" />
      </main>
      <Footer>
        <>
          Photo by{" "}
          <a href="https://unsplash.com/@randylaybourne?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
            Randy Laybourne
          </a>{" "}
          on{" "}
          <a href="https://unsplash.com/s/photos/lost?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
            Unsplash
          </a>
        </>
      </Footer>
    </>
  );
}

export default NotFoundPage;
