import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  PlusCircle,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  Trash2,
  LogOut
} from "lucide-react";
import { ChatSession } from "../../types";
import { NAV } from "../../utils/constants";
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
} from "../../styles/theme";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  sessions: ChatSession[];
  activeSession: string;
  onSessionSelect: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  activeTab,
  setActiveTab,
  sessions,
  activeSession,
  onSessionSelect,
  onNewChat,
  onDeleteChat,
  onLogout,
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
        <div style={{ ...logoBadgeStyle, width: isCollapsed ? 40 : 44, height: isCollapsed ? 40 : 44, background: '#6366f1' }}>
          <Sparkles size={isCollapsed ? 18 : 20} color="#fff" />
        </div>
        {!isCollapsed && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#1e293b", letterSpacing: "-0.02em" }}>
              Orbit
            </div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#6366f1", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Intelligence
            </div>
          </div>
        )}
      </div>

      <button
        style={{
          ...primaryPillButton,
          padding: isCollapsed ? "12px" : "14px 20px",
          justifyContent: isCollapsed ? "center" : "flex-start",
          background: '#6366f1',
          color: '#fff',
          border: 'none'
        }}
        onClick={onNewChat}
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
              color: activeTab === item.id ? '#6366f1' : '#64748b'
            }}
            onClick={() => setActiveTab(item.id)}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon size={20} />
            {!isCollapsed && <span>{item.label}</span>}
            {activeTab === item.id && !isCollapsed ? (
              <motion.div layoutId="nav-active" style={{ ...activeNavIndicatorStyle, background: '#6366f1' }} />
            ) : null}
          </button>
        ))}
      </nav>

      <div style={sessionsContainerStyle} className="hide-scrollbar">
        {!isCollapsed && <div style={sectionLabelStyle}>Recent Threads</div>}
        {sessions.map((session) => (
          <div
            key={session.id}
            style={{
              ...sessionCardStyle,
              ...(session.id === activeSession ? activeSessionCardStyle : {}),
              padding: isCollapsed ? "2px 0" : "2px 8px",
              justifyContent: isCollapsed ? "center" : "flex-start",
              border: session.id === activeSession ? '1px solid #e2e8f0' : '1px solid transparent',
              background: session.id === activeSession ? '#fff' : 'transparent'
            }}
          >
            <button
              style={sessionButtonStyle}
              onClick={() => {
                onSessionSelect(session.id);
                setActiveTab("conversations");
              }}
              disabled={isCollapsed && session.id === activeSession}
              title={session.title}
            >
              <div style={{ ...sessionIconStyle(session.id === activeSession), background: session.id === activeSession ? '#6366f1' : '#f1f5f9', color: session.id === activeSession ? '#fff' : '#64748b' }}>
                <MessageCircle size={14} />
              </div>
              {!isCollapsed && (
                <div style={{ minWidth: 0, flex: 1, textAlign: "left" }}>
                  <div style={{ ...sessionTitleStyle, color: session.id === activeSession ? '#1e293b' : '#64748b' }}>{session.title}</div>
                  <div style={sessionTimestampStyle}>
                    {new Date(session.updatedAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                  </div>
                </div>
              )}
            </button>
            {!isCollapsed && (
              <button style={trashButtonStyle} onClick={() => onDeleteChat(session.id)}>
                <Trash2 size={13} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={sidebarFooterStyle}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            width: '100%',
            padding: isCollapsed ? '12px 0' : '12px 16px',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            background: 'none',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600
          }}
          onClick={onLogout}
        >
          <LogOut size={18} />
          {!isCollapsed && "Sign Out"}
        </button>
      </div>
    </aside>
  );
};
