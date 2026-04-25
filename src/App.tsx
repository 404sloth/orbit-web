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
import { speechRecognitionCtor } from "./utils/helpers";
import {
  appContainerStyle,
  contentLayout,
  chatLayoutStyle,
  chatColumnStyle,
  messagesPaneStyle,
  detailsPanelStyle,
  helpCardStyle,
  helpIconWrap,
  helpTitle,
  helpText,
  fullPanePanel,
} from "./styles/theme";

export default function App() {
  const { token, currentUser, handleLogin, handleLogout } = useAuth();
  const {
    messages, sessions, activeSession, setActiveSession, isThinking, lastRouting, liveTrace,
    dynamicSuggestions, quickActions, loadSessions, loadHistory, handleSend, handleNewChat, handleDeleteChat,
    pendingApproval, setPendingApproval, generatedReports, endRef
  } = useChat(token);
  
  const { pulseProjects, pulseTimeline, selectedPid, pulseLoading, loadPulseProjects, loadPulseTimeline, handleSimulateLifecycle } = usePulse();
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
    }
  }, [token, loadSessions]);

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
    void handleSend(text, hint ?? selectedAgentHint);
    setSelectedAgentHint(null);
  };

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
      case "research":
        return <ResearchPanel onSend={handleSendWithHint} setActiveTab={setActiveTab} />;
      default:
        return null;
    }
  }, [activeTab, pulseProjects, selectedPid, pulseTimeline, pulseLoading, loadPulseTimeline, handleSimulateLifecycle, connected, kbText, setKbText, kbSource, setKbSource, kbFile, setKbFile, kbLoading, handleKbSubmit, handleSendWithHint]);

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={appContainerStyle}>
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sessions={sessions}
        activeSession={activeSession}
        setActiveSession={setActiveSession}
        handleNewChat={handleNewChat}
        handleDeleteChat={handleDeleteChat}
        statusOpen={statusOpen}
        setStatusOpen={setStatusOpen}
        connected={connected}
        health={null}
      />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <Header
          activeTabLabel={NAV.find(n => n.id === activeTab)?.label ?? activeTab}
          isThinking={isThinking}
          connected={connected}
        />

        <div style={contentLayout}>
          {activeTab === "conversations" ? (
            <div style={chatLayoutStyle}>
              <section style={chatColumnStyle}>
                <div style={messagesPaneStyle} className="hide-scrollbar">
                  {messages.length ? (
                    messages.map((msg) => <MessageItem key={msg.id} msg={msg} />)
                  ) : (
                    <EmptyState suggestions={dynamicSuggestions} onPickSuggestion={handleSendWithHint} />
                  )}
                  <div ref={endRef} />
                </div>

                <Composer
                  onSend={handleSendWithHint}
                  onVoice={handleVoice}
                  isListening={isListening}
                  dynamicSuggestions={dynamicSuggestions}
                  quickActions={quickActions}
                  selectedAgentHint={selectedAgentHint}
                  setSelectedAgentHint={setSelectedAgentHint}
                />
              </section>

              <aside style={detailsPanelStyle} className="hide-scrollbar">
                <TracePanel lastRouting={lastRouting} isThinking={isThinking} liveTrace={liveTrace} />
                <ReportPanel reports={generatedReports} />
                
                <div style={helpCardStyle}>
                  <div style={helpIconWrap}><Sparkles size={16} color="#1a73e8" /></div>
                  <div>
                    <div style={helpTitle}>Pro Tip</div>
                    <div style={helpText}>Force routing using the specialized agents menu for precise cross-domain logic.</div>
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            <div style={fullPanePanel}>{mainPanel}</div>
          )}
        </div>

        <AnimatePresence>
          {pendingApproval && (
            <ApprovalGateway
              prompt={pendingApproval.prompt}
              onDeny={() => { handleSend("reject"); setPendingApproval(null); }}
              onApprove={() => { handleSend("approve"); setPendingApproval(null); }}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
