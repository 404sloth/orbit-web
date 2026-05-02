import { ChatSession, MsgSender, SpeechRecognitionLike } from "../types";

let MESSAGE_ID = 0;

export function nextMessageId(): number {
  MESSAGE_ID += 1;
  return MESSAGE_ID;
}

export function toChatSession(raw: Record<string, unknown>): ChatSession {
  return {
    id: String(raw.thread_id ?? raw.id ?? ""),
    title: buildConversationTitle(String(raw.last_message ?? "New Chat")),
    createdAt: String(raw.created_at ?? new Date().toISOString()),
    updatedAt: String(raw.updated_at ?? new Date().toISOString()),
    lastMessage: String(raw.last_message ?? ""),
    messageCount: Number(raw.message_count ?? 0),
  };
}

export function buildConversationTitle(lastMessage: string): string {
  const cleaned = stripAgentLabel(lastMessage).replace(/\*\*/g, "").replace(/#/g, "").trim();
  if (!cleaned) return "New Chat";
  return cleaned.length > 42 ? `${cleaned.slice(0, 42)}…` : cleaned;
}

export function inferSender(role: string): MsgSender {
  if (role === "user") return "user";
  if (role === "assistant") return "agent";
  return "system";
}

export function prettifyAgent(agent?: string | null): string | undefined {
  if (!agent) return undefined;
  const map: Record<string, string> = {
    "sql": "Data Intelligence",
    "rag": "Knowledge Specialist",
    "hybrid": "Executive Consultant",
    "human": "Executive Approval",
    "report": "Strategic Analyst",
  };
  return map[agent.toLowerCase()] ?? agent.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

export function stripAgentLabel(text: string): string {
  return text.replace(/^\[[^\]]+\]\s*/, "").trim();
}

export function speechRecognitionCtor(): (new () => SpeechRecognitionLike) | undefined {
  return (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
}
