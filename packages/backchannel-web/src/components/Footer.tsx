import React, { ReactChild, ReactChildren } from "react";

const Footer: React.FunctionComponent<{
  children?: ReactChild | ReactChildren;
}> = ({ children }) => {
  return (
    <footer>
      <div className="footer">
        <section className="footerSection">
          open-source from <a href="https://29poms.com">29poms</a>
        </section>
        <section className="footerSection">
          <a
            title={`mention version: ${
              process.env.REACT_APP_VERSION || "Alpha"
            }`}
            href="https://github.com/vegetabill/backchannel/issues"
          >
            We{" "}
            <span role="img" aria-label="black heart">
              🖤
            </span>{" "}
            feedback.
          </a>
        </section>

        {children && (
          <section className="footerSection footerSection--secondary">
            {children}
          </section>
        )}
      </div>
    </footer>
  );
};

export default Footer;
