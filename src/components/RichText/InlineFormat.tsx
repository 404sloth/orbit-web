import React, { ReactNode } from "react";

interface InlineFormatProps {
  text: string;
  isUser: boolean;
}

export const InlineFormat: React.FC<InlineFormatProps> = ({ text }) => {
  const parts: ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|"([^"]+)")/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null = regex.exec(text);

  while (match) {
    if (match.index > lastIndex) {
      parts.push(<span key={`txt-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>);
    }
    if (match[2] !== undefined) {
      parts.push(
        <strong key={`b-${match.index}`} style={{ fontWeight: 700 }}>
          {match[2]}
        </strong>,
      );
    } else if (match[3] !== undefined) {
      parts.push(
        <em key={`i-${match.index}`} style={{ fontStyle: "italic" }}>
          {match[3]}
        </em>,
      );
    } else if (match[4] !== undefined) {
      parts.push(
        <code key={`c-${match.index}`} className="md-inline-code">
          {match[4]}
        </code>,
      );
    } else if (match[5] !== undefined) {
      parts.push(
        <span key={`q-${match.index}`} className="md-quote-inline">
          “{match[5]}”
        </span>,
      );
    }
    lastIndex = match.index + match[0].length;
    match = regex.exec(text);
  }
  if (lastIndex < text.length) {
    parts.push(<span key={`tail-${lastIndex}`}>{text.slice(lastIndex)}</span>);
  }
  return <>{parts.length ? parts : text}</>;
};
