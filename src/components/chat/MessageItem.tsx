import React from "react";
import { motion } from "framer-motion";
import { User, Bot, Target, Clock, Check, CheckCheck } from "lucide-react";
import { Message, MsgStatus } from "../../types";
import { AGENT_COLORS } from "../../utils/constants";
import { stripAgentLabel } from "../../utils/helpers";
import { RichText } from "../RichText/RichText";
import {
  messageIconWrap,
  messageSenderStyle,
  messageMetaStyle,
  dataPreviewStyle,
} from "../../styles/theme";

interface MessageItemProps {
  msg: Message;
}

const StatusIcon = ({ status }: { status: MsgStatus }) => {
  if (status === "sending") return <Clock size={10} color="#94a3b8" />;
  if (status === "sent") return <Check size={11} color="#94a3b8" />;
  return <CheckCheck size={11} color="#818cf8" />;
};

const cleanMessageText = (text: string) => {
  // Remove technical report download links and visual artefacts
  let cleaned = text.replace(/\[.*?\]\(https?:\/\/.*?\/reports\/download\/.*?\)/g, "");
  cleaned = cleaned.replace(/https?:\/\/.*?\/reports\/download\/[^\s)]+/g, "");
  cleaned = cleaned.replace(/🔗/g, "");
  cleaned = cleaned.replace(/<!--.*?-->/sg, "");
  cleaned = cleaned.replace(/🖼️ Image Visualization Ready/g, "");
  return cleaned.replace(/\n{3,}/g, "\n\n").trim();
};

export const MessageItem: React.FC<MessageItemProps> = ({ msg }) => {
  const isUser = msg.sender === "user";
  const isSystem = msg.sender === "system";

  // Safe extraction of agent key for colour mapping
  const agentKey = (msg.metadata?.agent as string | undefined)
    ?? msg.agent?.replace(/\s+/g, "_")?.toLowerCase();
  const agentColor = AGENT_COLORS[agentKey ?? ""] ?? "#818cf8";

  const isGenericMessage =
    msg.text.includes("Task completed successfully") || msg.text.length < 10;
  const detailedData = msg.metadata?.data as Record<string, any> | undefined;

  const cleanedText = cleanMessageText(stripAgentLabel(msg.text));

  // ---------------- System message ----------------
  if (isSystem) {
    return (
      <div style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: "#f1f3f4",
            borderRadius: 40,
            padding: "6px 22px",
            fontSize: 10,
            fontWeight: 700,
            color: "#5f6368",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            border: "1px solid #e0e4e9"
          }}
        >
          {msg.text}
        </motion.div>
      </div>
    );
  }

  // ---------------- User / Agent message ----------------
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", damping: 30, stiffness: 200 }}
      className={`message-row ${isUser ? "user" : "agent"}`}
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-start",
        gap: 14,
        margin: "24px 0",
        padding: "0 4px",
      }}
    >
      {/* Avatar */}
      <motion.div
        className={`message-avatar ${isUser ? "user" : "agent"}`}
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isUser
            ? "#dbeafe"
            : "#ffffff",
          border: `1px solid ${isUser ? "#bfdbfe" : "#e0e4e9"}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          flexShrink: 0,
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        {isUser ? <User size={20} color="#1d4ed8" /> : <Bot size={20} color="#4f46e5" />}
      </motion.div>

      {/* Message body */}
      <div
        className="message-container"
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "75%",
          minWidth: 0,
        }}
      >
        {/* Sender name */}
        <div
          className="message-sender"
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.05em",
            color: isUser ? "#64748b" : "#4f46e5",
            textTransform: "uppercase",
            marginBottom: 4,
            marginLeft: isUser ? 0 : 8,
            marginRight: isUser ? 8 : 0,
          }}
        >
          {isUser ? "Authorized Operator" : (msg.agent ?? "Intel Engine")}
        </div>

        {/* Bubble */}
        <motion.div
          className={`message-bubble ${isUser ? "user" : "agent"}`}
          style={{
            borderRadius: isUser ? "20px 4px 20px 20px" : "4px 20px 20px 20px",
            padding: "18px 22px",
            background: isUser
              ? "#eef2ff"
              : "#ffffff",
            color: "#1e293b",
            border: `1px solid ${isUser ? "#e0e7ff" : "#e2e8f0"}`,
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02)",
            wordBreak: "break-word",
            fontSize: "15px",
            lineHeight: "1.65",
            position: "relative",
          }}
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.05 }}
        >
          {cleanedText ? (
            <RichText text={cleanedText} isUser={isUser} />
          ) : (
            <div style={{ fontStyle: "italic", color: "#94a3b8", fontSize: "14px" }}>
              Generating insights...
            </div>
          )}

          {/* Data preview (for generic short messages with payload) */}
          {isGenericMessage &&
            detailedData &&
            Object.keys(detailedData).length > 0 && (
              <motion.div
                className="data-preview"
                style={{
                  marginTop: 18,
                  background: "#f8fafc",
                  borderRadius: "14px",
                  padding: "16px",
                  border: "1px solid #e2e8f0",
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    marginBottom: 10,
                    fontSize: "10px",
                    color: "#4f46e5",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <div style={{ width: "4px", height: "4px", borderRadius: "99px", background: "currentColor" }} />
                  Intelligence Payload
                </div>
                <pre
                  style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontSize: "12px",
                    color: "#475569",
                    fontFamily: "'JetBrains Mono', monospace",
                    lineHeight: "1.5"
                  }}
                >
                  {JSON.stringify(detailedData, null, 2)}
                </pre>
              </motion.div>
            )}

          {/* Agent routing info */}
          {!isUser &&
            msg.metadata &&
            ((msg.metadata as any).agent_description ||
              (msg.metadata as any).action_description) && (
              <motion.div
                className="strategic-vector"
                style={{
                  marginTop: 18,
                  background: "#f8fafc",
                  borderRadius: "10px",
                  padding: "8px 14px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "10px",
                  fontWeight: 700,
                  color: "#64748b",
                  border: "1px solid #f1f5f9"
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Target size={12} color="#4f46e5" />
                <span style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Strategic Vector:</span>
                <span style={{ color: "#334155", fontWeight: 800 }}>
                  {String(
                    (msg.metadata as any).agent_description ?? "Core"
                  )}
                  <span style={{ margin: "0 6px", color: "#cbd5e1" }}>/</span>
                  {String(
                    (msg.metadata as any).action_description ?? "Direct"
                  )}
                </span>
              </motion.div>
            )}
        </motion.div>

        {/* Timestamp & status */}
        <div
          className="message-meta"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: isUser ? "flex-end" : "flex-start",
            gap: 8,
            marginTop: 4,
            fontSize: 9,
            fontWeight: 600,
            color: "#64748b",
            textTransform: "uppercase",
            padding: "0 4px",
          }}
        >
          {new Date(msg.ts).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {isUser && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <StatusIcon status={msg.status ?? "delivered"} />
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  );
};