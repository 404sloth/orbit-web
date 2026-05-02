import React from "react";
import { motion } from "framer-motion";
import { User, Bot, Target, Clock, Check, CheckCheck, Zap } from "lucide-react";
import { Message, MsgStatus } from "../../types";
import { AGENT_COLORS } from "../../utils/constants";
import { stripAgentLabel } from "../../utils/helpers";
import { RichText } from "../RichText/RichText";
import {
  messageIconWrap,
  messageSenderStyle,
  messageMetaStyle,
} from "../../styles/theme";

interface MessageItemProps {
  msg: Message;
  isLast?: boolean;
}

const StatusIcon = ({ status }: { status: MsgStatus }) => {
  if (status === "sending") return <Clock size={10} color="var(--text-tertiary)" />;
  if (status === "sent") return <Check size={11} color="var(--text-tertiary)" />;
  return <CheckCheck size={11} color="var(--brand-primary)" />;
};

const cleanMessageText = (text: string) => {
  let cleaned = text.replace(/<function=.*?>.*?<\/function>/sg, "");
  cleaned = cleaned.replace(/\[.*?\]\(https?:\/\/.*?\/reports\/download\/.*?\)/g, "");
  cleaned = cleaned.replace(/https?:\/\/.*?\/reports\/download\/[^\s)]+/g, "");
  cleaned = cleaned.replace(/🔗/g, "");
  cleaned = cleaned.replace(/<!--.*?-->/sg, "");
  cleaned = cleaned.replace(/🖼️ Image Visualization Ready/g, "");
  return cleaned.replace(/\n{3,}/g, "\n\n").trim();
};

export const MessageItem: React.FC<MessageItemProps> = ({ msg }) => {
  const isUser = msg.sender === "user";
  const isSystem = msg.sender === "system";

  const agentKey = (msg.metadata?.agent as string | undefined)
    ?? msg.agent?.replace(/\s+/g, "_")?.toLowerCase();
  const agentColor = AGENT_COLORS[agentKey ?? ""] ?? "var(--brand-primary)";

  const isGenericMessage =
    msg.text.includes("Task completed successfully") || msg.text.length < 10;
  const detailedData = msg.metadata?.data as Record<string, any> | undefined;

  const cleanedText = cleanMessageText(stripAgentLabel(msg.text));

  if (isSystem) {
    return (
      <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
        <div style={{ 
          background: "var(--bg-subtle)", color: "var(--text-tertiary)", 
          padding: "4px 12px", borderRadius: 4, fontSize: "11px", 
          fontWeight: 500,
          display: "flex", alignItems: "center", gap: 5
        }}>
          <Zap size={10} /> {msg.text}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 6,
        padding: "0 20px",
      }}
    >
      <div style={{ 
        maxWidth: "72%", 
        display: "flex", 
        flexDirection: isUser ? "row-reverse" : "row",
        gap: 10,
        alignItems: "flex-end",
      }}>
        {/* Avatar */}
        <div
          style={{
            width: 28, height: 28, borderRadius: "50%",
            background: isUser ? "var(--brand-primary)" : "var(--bg-subtle)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            border: isUser ? "none" : "1px solid var(--border-light)",
          }}
        >
          {isUser ? (
            <User size={13} color="#fff" />
          ) : (
            <Bot size={13} color="var(--text-secondary)" />
          )}
        </div>

        {/* Content column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: isUser ? "flex-end" : "flex-start" }}>
          {/* Sender line */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 2px" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-secondary)" }}>
              {isUser ? "You" : (msg.agent || "Orbit AI")}
            </span>
            <span style={{ fontSize: 10, color: "var(--text-tertiary)", fontWeight: 400 }}>
              {new Date(msg.ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" })}
            </span>
            {isUser && msg.status && <StatusIcon status={msg.status} />}
          </div>

          {/* Bubble */}
          <div
            style={{
              background: isUser ? "var(--bg-subtle)" : "var(--bg-card)",
              color: "var(--text-primary)",
              padding: "10px 14px",
              borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
              lineHeight: 1.6,
              fontSize: 14,
              fontWeight: 400,
              border: isUser ? "1px solid var(--border-light)" : "1px solid var(--border-light)",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            <RichText text={cleanedText} isUser={isUser} />

            {!isUser && !!msg.metadata?.reasoning && (
              <details style={{ marginTop: 10, borderTop: "1px solid var(--border-light)", paddingTop: 8 }}>
                <summary style={{ fontSize: 11, fontWeight: 500, color: "var(--brand-primary)", cursor: "pointer", listStyle: "none", display: "flex", alignItems: "center", gap: 5 }}>
                  <Clock size={11} /> Thinking Process
                </summary>
                <div style={{ marginTop: 6, fontSize: 12, color: "var(--text-secondary)", background: "var(--bg-subtle)", padding: 8, borderRadius: 4, border: "1px solid var(--border-light)" }}>
                  {msg.metadata.reasoning as string}
                </div>
              </details>
            )}

            {!isUser && !!msg.metadata?.agent_description && (
              <div
                style={{
                  marginTop: 10,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 8px",
                  background: "var(--bg-subtle)",
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-light)"
                }}
              >
                <Target size={11} color="var(--brand-primary)" />
                <span>{String((msg.metadata as any).agent_description ?? "Core")}</span>
                <span style={{ color: "var(--text-tertiary)" }}>·</span>
                <span>{String((msg.metadata as any).action_description ?? "Direct")}</span>
              </div>
            )}
          </div>

          {/* Data card */}
          {!!detailedData && !isGenericMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                marginTop: 6,
                width: "100%",
                background: "var(--bg-card)",
                borderRadius: 8,
                border: "1px solid var(--border-light)",
                padding: 12,
                boxShadow: "var(--shadow-xs)",
                display: "flex", alignItems: "center", gap: 10
              }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--brand-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Target size={16} color="var(--brand-primary)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Knowledge Set</div>
                <div style={{ fontSize: 11, color: "var(--text-tertiary)" }}>{Object.keys(detailedData).length} dimensions</div>
              </div>
              <button style={{ 
                padding: "5px 12px", borderRadius: 6, background: "var(--brand-primary)", 
                border: "none", color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer"
              }}>Inspect</button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};