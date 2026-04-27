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
        background: "#ffffff",
        borderRight: "1px solid var(--border-light)",
        boxShadow: "10px 0 30px rgba(217, 119, 6, 0.02)",
        ...(isCollapsed ? { width: 88, padding: "24px 14px 16px" } : {}),
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
          width: isCollapsed ? 42 : 48, 
          height: isCollapsed ? 42 : 48, 
          background: 'var(--brand-gradient)',
          borderRadius: 18,
          boxShadow: '0 8px 20px rgba(109, 40, 217, 0.25)'
        }}>
          <Sparkles size={isCollapsed ? 20 : 24} color="#fff" />
        </div>
        {!isCollapsed && (
          <div style={{ marginLeft: 4 }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
              Orbit
            </div>
            <div style={{ fontSize: 9, fontWeight: 800, color: "var(--brand-primary)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Executive AI
            </div>
          </div>
        )}
      </div>

      <button
        style={{
          ...primaryPillButton,
          padding: isCollapsed ? "14px" : "16px 24px",
          justifyContent: isCollapsed ? "center" : "flex-start",
          background: 'var(--brand-gradient)',
          color: '#fff',
          border: 'none',
          borderRadius: 20,
          boxShadow: '0 10px 25px rgba(109, 40, 217, 0.3)',
          marginBottom: 32
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
          background: "#fff",
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
                padding: isCollapsed ? "12px 0" : "12px 18px",
                color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--brand-light)' : 'transparent',
                borderRadius: 14,
                transition: 'all 0.2s ease',
                fontWeight: isActive ? 800 : 600
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
        {!isCollapsed && <div style={{ ...sectionLabelStyle, color: 'var(--text-tertiary)', fontSize: 10, fontWeight: 800 }}>Recent Intelligence</div>}
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
            background: 'rgba(220, 38, 38, 0.05)',
            borderRadius: 14,
            border: 'none',
            color: 'var(--accent-red)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 700,
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
