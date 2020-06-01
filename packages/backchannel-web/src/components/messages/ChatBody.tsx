import React from "react";

const GIPHY_REGEX = /\bhttps:\/\/media.giphy.com\/media\/\w+\/source\.gif\b/;

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
          <img src={line} className="media-body__meme" />
        ) : (
          <span className="media-body__textLine">{line}</span>
        )
      )}
    </p>
  );
};

export default ChatBody;