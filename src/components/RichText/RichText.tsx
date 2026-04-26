// src/components/RichText/RichText.tsx
import React, { ReactNode, useEffect, useMemo } from "react";

interface RichTextProps {
  text: string;
  isUser: boolean;
}

// ===================== INLINE FORMAT (merged + links) =====================
const InlineFormat: React.FC<{ text: string }> = ({ text }) => {
  const nodes: ReactNode[] = [];

  // Updated regex: capture **bold**, *italic*, `code`, "quotes", [text](url), raw URLs
  const regex =
    /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|"([^"]+)"|\[([^\]]+)\]\(([^)]+)\)|(?:(https?:\/\/|www\.)[^\s]+))/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // plain text before match
    if (match.index > lastIndex) {
      nodes.push(
        <span key={`t-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>
      );
    }

    // **bold**
    if (match[2] !== undefined) {
      nodes.push(
        <strong key={`b-${match.index}`} className="md-bold">
          {match[2]}
        </strong>
      );
    }
    // *italic*
    else if (match[3] !== undefined) {
      nodes.push(
        <em key={`i-${match.index}`} className="md-italic">
          {match[3]}
        </em>
      );
    }
    // `code`
    else if (match[4] !== undefined) {
      nodes.push(
        <code key={`c-${match.index}`} className="md-inline-code">
          {match[4]}
        </code>
      );
    }
    // "quote"
    else if (match[5] !== undefined) {
      nodes.push(
        <span key={`q-${match.index}`} className="md-inline-quote">
          “{match[5]}”
        </span>
      );
    }
    // [text](url)
    else if (match[6] !== undefined && match[7] !== undefined) {
      const href = match[7].startsWith("http") ? match[7] : `http://${match[7]}`;
      nodes.push(
        <a
          key={`a-${match.index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="md-link"
        >
          {match[6]}
        </a>
      );
    }
    // raw URL (http:// or www.)
    else if (match[8] !== undefined) {
      const raw = match[0];
      const href = raw.startsWith("www.") ? `http://${raw}` : raw;
      nodes.push(
        <a
          key={`url-${match.index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="md-link"
        >
          {raw}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // remaining text
  if (lastIndex < text.length) {
    nodes.push(<span key={`tail-${lastIndex}`}>{text.slice(lastIndex)}</span>);
  }

  return <>{nodes.length ? nodes : text}</>;
};

// ===================== PREMIUM CSS (injected once) =====================
let stylesInjected = false;
const injectStyles = () => {
  if (stylesInjected || typeof document === "undefined") return;
  const style = document.createElement("style");
  style.textContent = `
    /* ----- Rich Text Premium Core ----- */
    .md-content {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      line-height: 1.7;
      color: #3c4043;
    }
    /* Headings */
    .md-content h2, .md-content h3, .md-content h4 {
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #202124;
      margin: 1.2em 0 0.6em;
      border-bottom: 1px solid #f1f3f4;
      padding-bottom: 0.4em;
    }
    /* Bold & Italic */
    .md-bold { font-weight: 700; color: #202124; }
    .md-italic { font-style: italic; }
    /* Inline Code */
    .md-inline-code {
      background: #f1f3f4;
      color: #1a73e8;
      padding: 2px 6px;
      border-radius: 6px;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      font-size: 0.92em;
    }
    /* Code Blocks */
    .md-code-block {
      background: #f8f9fa;
      border: 1px solid #e0e4e9;
      border-radius: 12px;
      padding: 16px;
      overflow-x: auto;
      margin: 1em 0;
      font-size: 0.85em;
      line-height: 1.6;
    }
    .md-code-block code {
      background: none;
      padding: 0;
      color: #3c4043;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
    }
    /* Blockquotes */
    .md-quote {
      border-left: 4px solid #1a73e8;
      padding: 0.6em 1em;
      margin: 1em 0;
      background: #f8f9fa;
      border-radius: 0 12px 12px 0;
      color: #5f6368;
      font-style: italic;
    }
    .md-quote p { margin: 0; }
    /* Inline Quote */
    .md-inline-quote {
      color: #1a73e8;
      font-style: italic;
    }
    /* Lists */
    .md-list {
      padding-left: 1.6em;
      margin: 0.5em 0;
    }
    .md-list li {
      margin-bottom: 0.3em;
      line-height: 1.6;
    }
    .md-list li::marker {
      color: #1a73e8;
    }
    /* Tables */
    .md-table-wrapper {
      overflow-x: auto;
      margin: 1em 0;
    }
    .md-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      border: 1px solid #e0e4e9;
      border-radius: 12px;
      overflow: hidden;
      font-size: 0.9em;
    }
    .md-table th,
    .md-table td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #f1f3f4;
    }
    .md-table th {
      background: #f8f9fa;
      font-weight: 700;
      color: #1a73e8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .md-table tr:last-child td { border-bottom: none; }
    /* Horizontal Rule */
    .md-hr {
      border: none;
      height: 1px;
      background: #f1f3f4;
      margin: 1.5em 0;
    }
    /* Links (markdown + raw) */
    .md-link {
      color: #1a73e8;
      text-decoration: none;
      border-bottom: 1px dotted #1a73e8;
      transition: all 0.2s;
    }
    .md-link:hover {
      color: #174ea6;
      border-bottom-color: #174ea6;
    }
    /* Paragraphs (default) */
    .md-content p {
      margin: 0.6em 0;
    }
    /* Spacer for empty lines */
    .md-spacer {
      height: 12px;
    }
  `;
  document.head.appendChild(style);
  stylesInjected = true;
};

// ===================== MAIN COMPONENT =====================
export const RichText: React.FC<RichTextProps> = ({ text, isUser }) => {
  useEffect(() => { injectStyles(); }, []);

  const blocks = useMemo<ReactNode[]>(() => {
    if (!text) return [];
    const lines = text.split("\n");
    const result: ReactNode[] = [];
    let listItems: string[] = [];
    let ordered = false;
    let inCodeBlock = false;
    let codeLines: string[] = [];
    let tableLines: string[] = [];

    const flushList = () => {
      if (!listItems.length) return;
      const Tag = ordered ? "ol" : "ul";
      result.push(
        <Tag key={`list-${result.length}`} className="md-list">
          {listItems.map((item, i) => (
            <li key={`${i}`}>
              <InlineFormat text={item} />
            </li>
          ))}
        </Tag>
      );
      listItems = [];
      ordered = false;
    };

    const flushCode = () => {
      if (!codeLines.length) return;
      result.push(
        <pre key={`code-${result.length}`} className="md-code-block">
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      codeLines = [];
    };

    const flushTable = () => {
      if (!tableLines.length) return;
      const rows = tableLines.map((line) =>
        line
          .split(/(?<!\\)\|/)
          .map((cell) => cell.trim().replace(/\\\|/g, "|"))
          .filter(Boolean)
      );
      // remove separator row
      const bodyRows = rows.filter(
        (row, idx) => !(idx === 1 && row.every((cell) => /^:?-{3,}:?$/.test(cell)))
      );
      if (!bodyRows.length) {
        tableLines = [];
        return;
      }
      const header = bodyRows[0];
      const rest = bodyRows.slice(1);
      result.push(
        <div key={`table-${result.length}`} className="md-table-wrapper">
          <table className="md-table">
            <thead>
              <tr>
                {header.map((cell, i) => (
                  <th key={`h${i}`}>
                    <InlineFormat text={cell} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rest.map((row, ri) => (
                <tr key={`r${ri}`}>
                  {row.map((cell, ci) => (
                    <td key={`c${ci}`}>
                      <InlineFormat text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableLines = [];
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // code block fencing
      if (trimmed.startsWith("```")) {
        flushList();
        flushTable();
        if (inCodeBlock) {
          flushCode();
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }

      // table row detection
      const isTableRow = trimmed.includes("|") && (
        (trimmed.startsWith("|") && trimmed.endsWith("|")) ||
        (i + 1 < lines.length && lines[i+1].trim().match(/^\|?(:?-{3,}:?\|?)+$/)) || // check if next line is separator
        (i > 0 && lines[i-1].trim().match(/^\|?(:?-{3,}:?\|?)+$/)) // check if prev line is separator
      );

      if (isTableRow) {
        flushList();
        tableLines.push(line);
        continue;
      }
      flushTable();

      // horizontal rule
      if (/^[-*_]{3,}$/.test(trimmed)) {
        flushList();
        result.push(<hr key={`hr-${i}`} className="md-hr" />);
        continue;
      }

      // blockquote
      if (trimmed.startsWith(">")) {
        flushList();
        const content = trimmed.slice(1).trim();
        result.push(
          <blockquote key={`q-${i}`} className="md-quote">
            <InlineFormat text={content} />
          </blockquote>
        );
        continue;
      }

      // unordered list
      const ulMatch = trimmed.match(/^[-*]\s+(.+)/);
      // ordered list
      const olMatch = trimmed.match(/^\d+[.)]\s+(.+)/);
      if (ulMatch) {
        if (ordered) flushList();
        listItems.push(ulMatch[1]);
        continue;
      }
      if (olMatch) {
        if (!ordered && listItems.length) flushList();
        ordered = true;
        listItems.push(olMatch[1]);
        continue;
      }
      flushList();

      // headings
      if (trimmed.startsWith("# ")) {
        result.push(
          <h2 key={`h1-${i}`} className="md-h1">
            <InlineFormat text={trimmed.slice(2)} />
          </h2>
        );
        continue;
      }
      if (trimmed.startsWith("## ")) {
        result.push(
          <h3 key={`h2-${i}`} className="md-h2">
            <InlineFormat text={trimmed.slice(3)} />
          </h3>
        );
        continue;
      }
      if (trimmed.startsWith("### ")) {
        result.push(
          <h4 key={`h3-${i}`} className="md-h3">
            <InlineFormat text={trimmed.slice(4)} />
          </h4>
        );
        continue;
      }

      // empty line -> spacer
      if (!trimmed) {
        result.push(
          <div key={`spacer-${i}`} className="md-spacer" />
        );
        continue;
      }

      // default paragraph
      result.push(
        <p key={`p-${i}`}>
          <InlineFormat text={line} />
        </p>
      );
    }

    // flush any remaining state
    flushList();
    flushTable();
    // code block was left open? flush it as well (unclosed fence)
    if (inCodeBlock && codeLines.length) flushCode();

    return result;
  }, [text]);

  return <div className="md-content">{blocks}</div>;
};