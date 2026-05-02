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
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <h1 style={{ ...pageTitleStyle, color: "var(--text-primary)", fontSize: "16px", fontWeight: 500 }}>{activeTabLabel}</h1>
        
        <div className="vertical-separator" />
        
        <AnimatePresence mode="wait">
          {isThinking ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{ 
                display: "flex", alignItems: "center", gap: 6, fontSize: "11px", 
                color: "var(--brand-primary)", fontWeight: 500,
                background: "var(--brand-light)", padding: "4px 10px", borderRadius: "4px"
              }}
            >
              <Loader2 size={12} className="spin" />
              Thinking...
            </motion.div>
          ) : (
            <div style={{ 
              display: "flex", alignItems: "center", gap: 6, fontSize: "11px", fontWeight: 500, 
              color: connected ? "var(--accent-green)" : "var(--accent-red)", 
              background: connected ? "var(--accent-green-light)" : "var(--accent-red-light)", 
              padding: "4px 10px", borderRadius: "4px", textTransform: "uppercase"
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: connected ? "var(--accent-green)" : "var(--accent-red)" }} />
              {connected ? "System Online" : "Disconnected"}
            </div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        <div className="vertical-separator" />
        
        {/* Notifications */}
        <div style={{ position: "relative" }} ref={notifRef}>
          <button 
            onClick={() => setNotifOpen(!notifOpen)}
            style={{ 
              background: notifOpen ? "var(--border-subtle)" : "none", 
              border: "none", color: notifOpen ? "var(--brand-primary)" : "var(--text-secondary)", 
              cursor: "pointer", position: "relative", padding: 6, borderRadius: "4px",
              transition: "all 0.2s ease",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span style={{ 
                position: "absolute", top: 6, right: 6, width: 8, height: 8, 
                background: "var(--accent-red)", borderRadius: "50%", 
                border: "2px solid #fff"
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
                  position: "absolute", top: "100%", right: 0, width: 320, background: "var(--bg-card)", 
                  borderRadius: 8, boxShadow: "0 1px 3px 0 rgba(60,64,67,.30), 0 4px 8px 3px rgba(60,64,67,.15)", 
                  border: "1px solid var(--border-light)", zIndex: 100, marginTop: 8, overflow: "hidden" 
                }}
              >
                <div style={{ padding: "16px", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-sidebar)" }}>
                  <span style={{ fontWeight: 500, fontSize: "14px", color: "var(--text-primary)" }}>Notifications</span>
                  <span style={{ 
                    fontSize: "11px", fontWeight: 500, color: "var(--brand-primary)", 
                    background: "var(--brand-light)", padding: "2px 8px", borderRadius: 4 
                  }}>{notifications.length} new</span>
                </div>
                <div style={{ maxHeight: 420, overflowY: "auto" }} className="hide-scrollbar">
                  {notifications.length === 0 ? (
                    <div style={{ padding: 60, textAlign: "center", color: "var(--text-tertiary)", fontSize: "14px" }}>
                      <div style={{ marginBottom: 12, opacity: 0.5 }}><Bell size={32} style={{ margin: "0 auto" }} /></div>
                      No new notifications.
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

        <div className="vertical-separator" />

        {/* Profile */}
        <div style={{ position: "relative" }} ref={profileRef}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            style={{ 
              display: "flex", alignItems: "center", gap: 6, background: "transparent", 
              border: "none", padding: "2px 6px", borderRadius: 4, cursor: "pointer",
              transition: "background 0.2s ease"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "var(--border-subtle)"}
            onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
          >
            <div style={{ 
              width: 28, height: 28, borderRadius: "50%", background: "var(--brand-primary)", 
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", 
              fontSize: "12px", fontWeight: 500
            }}>
              {currentUser?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <ChevronDown size={14} color="var(--text-secondary)" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                style={{ 
                  position: "absolute", top: "100%", right: 0, width: 240, background: "var(--bg-card)", 
                  borderRadius: 8, boxShadow: "0 1px 3px 0 rgba(60,64,67,.30), 0 4px 8px 3px rgba(60,64,67,.15)", 
                  border: "1px solid var(--border-light)", zIndex: 100, marginTop: 8, overflow: "hidden",
                  padding: "8px 0"
                }}
              >
                <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-subtle)", marginBottom: 4 }}>
                  <div style={{ fontSize: "12px", fontWeight: 400, color: "var(--text-tertiary)" }}>Signed in as</div>
                  <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis" }}>{currentUser?.email || currentUser?.username}</div>
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
