import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  PlusCircle,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { ChatSession, Health } from "../../types";
import { NAV } from "../../utils/constants";
import { StatusLine } from "../common/StatusLine";
import {
  sidebarStyle,
  sidebarHeaderStyle,
  logoBadgeStyle,
  primaryPillButton,
  navContainerStyle,
  navButtonStyle,
  activeNavButtonStyle,
  activeNavIndicatorStyle,
  sessionsContainerStyle,
  sectionLabelStyle,
  sessionCardStyle,
  activeSessionCardStyle,
  sessionButtonStyle,
  sessionIconStyle,
  sessionTitleStyle,
  sessionTimestampStyle,
  trashButtonStyle,
  sidebarFooterStyle,
  statusToggleStyle,
  statusIndicatorWrapStyle,
  statusDotStyle,
  statusCardStyle,
} from "../../styles/theme";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  sessions: ChatSession[];
  activeSession: string;
  setActiveSession: (id: string) => void;
  handleNewChat: () => void;
  handleDeleteChat: (id: string) => void;
  statusOpen: boolean;
  setStatusOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  connected: boolean;
  health: Health | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  activeTab,
  setActiveTab,
  sessions,
  activeSession,
  setActiveSession,
  handleNewChat,
  handleDeleteChat,
  statusOpen,
  setStatusOpen,
  connected,
  health,
}) => {
  return (
    <aside
      className={`sidebar ${isCollapsed ? "collapsed" : ""}`}
      style={{
        ...sidebarStyle,
        ...(isCollapsed ? { width: 80, padding: "24px 12px 16px" } : {}),
      }}
    >
      <div
        style={{
          ...sidebarHeaderStyle,
          padding: isCollapsed ? "0 0 24px" : "0 8px 24px",
          justifyContent: isCollapsed ? "center" : "flex-start",
        }}
      >
        <div style={{ ...logoBadgeStyle, width: isCollapsed ? 40 : 44, height: isCollapsed ? 40 : 44 }}>
          <Sparkles size={isCollapsed ? 18 : 20} color="#1a73e8" />
        </div>
        {!isCollapsed && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#202124", letterSpacing: "-0.02em" }}>
              Human CoPilot
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: "#5f6368", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              AI Executive Assistant
            </div>
          </div>
        )}
      </div>

      <button
        style={{
          ...primaryPillButton,
          padding: isCollapsed ? "12px" : "14px 20px",
          justifyContent: isCollapsed ? "center" : "flex-start",
        }}
        onClick={handleNewChat}
      >
        <PlusCircle size={18} />
        {!isCollapsed && "New Chat"}
      </button>

      <button
        style={{
          position: "absolute",
          top: 14,
          right: isCollapsed ? -12 : 8,
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "#fff",
          border: "1px solid #f1f3f4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          zIndex: 100,
        }}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown style={{ transform: "rotate(90deg)" }} size={14} />}
      </button>

      <nav style={navContainerStyle}>
        {NAV.map((item) => (
          <button
            key={item.id}
            style={{
              ...navButtonStyle,
              ...(activeTab === item.id ? activeNavButtonStyle : {}),
              justifyContent: isCollapsed ? "center" : "flex-start",
              padding: isCollapsed ? "10px 0" : "10px 16px",
            }}
            onClick={() => setActiveTab(item.id)}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.label}</span>}
            {activeTab === item.id && !isCollapsed ? (
              <motion.div layoutId="nav-active" style={activeNavIndicatorStyle} />
            ) : null}
          </button>
        ))}
      </nav>

      <div style={sessionsContainerStyle} className="hide-scrollbar">
        {!isCollapsed && <div style={sectionLabelStyle}>Chat History</div>}
        {sessions.map((session) => (
          <div
            key={session.id}
            style={{
              ...sessionCardStyle,
              ...(session.id === activeSession ? activeSessionCardStyle : {}),
              padding: isCollapsed ? "2px 0" : "2px 8px",
              justifyContent: isCollapsed ? "center" : "flex-start",
            }}
          >
            <button
              style={sessionButtonStyle}
              onClick={() => {
                setActiveSession(session.id);
                setActiveTab("conversations");
              }}
              disabled={isCollapsed && session.id === activeSession}
              title={session.title}
            >
              <div style={sessionIconStyle(session.id === activeSession)}>
                <MessageCircle size={14} />
              </div>
              {!isCollapsed && (
                <div style={{ minWidth: 0, flex: 1, textAlign: "left" }}>
                  <div style={sessionTitleStyle}>{session.title}</div>
                  <div style={sessionTimestampStyle}>
                    {new Date(session.updatedAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                  </div>
                </div>
              )}
            </button>
            {!isCollapsed && (
              <button style={trashButtonStyle} onClick={() => handleDeleteChat(session.id)}>
                <Trash2 size={13} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={sidebarFooterStyle}>
        <button
          style={{
            ...statusToggleStyle,
            justifyContent: isCollapsed ? "center" : "flex-start",
            padding: isCollapsed ? "14px 0" : "14px 16px",
          }}
          onClick={() => setStatusOpen((open) => !open)}
        >
          <div style={statusIndicatorWrapStyle(connected)}>
            <div style={statusDotStyle(connected)} />
          </div>
          {!isCollapsed && "System Info"}
          {!isCollapsed &&
            (statusOpen ? (
              <ChevronDown size={14} style={{ marginLeft: "auto" }} />
            ) : (
              <ChevronRight size={14} style={{ marginLeft: "auto" }} />
            ))}
        </button>
        <AnimatePresence>
          {statusOpen && !isCollapsed ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: "hidden" }}
            >
              <div style={statusCardStyle}>
                <StatusLine label="Endpoint" value={connected ? "Secure Tunnel" : "Disconnected"} />
                <StatusLine label="Engine DB" value={health?.database ?? "Operational"} />
                <StatusLine label="Pilot v" value={health?.version ?? "1.3.3"} />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </aside>
  );
};
