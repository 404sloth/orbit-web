import React, { useEffect, useState, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

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
import { AccessAudit } from "./components/audit/AccessAudit";
import { CreditDashboard } from "./components/credits/CreditDashboard";
import { Toast } from "./components/common/Toast";
import { OfflineOverlay } from "./components/common/OfflineOverlay";
import { ApprovalGateway } from "./components/common/ApprovalGateway";

// Hooks
import { useAuth } from "./hooks/useAuth";
import { useChat } from "./hooks/useChat";
import { usePulse } from "./hooks/usePulse";
import { useKnowledge } from "./hooks/useKnowledge";

import { Routes, Route, useLocation, useNavigate, Navigate } from "react-router-dom";

// Utils & Types
import { NAV, INITIAL_SUGGESTIONS } from "./utils/constants";
import { speechRecognitionCtor, prettifyAgent } from "./utils/helpers";
import {
  appContainerStyle,
  contentLayout,
  chatLayoutStyle,
  chatColumnStyle,
  messagesPaneStyle,
  detailsPanelStyle,
} from "./styles/theme";
import { ChevronUp } from "lucide-react";

const TAB_MAP: Record<string, string> = {
  "/chat": "conversations",
  "/pulse": "dashboard",
  "/assets": "knowledge",
  "/guard": "audit",
  "/credits": "credits",
};

const PATH_MAP: Record<string, string> = {
  "conversations": "/chat",
  "dashboard": "/pulse",
  "knowledge": "/assets",
  "audit": "/guard",
  "credits": "/credits",
};

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
  
  const { 
    kbText, setKbText, kbSource, setKbSource, kbScope, setKbScope, 
    kbFile, setKbFile, kbLoading, handleKbSubmit 
  } = useKnowledge(token);

  const { pathname } = useLocation();
  const navigate = useNavigate();

  // UI State
  const activeTab = TAB_MAP[pathname] || "conversations";
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [connected] = useState(true);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (viewportRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollBottom(!isAtBottom);
    }
  };

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
    if (activeTab === "dashboard" && token) {
      void loadPulseProjects();
    }
  }, [activeTab, token, loadPulseProjects]);

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
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          style={{ width: "100%", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route path="/chat" element={
              <div style={chatLayoutStyle}>
                <div style={chatColumnStyle}>
                  <div 
                    ref={viewportRef}
                    onScroll={handleScroll}
                    className="chat-viewport custom-scrollbar"
                  >
                    <div style={{ padding: "0 40px", paddingBottom: "20px" }}>
                      {messages.length === 0 ? (
                        <EmptyState 
                          suggestions={[...INITIAL_SUGGESTIONS]} 
                          onSelect={(text: string) => handleSendWithHint(text)} 
                        />
                      ) : (
                        <>
                          {messages.map((m, idx) => (
                            <MessageItem 
                              key={idx} 
                              msg={m} 
                              isLast={idx === messages.length - 1} 
                            />
                          ))}
                          {isThinking && (
                            <div style={{ padding: "20px", display: "flex", gap: "12px", alignItems: "center", color: "var(--text-tertiary)" }}>
                              <div className="thinking-dot"></div>
                              <span style={{ fontSize: "13px", fontWeight: 500 }}>
                                Consulting...
                              </span>
                            </div>
                          )}
                          <div ref={endRef} />
                        </>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {showScrollBottom && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="scroll-bottom-btn"
                        onClick={scrollToBottom}
                      >
                        <ChevronUp style={{ transform: "rotate(180deg)" }} size={20} />
                      </motion.button>
                    )}
                  </AnimatePresence>

                  <div style={{ flexShrink: 0, background: "transparent" }}>
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
                </div>
                <div style={detailsPanelStyle}>
                  <div style={{ 
                    display: "flex", gap: 0, padding: "16px 20px", 
                    background: "#f8f9fa", borderBottom: "1px solid #dadce0",
                    position: "sticky", top: 0, zIndex: 10
                  }}>
                    <button 
                      onClick={() => setStatusOpen(false)}
                      style={{ 
                        flex: 1, padding: '8px', borderRadius: "4px 0 0 4px", 
                        border: '1px solid #dadce0',
                        borderRight: "none",
                        background: !statusOpen ? '#ffffff' : 'transparent', 
                        fontSize: 12, fontWeight: 500, 
                        color: !statusOpen ? '#1a73e8' : '#5f6368', 
                        cursor: 'pointer', transition: 'all 0.2s ease'
                      }}
                    >
                      Insights
                    </button>
                    <button 
                      onClick={() => setStatusOpen(true)}
                      style={{ 
                        flex: 1, padding: '8px', borderRadius: "0 4px 4px 0", 
                        border: '1px solid #dadce0',
                        background: statusOpen ? '#ffffff' : 'transparent', 
                        fontSize: 12, fontWeight: 500, 
                        color: statusOpen ? '#1a73e8' : '#5f6368', 
                        cursor: 'pointer', transition: 'all 0.2s ease'
                      }}
                    >
                      Trace
                    </button>
                  </div>
                  
                  <div style={{ flex: 1, overflowY: "auto", padding: "20px" }} className="custom-scrollbar">
                    {statusOpen ? (
                      <TracePanel liveTrace={liveTrace} lastRouting={lastRouting} isThinking={isThinking} />
                    ) : (
                      <ReportPanel reports={generatedReports} />
                    )}
                  </div>
                </div>
              </div>
            } />
            <Route path="/pulse" element={
              <div style={{ flex: 1, overflowY: "auto", height: "100%" }} className="custom-scrollbar">
                <PulseDashboard
                  projects={pulseProjects}
                  selectedPid={selectedPid}
                  timeline={pulseTimeline}
                  loading={pulseLoading}
                  onSelect={(id) => id ? void loadPulseTimeline(id) : void loadPulseTimeline("")}
                  onSimulate={handleSimulateLifecycle}
                />
              </div>
            } />
            <Route path="/assets" element={
              <div style={{ flex: 1, overflowY: "auto", height: "100%" }} className="custom-scrollbar">
                <KnowledgeBase
                  kbText={kbText} setKbText={setKbText}
                  kbSource={kbSource} setKbSource={setKbSource}
                  kbScope={kbScope} setKbScope={setKbScope}
                  kbFile={kbFile} setKbFile={setKbFile}
                  kbLoading={kbLoading} handleKbSubmit={handleKbSubmit}
                  setToast={setToast}
                />
              </div>
            } />
            <Route path="/guard" element={
              <div style={{ flex: 1, overflowY: "auto", height: "100%" }} className="custom-scrollbar">
                <AccessAudit />
              </div>
            } />
            <Route path="/credits" element={
              <div style={{ flex: 1, overflowY: "auto", height: "100%" }} className="custom-scrollbar">
                <CreditDashboard />
              </div>
            } />
            <Route path="*" element={<Navigate to="/chat" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    );
  }, [
    pathname, messages, isThinking, dynamicSuggestions, quickActions, isListening, 
    selectedAgentHint, lastRouting, liveTrace, generatedReports, statusOpen, 
    pulseProjects, selectedPid, pulseTimeline, pulseLoading, kbText, kbSource, 
    kbScope, kbFile, kbLoading, endRef
  ]);

  if (!token) return <Login onLogin={handleLogin} />;

  return (
    <div style={appContainerStyle}>
      <OfflineOverlay connected={connected} />
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        activeTab={activeTab}
        setActiveTab={(tab) => navigate(PATH_MAP[tab] || "/chat")}
        sessions={sessions}
        activeSession={activeSession}
        onSessionSelect={setActiveSession}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onLogout={handleLogout}
        className="sidebar"
      />
      
      <main className="main-content" style={{ ...contentLayout, overflow: "hidden", position: "relative" }}>
        <Header 
          activeTabLabel={activeTabLabel} 
          isThinking={isThinking} 
          connected={connected} 
          notifications={notifications}
          onNotificationAction={handleNotificationAction}
          currentUser={currentUser}
        />
        <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {mainPanel}
        </div>
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
