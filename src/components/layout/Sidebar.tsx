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
  className?: string;
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
  className = "",
}) => {
  return (
    <aside
      className={`sidebar ${className} ${isCollapsed ? "collapsed" : ""}`}
      style={{
        ...sidebarStyle,
        background: "var(--bg-sidebar)",
        borderRight: "1px solid #dadce0",
        ...(isCollapsed ? { width: 72, padding: "16px 8px" } : {}),
      }}
    >
      <div
        style={{
          ...sidebarHeaderStyle,
          padding: isCollapsed ? "0 0 28px" : "0 8px 32px",
          justifyContent: isCollapsed ? "center" : "flex-start",
        }}
      >
        <div style={{ 
          ...logoBadgeStyle, 
          width: isCollapsed ? 40 : 44, 
          height: isCollapsed ? 40 : 44, 
          background: '#1a73e8',
          borderRadius: 8,
        }}>
          <Sparkles size={isCollapsed ? 20 : 24} color="#fff" />
        </div>
        {!isCollapsed && (
          <div style={{ marginLeft: 4 }}>
            <div style={{ fontSize: 22, fontWeight: 400, color: "#202124", fontFamily: "'Google Sans', sans-serif", letterSpacing: "-0.01em" }}>
              Orbit
            </div>
            <div style={{ fontSize: 10, fontWeight: 500, color: "#1a73e8", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Executive AI
            </div>
          </div>
        )}
      </div>

      <button
        style={{
          ...primaryPillButton,
          padding: isCollapsed ? "12px" : "10px 24px",
          justifyContent: isCollapsed ? "center" : "flex-start",
          background: '#1a73e8',
          color: '#fff',
          borderRadius: 4,
          boxShadow: '0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15)',
          marginBottom: 24,
          fontFamily: "'Google Sans', sans-serif"
        }}
        onClick={onNewChat}
      >
        <PlusCircle size={20} />
        {!isCollapsed && <span style={{ marginLeft: 4 }}>New Briefing</span>}
      </button>

      <button
        style={{
          position: "absolute",
          top: 36,
          right: isCollapsed ? -14 : -14,
          width: 28,
          height: 28,
          borderRadius: "10px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          zIndex: 100,
          color: "var(--text-secondary)"
        }}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronRight style={{ transform: "rotate(180deg)" }} size={16} />}
      </button>

      <nav style={{ ...navContainerStyle, gap: 8 }}>
        {NAV.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              style={{
                ...navButtonStyle,
                justifyContent: isCollapsed ? "center" : "flex-start",
                padding: isCollapsed ? "12px 0" : "10px 16px",
                color: isActive ? '#1a73e8' : '#5f6368',
                background: isActive ? '#e8f0fe' : 'transparent',
                borderRadius: isCollapsed ? 0 : '0 24px 24px 0',
                transition: 'all 0.2s ease',
                fontWeight: isActive ? 500 : 400,
                position: 'relative',
                border: 'none',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
              }}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {!isCollapsed && <span style={{ marginLeft: 4 }}>{item.label}</span>}
              {isActive && !isCollapsed && (
                <motion.div 
                  layoutId="nav-pill" 
                  style={{ 
                    position: 'absolute', left: 0, width: 4, height: 20, 
                    background: 'var(--brand-primary)', borderRadius: '0 4px 4px 0' 
                  }} 
                />
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ ...sessionsContainerStyle, marginTop: 40 }} className="hide-scrollbar">
        {!isCollapsed && <div style={{ ...sectionLabelStyle, color: 'var(--text-tertiary)', fontSize: 10, fontWeight: 800 }}>Consultation History</div>}
        {sessions.map((session) => {
          const isActive = session.id === activeSession && activeTab === "conversations";
          return (
            <div
              key={session.id}
              style={{
                ...sessionCardStyle,
                padding: isCollapsed ? "4px 0" : "4px 8px",
                justifyContent: isCollapsed ? "center" : "flex-start",
                marginBottom: 6
              }}
            >
              <button
                style={{
                  ...sessionButtonStyle,
                  background: isActive ? '#f8fafd' : 'transparent',
                  borderRadius: 14,
                  padding: '10px'
                }}
                onClick={() => {
                  onSessionSelect(session.id);
                  setActiveTab("conversations");
                }}
                disabled={isCollapsed && isActive}
                title={session.title}
              >
                <div style={{ 
                  ...sessionIconStyle(isActive), 
                  background: isActive ? 'var(--brand-primary)' : 'var(--bg-main)', 
                  color: isActive ? '#fff' : 'var(--text-tertiary)',
                  width: 32, height: 32, borderRadius: 10
                }}>
                  <MessageCircle size={16} />
                </div>
                {!isCollapsed && (
                  <div style={{ minWidth: 0, flex: 1, textAlign: "left", marginLeft: 4 }}>
                    <div style={{ 
                      ...sessionTitleStyle, 
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontSize: 13,
                      fontWeight: isActive ? 700 : 500
                    }}>{session.title}</div>
                    <div style={{ ...sessionTimestampStyle, fontSize: 10 }}>
                      {new Date(session.updatedAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                    </div>
                  </div>
                )}
              </button>
              {!isCollapsed && (
                <button style={{ ...trashButtonStyle, opacity: isActive ? 1 : 0.4 }} onClick={() => onDeleteChat(session.id)}>
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ ...sidebarFooterStyle, padding: isCollapsed ? '16px 0' : '16px 8px' }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            width: '100%',
            padding: '12px 16px',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            background: 'transparent',
            borderRadius: 4,
            border: 'none',
            color: '#d93025',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            transition: 'all 0.2s ease'
          }}
          onClick={onLogout}
        >
          <LogOut size={18} />
          {!isCollapsed && "Logout Session"}
        </button>
      </div>
    </aside>
  );
};
