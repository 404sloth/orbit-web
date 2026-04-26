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
      <div style={{ display: "flex", justifyContent: "center", margin: "24px 0" }}>
        <div style={{ 
          background: "var(--brand-light)", color: "var(--brand-primary)", 
          padding: "8px 20px", borderRadius: "99px", fontSize: "12px", 
          fontWeight: 800, border: "1px solid rgba(109, 40, 217, 0.1)",
          boxShadow: "0 4px 12px rgba(109, 40, 217, 0.05)",
          display: "flex", alignItems: "center", gap: 8
        }}>
          <Zap size={12} /> {msg.text}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      style={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        gap: "20px",
        marginBottom: "36px",
        padding: "0 20px",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          ...messageIconWrap(isUser, agentColor),
          width: 44, height: 44, borderRadius: 16,
          boxShadow: isUser ? "0 8px 20px rgba(109, 40, 217, 0.25)" : `0 8px 20px rgba(0,0,0,0.1)`
        }}
      >
        {isUser ? (
          <User size={20} color="#ffffff" />
        ) : (
          <Bot size={20} color="#ffffff" />
        )}
      </div>

      <div
        style={{
          maxWidth: "78%",
          display: "flex",
          flexDirection: "column",
          alignItems: isUser ? "flex-end" : "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "8px",
            padding: "0 4px",
          }}
        >
          <span style={{ 
            ...messageSenderStyle(isUser, agentColor), 
            fontWeight: 900, fontSize: "11px", letterSpacing: "0.05em" 
          }}>
            {isUser ? "Authorized User" : (msg.agent || "Orbit AI")}
          </span>
          <span style={{ ...messageMetaStyle(isUser), fontSize: "11px", fontWeight: 600 }}>
            {new Date(msg.ts).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Asia/Kolkata",
            })}
          </span>
          {isUser && msg.status && <StatusIcon status={msg.status} />}
        </div>

        <div
          style={{
            background: isUser ? "var(--bg-bubble-user)" : "#ffffff",
            color: "var(--text-primary)",
            padding: "18px 24px",
            borderRadius: isUser ? "24px 4px 24px 24px" : "4px 24px 24px 24px",
            boxShadow: "0 4px 25px rgba(0,0,0,0.03)",
            border: `1px solid ${isUser ? "rgba(124, 58, 237, 0.15)" : "var(--border-light)"}`,
            lineHeight: "1.7",
            fontSize: "15.5px",
            position: "relative",
            fontWeight: 500
          }}
        >
          <RichText text={cleanedText} isUser={isUser} />

          {!isUser && !!msg.metadata?.reasoning && (
            <details style={{ marginTop: "16px", borderTop: "1px solid var(--border-light)", paddingTop: "12px" }}>
              <summary style={{ fontSize: "11px", fontWeight: 800, color: "var(--brand-primary)", cursor: "pointer", listStyle: "none", display: "flex", alignItems: "center", gap: "6px" }}>
                <Clock size={12} /> Strategic Rationale
              </summary>
              <div style={{ marginTop: "10px", fontSize: "13px", color: "var(--text-secondary)", fontStyle: "italic", lineHeight: "1.6", background: "var(--bg-main)", padding: "12px", borderRadius: "12px", border: "1px solid var(--border-light)" }}>
                {msg.metadata.reasoning as string}
              </div>
            </details>
          )}

          {!isUser && !!msg.metadata?.agent_description && (
            <motion.div
              style={{
                marginTop: "20px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                background: "var(--bg-main)",
                borderRadius: "8px",
                fontSize: "10px",
                fontWeight: 800,
                color: "var(--brand-primary)",
                border: "1px solid var(--border-light)"
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Target size={14} color="var(--brand-primary)" />
              <span style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Intelligence Context:</span>
              <span style={{ color: "var(--text-primary)", fontWeight: 900 }}>
                {String(
                  (msg.metadata as any).agent_description ?? "Core"
                )}
                <span style={{ margin: "0 8px", color: "var(--text-tertiary)" }}>|</span>
                {String(
                  (msg.metadata as any).action_description ?? "Direct"
                )}
              </span>
            </motion.div>
          )}
        </div>

        {!!detailedData && !isGenericMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              marginTop: "16px",
              width: "100%",
              background: "#ffffff",
              borderRadius: "20px",
              border: "1px solid var(--border-light)",
              padding: "6px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)"
            }}
          >
             <div style={{ padding: "16px", display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: 40, height: 40, borderRadius: "12px", background: "var(--brand-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <Target size={20} color="var(--brand-primary)" />
                </div>
                <div style={{ flex: 1 }}>
                   <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-primary)" }}>Intelligence Dataset</div>
                   <div style={{ fontSize: "11px", color: "var(--text-tertiary)", fontWeight: 600 }}>{Object.keys(detailedData).length} high-fidelity dimensions mapped</div>
                </div>
                <button style={{ 
                  padding: "8px 16px", borderRadius: "10px", background: "var(--brand-primary)", 
                  border: "none", color: "#fff", fontSize: "12px", fontWeight: 700, 
                  cursor: "pointer", boxShadow: "0 4px 12px rgba(109, 40, 217, 0.2)" 
                }}>Inspect Node</button>
             </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};