import { useState, useCallback, useRef, useEffect } from "react";
import { Message, ChatSession, RoutingMetadata, MsgStatus, GeneratedReport } from "../types";
import { chatApi } from "../services/api";
import { toChatSession, nextMessageId, inferSender, prettifyAgent, buildConversationTitle } from "../utils/helpers";
import { API_URL, INITIAL_SUGGESTIONS } from "../utils/constants";

export function useChat(token: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<string>("");
  const [isThinking, setIsThinking] = useState(false);
  const [lastRouting, setLastRouting] = useState<RoutingMetadata | null>(null);
  const [liveTrace, setLiveTrace] = useState<any[]>([]);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>(INITIAL_SUGGESTIONS);
  const [pendingApproval, setPendingApproval] = useState<{ prompt: string } | null>(null);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [quickActions, setQuickActions] = useState<string[]>([]);

  const endRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const loadSessions = useCallback(async () => {
    try {
      const conversationData = await chatApi.getThreads();
      const mappedSessions = conversationData.map(toChatSession);
      if (mappedSessions.length) {
        setSessions(mappedSessions);
        setActiveSession(mappedSessions[0].id);
      } else {
        const raw = await chatApi.createThread();
        const thread = toChatSession(raw);
        setSessions([thread]);
        setActiveSession(thread.id);
      }
    } catch (error) {
      console.error("Failed to load sessions", error);
    }
  }, []);

  const loadHistory = useCallback(async (threadId: string) => {
    try {
      const history = await chatApi.getHistory(threadId);
      setMessages(
        history.map((entry) => ({
          id: nextMessageId(),
          sender: inferSender(entry.role),
          text: entry.message,
          ts: entry.timestamp,
          status: entry.role === "user" ? "delivered" : undefined,
        })),
      );
    } catch (error) {
      console.error("Failed to load history", error);
      setMessages([]);
    }
  }, []);

  const loadSuggestions = useCallback(async (threadId: string) => {
    try {
      const queries = await chatApi.getSuggestions(threadId);
      setDynamicSuggestions(queries);
    } catch (error) {
      console.error("Failed to load suggestions", error);
    }
  }, []);

  useEffect(() => {
    if (activeSession) {
      void loadSuggestions(activeSession);
    }
  }, [activeSession, messages.length, loadSuggestions]);

  const appendMessage = useCallback((message: Omit<Message, "id">) => {
    setMessages((previous) => [...previous, { ...message, id: nextMessageId() }]);
  }, []);

  const replacePendingUserStatus = useCallback((status: MsgStatus) => {
    setMessages((previous) =>
      previous.map((message) =>
        message.sender === "user" && message.status !== "delivered"
          ? { ...message, status }
          : message,
      ),
    );
  }, []);

  const refreshSessionFromMessage = useCallback((threadId: string, preview: string) => {
    setSessions((previous) =>
      previous.map((session) =>
        session.id === threadId
          ? {
            ...session,
            title: session.title === "New Chat" ? buildConversationTitle(preview) : session.title,
            lastMessage: preview,
            updatedAt: new Date().toISOString(),
            messageCount: session.messageCount + 1,
          }
          : session,
      ),
    );
  }, []);

  const handleSend = useCallback(async (text: string, selectedAgentHint?: string | null) => {
    const prompt = text.trim();
    if (!prompt || !activeSession) return;

    setQuickActions([]);
    // We keep suggestions until new ones arrive or intentionally cleared
    
    appendMessage({
      sender: "user",
      text: prompt,
      targetAgent: prettifyAgent(selectedAgentHint),
      ts: new Date().toISOString(),
      status: "sending",
      metadata: selectedAgentHint ? { agent_hint: selectedAgentHint } : undefined,
    });
    refreshSessionFromMessage(activeSession, prompt);
    setIsThinking(true);
    setLiveTrace([
      { name: "Strategic Analysis", status: "running", details: "Analyzing request intent and routing strategy..." }
    ]);

    window.setTimeout(() => replacePendingUserStatus("sent"), 250);

    try {
      const response = await fetch(`${API_URL}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ prompt, thread_id: activeSession }),
      });

      if (!response.body) throw new Error("ReadableStream not supported.");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));

            if (event.type === "node_start") {
              setLiveTrace((prev) => {
                const filtered = prev.filter(s => s.name !== "Strategic Analysis" || s.status === "completed");
                return [
                  ...filtered.map(s => ({ ...s, status: "completed" })),
                  { name: prettifyAgent(event.node) ?? event.node, status: "running", details: `Entering ${event.node} stage...` }
                ];
              });
            } else if (event.type === "routing_decision") {
              setLiveTrace((prev) => {
                const next = [...prev];
                if (next.length) {
                  next[next.length - 1].details = event.reasoning;
                  if (event.next_node === "FINISH") {
                    next[next.length - 1].status = "completed";
                  }
                }
                return next;
              });
            } else if (event.type === "tool_use") {
              setLiveTrace((prev) => {
                const next = [...prev];
                if (next.length) next[next.length - 1].details = `Tactical Execution: ${event.data.slice(0, 80)}...`;
                return next;
              });
            } else if (event.type === "agent_status" && event.status === "completed") {
              setLiveTrace((prev) => {
                const next = [...prev];
                if (next.length) next[next.length - 1].status = "completed";
                return next;
              });
            } else if (event.type === "final_answer") {
              replacePendingUserStatus("delivered");
              setIsThinking(false);
              appendMessage({
                sender: "agent",
                text: event.response,
                ts: new Date().toISOString(),
                metadata: { reasoning: event.reasoning }
              });
              setLastRouting({ thought: event.reasoning });
              refreshSessionFromMessage(event.thread_id, event.response);
              // Trigger suggestion reload
              void loadSuggestions(activeSession);
            } else if (event.type === "approval_required") {
              setPendingApproval({ prompt: event.prompt });
              setIsThinking(false);
            } else if (event.type === "quick_actions") {
              setQuickActions(event.actions);
            } else if (event.type === "suggestions") {
              setDynamicSuggestions(event.queries);
            } else if (event.type === "report_ready") {
              setGeneratedReports((prev) => [
                {
                  url: event.url,
                  filename: event.filename,
                  type: event.report_type,
                  timestamp: new Date().toISOString()
                },
                ...prev
              ]);
            } else if (event.type === "error") {
              throw new Error(event.detail);
            }
          } catch (e) {
            console.error("Stream parse error", e);
          }
        }
      }
    } catch (error) {
      setIsThinking(false);
      replacePendingUserStatus("delivered");
      appendMessage({
        sender: "system",
        text: error instanceof Error ? error.message : "Failed to connect to core engine.",
        ts: new Date().toISOString(),
      });
    }
  }, [activeSession, appendMessage, refreshSessionFromMessage, replacePendingUserStatus, token, loadSuggestions]);

  const handleNewChat = useCallback(async () => {
    try {
      const raw = await chatApi.createThread();
      const thread = toChatSession(raw);
      setSessions((previous) => [thread, ...previous]);
      setActiveSession(thread.id);
      setMessages([]);
      setLastRouting(null);
      setDynamicSuggestions(INITIAL_SUGGESTIONS);
    } catch (error) {
      console.error("Failed to start new Chat", error);
    }
  }, []);

  const handleDeleteChat = useCallback(async (threadId: string) => {
    try {
      await chatApi.deleteThread(threadId);
      const updated = sessions.filter((session) => session.id !== threadId);
      setSessions(updated);
      if (activeSession === threadId) {
        if (updated.length) {
          setActiveSession(updated[0].id);
        } else {
          await handleNewChat();
        }
      }
    } catch (error) {
      console.error("Failed to delete conversation", error);
    }
  }, [activeSession, handleNewChat, sessions]);

  return {
    messages,
    sessions,
    activeSession,
    setActiveSession,
    isThinking,
    lastRouting,
    liveTrace,
    dynamicSuggestions,
    setDynamicSuggestions,
    quickActions,
    setQuickActions,
    loadSessions,
    loadHistory,
    loadSuggestions,
    handleSend,
    handleNewChat,
    handleDeleteChat,
    pendingApproval,
    setPendingApproval,
    generatedReports,
    endRef,
  };
}
