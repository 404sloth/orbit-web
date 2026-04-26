import React, { useEffect, useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

// Components
import { Login } from "./components/Login";
import { Sidebar } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { MessageItem } from "./components/chat/MessageItem";
import { EmptyState } from "./components/chat/EmptyState";
import { Composer } from "./components/chat/Composer";
import { TracePanel } from "./components/chat/TracePanel";
import { ReportPanel } from "./components/chat/ReportPanel";
import { PulseDashboard } from "./components/dashboard/PulseDashboard";
import { KnowledgeBase } from "./components/knowledge/KnowledgeBase";
import { ResearchPanel } from "./components/research/ResearchPanel";
import { Toast } from "./components/common/Toast";
import { OfflineOverlay } from "./components/common/OfflineOverlay";
import { ApprovalGateway } from "./components/common/ApprovalGateway";

// Hooks
import { useAuth } from "./hooks/useAuth";
import { useChat } from "./hooks/useChat";
import { usePulse } from "./hooks/usePulse";
import { useKnowledge } from "./hooks/useKnowledge";

// Utils & Types
import { NAV } from "./utils/constants";
import { speechRecognitionCtor, prettifyAgent } from "./utils/helpers";
import {
  appContainerStyle,
  contentLayout,
  chatLayoutStyle,
  chatColumnStyle,
  messagesPaneStyle,
  detailsPanelStyle,
} from "./styles/theme";

export default function App() {
  const { token, currentUser, handleLogin, handleLogout } = useAuth();
  const {
    messages, sessions, activeSession, setActiveSession, isThinking, lastRouting, liveTrace,
    dynamicSuggestions, quickActions, loadSessions, loadHistory, handleSend, handleNewChat, handleDeleteChat,
    pendingApproval, setPendingApproval, generatedReports, endRef
  } = useChat(token);
  
  const { 
    pulseProjects, pulseTimeline, notifications, selectedPid, pulseLoading, 
    loadPulseProjects, loadPulseTimeline, loadNotifications, handleNotificationAction, handleSimulateLifecycle 
  } = usePulse();
  
  const { kbText, setKbText, kbSource, setKbSource, kbFile, setKbFile, kbLoading, handleKbSubmit } = useKnowledge(token);

  // UI State
  const [activeTab, setActiveTab] = useState<(typeof NAV)[number]["id"]>("conversations");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [connected] = useState(true);

  useEffect(() => {
    if (token) {
      void loadSessions();
      void loadNotifications();
    }
  }, [token, loadSessions, loadNotifications]);

  useEffect(() => {
    if (activeSession) {
      void loadHistory(activeSession);
    }
  }, [activeSession, loadHistory]);

  useEffect(() => {
    if (activeTab === "dashboard") {
      void loadPulseProjects();
    }
  }, [activeTab, loadPulseProjects]);

  const handleVoice = async () => {
    const Ctor = speechRecognitionCtor();
    if (!Ctor) {
      setToast({ message: "Voice not supported.", type: "error" });
      return;
    }
    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      void handleSend(transcript);
      setIsListening(false);
    };
    recognition.start();
  };

  const [selectedAgentHint, setSelectedAgentHint] = useState<string | null>(null);

  const handleSendWithHint = (text: string, hint?: string | null) => {
    void handleSend(text, hint ?? selectedAgentHint ?? undefined);
    setSelectedAgentHint(null);
  };

  const activeTabLabel = NAV.find((t) => t.id === activeTab)?.label || "Orbit";

  const mainPanel = useMemo(() => {
    switch (activeTab) {
      case "dashboard":
        return (
          <PulseDashboard
            projects={pulseProjects}
            selectedPid={selectedPid}
            timeline={pulseTimeline}
            loading={pulseLoading}
            onSelect={loadPulseTimeline}
            onSimulate={handleSimulateLifecycle}
          />
        );
      case "knowledge":
        return (
          <KnowledgeBase
            kbText={kbText} setKbText={setKbText}
            kbSource={kbSource} setKbSource={setKbSource}
            kbFile={kbFile} setKbFile={setKbFile}
            kbLoading={kbLoading} handleKbSubmit={handleKbSubmit}
            setToast={setToast}
          />
        );
      default:
        return (
          <div style={chatLayoutStyle}>
            <div style={chatColumnStyle}>
              <div style={messagesPaneStyle}>
                {messages.length === 0 ? (
                  <EmptyState suggestions={dynamicSuggestions} onSelect={handleSendWithHint} />
                ) : (
                  messages.map((msg, i) => (
                    <MessageItem key={msg.id} msg={msg} isLast={i === messages.length - 1} />
                  ))
                )}
                {isThinking && (
                  <div style={{ padding: "20px", display: "flex", gap: "10px", alignItems: "center", color: "#64748b" }}>
                    <div className="dot-typing"></div>
                    <span style={{ fontSize: "13px", fontWeight: 500 }}>
                      Consulting with {prettifyAgent(messages[messages.length - 1]?.metadata?.agent_hint as string | undefined) || "Supervisor"}...
                    </span>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              <Composer
                onSend={handleSendWithHint}
                isThinking={isThinking}
                isListening={isListening}
                onVoice={handleVoice}
                suggestions={dynamicSuggestions}
                quickActions={quickActions}
                selectedAgentHint={selectedAgentHint}
                onAgentChange={setSelectedAgentHint}
              />
            </div>

            <div style={detailsPanelStyle}>
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                <button 
                  onClick={() => setStatusOpen(false)}
                  style={{ 
                    flex: 1, padding: '10px', borderRadius: 12, 
                    border: !statusOpen ? '1px solid var(--brand-primary)' : '1px solid var(--border-light)', 
                    background: !statusOpen ? 'var(--brand-light)' : 'transparent', 
                    fontSize: 13, fontWeight: 700, 
                    color: !statusOpen ? 'var(--brand-primary)' : 'var(--text-secondary)', 
                    cursor: 'pointer', transition: 'all 0.2s ease'
                  }}
                >
                  Insights
                </button>
                <button 
                  onClick={() => setStatusOpen(true)}
                  style={{ 
                    flex: 1, padding: '10px', borderRadius: 12, 
                    border: statusOpen ? '1px solid var(--brand-primary)' : '1px solid var(--border-light)', 
                    background: statusOpen ? 'var(--brand-light)' : 'transparent', 
                    fontSize: 13, fontWeight: 700, 
                    color: statusOpen ? 'var(--brand-primary)' : 'var(--text-secondary)', 
                    cursor: 'pointer', transition: 'all 0.2s ease'
                  }}
                >
                  Trace
                </button>
              </div>
              {statusOpen ? (
                <TracePanel lastRouting={lastRouting} liveTrace={liveTrace} isThinking={isThinking} />
              ) : (
                <ReportPanel reports={generatedReports} />
              )}
            </div>
          </div>
        );
    }
  }, [
    activeTab, pulseProjects, selectedPid, pulseTimeline, pulseLoading, loadPulseTimeline, handleSimulateLifecycle,
    kbText, kbSource, kbFile, kbLoading, handleKbSubmit, messages, dynamicSuggestions, isThinking, isListening, quickActions,
    selectedAgentHint, lastRouting, liveTrace, generatedReports, statusOpen, endRef, handleSendWithHint, handleVoice
  ]);

  if (!token) return <Login onLogin={handleLogin} />;

  return (
    <div style={appContainerStyle}>
      <OfflineOverlay connected={connected} />
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed}
        sessions={sessions}
        activeSession={activeSession}
        onSessionSelect={setActiveSession}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onLogout={handleLogout}
      />
      
      <main style={contentLayout}>
        <Header 
          activeTabLabel={activeTabLabel} 
          isThinking={isThinking} 
          connected={connected} 
          notifications={notifications}
          onNotificationAction={handleNotificationAction}
          currentUser={currentUser}
        />
        {mainPanel}
      </main>

      <AnimatePresence>
        {pendingApproval && (
          <ApprovalGateway
            prompt={pendingApproval.prompt}
            onApprove={() => {
              void handleSend("Approve");
              setPendingApproval(null);
            }}
            onReject={() => {
              void handleSend("Reject");
              setPendingApproval(null);
            }}
          />
        )}
      </AnimatePresence>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
