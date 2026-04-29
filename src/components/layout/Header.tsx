import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Bell, User, X, FileText, Wifi, WifiOff, LogOut, Settings, ChevronDown } from "lucide-react";
import { pageTitleStyle } from "../../styles/theme";
import { useClickOutside } from "../../hooks/useClickOutside";

interface HeaderProps {
  activeTabLabel: string;
  isThinking: boolean;
  connected: boolean;
  notifications: any[];
  onNotificationAction: (id: number, action: string) => void;
  currentUser: any;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTabLabel, 
  isThinking, 
  connected,
  notifications, 
  onNotificationAction,
  currentUser 
}) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useClickOutside(() => setNotifOpen(false));
  const profileRef = useClickOutside(() => setProfileOpen(false));

  return (
    <header className="main-header">
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <h1 style={{ ...pageTitleStyle, color: "var(--text-primary)" }}>{activeTabLabel}</h1>
        <AnimatePresence>
          {isThinking && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.9 }}
              className="thinking-badge"
              style={{ 
                display: "flex", alignItems: "center", gap: 8, fontSize: "12px", 
                color: "var(--brand-primary)", fontWeight: 700,
                background: "var(--brand-light)", padding: "6px 14px", borderRadius: "99px",
                border: "1px solid rgba(109, 40, 217, 0.1)"
              }}
            >
              <Loader2 size={14} className="spin" />
              Agent Cognition...
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {/* Connection Badge */}
        <div style={{ 
          display: "flex", alignItems: "center", gap: 6, fontSize: "10px", fontWeight: 900, 
          color: connected ? "var(--accent-green)" : "var(--accent-red)", 
          background: connected ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", 
          padding: "5px 12px", borderRadius: "8px", textTransform: "uppercase", 
          letterSpacing: "0.05em", border: `1px solid ${connected ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}`
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: connected ? "var(--accent-green)" : "var(--accent-red)", animation: connected ? "pulse 2s infinite" : "none" }} />
          {connected ? "Live" : "Offline"}
        </div>

        {/* Notifications */}
        <div style={{ position: "relative" }} ref={notifRef}>
          <button 
            onClick={() => setNotifOpen(!notifOpen)}
            style={{ 
              background: notifOpen ? "var(--brand-light)" : "none", 
              border: "none", color: notifOpen ? "var(--brand-primary)" : "var(--text-secondary)", 
              cursor: "pointer", position: "relative", padding: 8, borderRadius: "12px",
              transition: "all 0.2s ease"
            }}
          >
            <Bell size={22} />
            {notifications.length > 0 && (
              <span style={{ 
                position: "absolute", top: 8, right: 8, width: 10, height: 10, 
                background: "var(--accent-red)", borderRadius: "50%", 
                border: "2px solid #fff", boxShadow: "0 0 10px rgba(220, 38, 38, 0.4)" 
              }} />
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 15, scale: 0.95, filter: "blur(4px)" }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                style={{ 
                  position: "absolute", top: "100%", right: 0, width: 340, background: "#fff", 
                  borderRadius: 24, boxShadow: "0 20px 50px rgba(109, 40, 217, 0.12)", 
                  border: "1px solid var(--border-light)", zIndex: 100, marginTop: 16, overflow: "hidden" 
                }}
              >
                <div style={{ padding: "20px", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
                  <span style={{ fontWeight: 800, fontSize: "15px", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>Intelligence Feed</span>
                  <span style={{ 
                    fontSize: "11px", fontWeight: 700, color: "var(--brand-primary)", 
                    background: "var(--brand-light)", padding: "4px 10px", borderRadius: 99 
                  }}>{notifications.length} Unread</span>
                </div>
                <div style={{ maxHeight: 420, overflowY: "auto" }} className="hide-scrollbar">
                  {notifications.length === 0 ? (
                    <div style={{ padding: 60, textAlign: "center", color: "var(--text-tertiary)", fontSize: "14px" }}>
                      <div style={{ marginBottom: 12, opacity: 0.5 }}><Bell size={32} style={{ margin: "0 auto" }} /></div>
                      No new intelligence.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} style={{ padding: 20, borderBottom: "1px solid var(--bg-main)", transition: "background 0.2s" }} className="notif-item">
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: 6 }}>{n.title}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 16 }}>{n.summary?.slice(0, 90)}...</div>
                        <div style={{ display: "flex", gap: 10 }}>
                          <button 
                            onClick={() => onNotificationAction(n.id, "make_rfp")}
                            style={{ 
                              flex: 1, padding: "8px", borderRadius: 10, background: "var(--brand-gradient)", 
                              color: "#fff", border: "none", fontSize: "12px", fontWeight: 700, 
                              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", 
                              gap: 6, boxShadow: "0 4px 12px rgba(109, 40, 217, 0.2)"
                            }}
                          >
                            <FileText size={14} /> Draft RFP
                          </button>
                          <button 
                            onClick={() => onNotificationAction(n.id, "reject")}
                            style={{ 
                              padding: "8px 12px", borderRadius: 10, background: "var(--bg-main)", 
                              color: "var(--text-secondary)", border: "1px solid var(--border-light)", 
                              fontSize: "12px", fontWeight: 600, cursor: "pointer" 
                            }}
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div style={{ position: "relative" }} ref={profileRef}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            style={{ 
              display: "flex", alignItems: "center", gap: 10, background: "rgba(248, 250, 252, 0.8)", 
              border: `1px solid ${profileOpen ? "var(--brand-primary)" : "var(--border-light)"}`, 
              padding: "4px 12px 4px 4px", borderRadius: "12px", cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: profileOpen ? "0 4px 12px rgba(79, 70, 229, 0.08)" : "none"
            }}
          >
            <div style={{ 
              width: 32, height: 32, borderRadius: "10px", background: "var(--brand-gradient)", 
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", 
              fontSize: "13px", fontWeight: 900, boxShadow: "0 4px 10px rgba(79, 70, 229, 0.25)"
            }}>
              {currentUser?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0 }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>{currentUser?.username || "Guest"}</span>
              <span style={{ fontSize: "9px", fontWeight: 800, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.02em" }}>{currentUser?.role || "Observer"}</span>
            </div>
            <ChevronDown size={12} color="var(--text-tertiary)" style={{ marginLeft: 2, transform: profileOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                style={{ 
                  position: "absolute", top: "100%", right: 0, width: 220, background: "#fff", 
                  borderRadius: 20, boxShadow: "0 20px 50px rgba(109, 40, 217, 0.12)", 
                  border: "1px solid var(--border-light)", zIndex: 100, marginTop: 12, overflow: "hidden",
                  padding: 8
                }}
              >
                <div style={{ padding: "12px", borderBottom: "1px solid var(--bg-main)", marginBottom: 4 }}>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-tertiary)" }}>Signed in as</div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis" }}>{currentUser?.email || currentUser?.username}</div>
                </div>
                <button style={dropdownItemStyle}><Settings size={16} /> Account Settings</button>
                <button style={{ ...dropdownItemStyle, color: "var(--accent-red)" }}><LogOut size={16} /> Sign Out</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

const dropdownItemStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 12,
  background: "transparent",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 12,
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--text-secondary)",
  transition: "all 0.2s ease"
};
