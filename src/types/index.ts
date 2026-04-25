import { ReactNode } from "react";

export type MsgStatus = "sending" | "sent" | "delivered";
export type MsgSender = "user" | "agent" | "system";

export type BackendHistoryMessage = {
  role: string;
  message: string;
  timestamp: string;
};

export type Message = {
  id: number;
  sender: MsgSender;
  text: string;
  agent?: string;
  targetAgent?: string;
  ts: string;
  status?: MsgStatus;
  metadata?: Record<string, unknown>;
};

export type AlertItem = {
  id: number;
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  source: string;
  resolved: boolean;
};

export type TraceStep = {
  id: string;
  label: string;
  status: "pending" | "current" | "complete" | "error";
  icon?: any;
};

export type Health = {
  status: string;
  database?: string;
  version?: string;
};

export type ChatSession = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: string;
  messageCount: number;
};

export type RoutingMetadata = {
  original_query?: string;
  sanitized_query?: string;
  agent?: string;
  action?: string;
  agent_description?: string;
  action_description?: string;
  tool_descriptions?: Record<string, string>;
  intent_reasoning?: string;
  thought?: string;
  params?: Record<string, unknown>;
  data?: Record<string, unknown>;
};

export type PulseProject = {
  id: string;
  name: string;
  health_color: "green" | "amber" | "red";
  progress_percent: number;
  status: string;
  start_date?: string;
  end_date?: string;
  next_milestone?: { title: string; due_date: string };
};

export type PulseEvent = {
  type: "meeting" | "milestone" | "rfp" | "vendor_response" | "sow";
  id: string;
  date: string;
  content?: string;
  title?: string;
  summary?: string;
  status?: string;
  vendor_name?: string;
  score?: number;
  milestones?: Array<{ title: string; due_date: string; status: string }>;
};

export interface SpeechRecognitionResultLike {
  transcript: string;
}

export interface SpeechRecognitionLike {
  lang: string;
  onstart: null | (() => void);
  onend: null | (() => void);
  onerror: null | (() => void);
  onresult: null | ((event: { results: ArrayLike<ArrayLike<SpeechRecognitionResultLike>> }) => void);
  start: () => void;
}

export type GeneratedReport = {
  url: string;
  filename: string;
  type: "excel" | "image" | "image_bundle";
  timestamp: string;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}
