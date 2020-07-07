import React from "react";
import { md5 } from "../../util/StringUtils";

const GIPHY_REGEX = /\bhttps:\/\/media.giphy.com\/media\/\w+\/giphy\.gif\b/;

export function isMeme(content: string): boolean {
  return GIPHY_REGEX.test(content);
}

const ChatBody: React.FunctionComponent<{
  lines: Array<string>;
}> = ({ lines }) => {
  return (
    <p className="media-body__text">
      {lines.map((line) =>
        isMeme(line) ? (
          <img
            key={md5(line)}
            alt="animated gif"
            src={line}
            className="media-body__meme"
          />
        ) : (
          <span key={md5(line)} className="media-body__textLine">
            {line}
          </span>
        )
      )}
    </p>
  );
};

export default ChatBody;
