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
} from "../../styles/theme";

interface MessageItemProps {
  msg: Message;
  isLast?: boolean;
}

const StatusIcon = ({ status }: { status: MsgStatus }) => {
  if (status === "sending") return <Clock size={10} color="#94a3b8" />;
  if (status === "sent") return <Check size={11} color="#94a3b8" />;
  return <CheckCheck size={11} color="#c5a572" />;
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
  const agentColor = AGENT_COLORS[agentKey ?? ""] ?? "#c5a572";

  const isGenericMessage =
    msg.text.includes("Task completed successfully") || msg.text.length < 10;
  const detailedData = msg.metadata?.data as Record<string, any> | undefined;

  const cleanedText = cleanMessageText(stripAgentLabel(msg.text));

  // ---------------- System message ----------------
  if (isSystem) {
    return (
      <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
        <div style={{ background: "rgba(197, 165, 114, 0.1)", color: "#1E2A38", padding: "6px 16px", borderRadius: "99px", fontSize: "12px", fontWeight: 700, border: "1px solid rgba(197, 165, 114, 0.2)" }}>
          {msg.text}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        gap: "16px",
        marginBottom: "32px",
        padding: "0 20px",
        alignItems: "flex-start",
      }}
    >
      {/* Icon Wrap */}
      <div
        style={messageIconWrap(isUser, agentColor)}
      >
        {isUser ? (
          <User size={18} color="#ffffff" />
        ) : (
          <Bot size={18} color="#ffffff" />
        )}
      </div>

      {/* Message Content */}
      <div
        style={{
          maxWidth: "75%",
          display: "flex",
          flexDirection: "column",
          alignItems: isUser ? "flex-end" : "flex-start",
        }}
      >
        {/* Sender Name & Meta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "6px",
            padding: "0 4px",
          }}
        >
          <span style={messageSenderStyle(isUser, agentColor)}>
            {isUser ? "" : (msg.agent || "")}
          </span>
          <span style={messageMetaStyle(isUser)}>
            {new Date(msg.ts).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Asia/Kolkata",
            })}
          </span>
          {isUser && msg.status && <StatusIcon status={msg.status} />}
        </div>

        {/* Text Bubble */}
        <div
          style={{
            background: "#ffffff",
            color: "#1E2A38",
            padding: "16px 20px",
            borderRadius: isUser ? "20px 4px 20px 20px" : "4px 20px 20px 20px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
            border: "1px solid #e2e8f0",
            lineHeight: "1.6",
            fontSize: "15px",
            position: "relative"
          }}
        >
          <RichText text={cleanedText} isUser={isUser} />

          {/* Reasoning / Thought Reveal */}
          {!isUser && !!msg.metadata?.reasoning && (
            <details style={{ marginTop: "12px", borderTop: "1px solid #f1f5f9", paddingTop: "8px" }}>
              <summary style={{ fontSize: "11px", fontWeight: 700, color: "#c5a572", cursor: "pointer", listStyle: "none", display: "flex", alignItems: "center", gap: "4px" }}>
                <Clock size={10} /> View Rationale
              </summary>
              <div style={{ marginTop: "8px", fontSize: "12px", color: "#5a6c7d", fontStyle: "italic", lineHeight: "1.5" }}>
                {msg.metadata.reasoning as string}
              </div>
            </details>
          )}

          {/* Action description - premium label */}
          {!isUser && !!msg.metadata?.agent_description && (
            <motion.div
              style={{
                marginTop: "16px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                background: "#fbf9f6",
                borderRadius: "6px",
                fontSize: "10px",
                fontWeight: 700,
                color: "#c5a572",
                border: "1px solid #e5e0d5"
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Target size={12} color="#c5a572" />
              <span style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>Strategic Vector:</span>
              <span style={{ color: "#1E2A38", fontWeight: 800 }}>
                {String(
                  (msg.metadata as any).agent_description ?? "Core"
                )}
                <span style={{ margin: "0 6px", color: "#e5e0d5" }}>/</span>
                {String(
                  (msg.metadata as any).action_description ?? "Direct"
                )}
              </span>
            </motion.div>
          )}
        </div>

        {/* Data Preview / Table Reveal */}
        {!!detailedData && !isGenericMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              marginTop: "12px",
              width: "100%",
              maxWidth: "100%",
              overflowX: "auto",
              background: "#ffffff",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              padding: "4px"
            }}
          >
             {/* Data Visualization Placeholder / Simplified View */}
             <div style={{ padding: "12px", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: 32, height: 32, borderRadius: "8px", background: "#fbf9f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <Target size={16} color="#c5a572" />
                </div>
                <div style={{ flex: 1 }}>
                   <div style={{ fontSize: "12px", fontWeight: 700, color: "#1E2A38" }}>Dataset Attached</div>
                   <div style={{ fontSize: "11px", color: "#5a6c7d" }}>{Object.keys(detailedData).length} dimension(s) analyzed</div>
                </div>
                <button style={{ padding: "6px 12px", borderRadius: "6px", background: "#fbf9f6", border: "1px solid #e5e0d5", color: "#1E2A38", fontSize: "11px", fontWeight: 700, cursor: "pointer" }}>Inspect</button>
             </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};