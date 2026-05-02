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
      <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
        <div style={{ 
          background: "#e8f0fe", color: "#1a73e8", 
          padding: "6px 16px", borderRadius: "4px", fontSize: "12px", 
          fontWeight: 500, border: "1px solid #dadce0",
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
          width: 32, height: 32, borderRadius: "50%",
          background: isUser ? "#1a73e8" : "#f1f3f4",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          marginTop: 4
        }}
      >
        {isUser ? (
          <User size={16} color="#ffffff" />
        ) : (
          <Bot size={16} color="#1a73e8" />
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
            fontWeight: 500, fontSize: "12px", color: "#202124"
          }}>
            {isUser ? "You" : (msg.agent || "Orbit AI")}
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
            background: isUser ? "#f1f3f4" : "#e8f0fe",
            color: "#202124",
            padding: "12px 16px",
            borderRadius: 8,
            lineHeight: "1.5",
            fontSize: "14px",
            position: "relative",
            fontWeight: 400,
            border: "none"
          }}
        >
          <RichText text={cleanedText} isUser={isUser} />

          {!isUser && !!msg.metadata?.reasoning && (
            <details style={{ marginTop: "12px", borderTop: "1px solid #dadce0", paddingTop: "8px" }}>
              <summary style={{ fontSize: "11px", fontWeight: 500, color: "#1a73e8", cursor: "pointer", listStyle: "none", display: "flex", alignItems: "center", gap: "6px" }}>
                <Clock size={12} /> Thinking Process
              </summary>
              <div style={{ marginTop: "8px", fontSize: "12px", color: "#5f6368", background: "var(--bg-sidebar)", padding: "8px", borderRadius: "4px", border: "1px solid #dadce0" }}>
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
                background: "var(--bg-sidebar)",
                borderRadius: "4px",
                fontSize: "10px",
                fontWeight: 500,
                color: "#1a73e8",
                border: "1px solid #dadce0"
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Target size={14} color="var(--brand-primary)" />
              <span style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}>Advisory Context:</span>
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
              background: "var(--bg-main)",
              borderRadius: "8px",
              border: "1px solid #dadce0",
              padding: "4px",
              boxShadow: "0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15)"
            }}
          >
             <div style={{ padding: "16px", display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: 40, height: 40, borderRadius: "12px", background: "var(--brand-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <Target size={20} color="var(--brand-primary)" />
                </div>
                <div style={{ flex: 1 }}>
                   <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-primary)" }}>Knowledge Set</div>
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