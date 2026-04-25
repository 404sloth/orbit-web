import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Bell, User, X, FileText, Wifi, WifiOff } from "lucide-react";
import { pageTitleStyle } from "../../styles/theme";

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

  return (
    <header className="main-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 24px", height: "64px", background: "#fff", borderBottom: "1px solid #f1f5f9" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <h1 style={pageTitleStyle}>{activeTabLabel}</h1>
        {isThinking ? (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="thinking-badge"
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "12px", color: "#6366f1", fontWeight: 600 }}
          >
            <Loader2 size={14} className="spin" />
            Thinking...
          </motion.div>
        ) : null}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Connection Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "11px", fontWeight: 700, color: connected ? "#10b981" : "#ef4444", background: connected ? "#f0fdf4" : "#fef2f2", padding: "4px 10px", borderRadius: "99px" }}>
          {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
          {connected ? "Active" : "Offline"}
        </div>

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button 
            onClick={() => setNotifOpen(!notifOpen)}
            style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", position: "relative", padding: 4 }}
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, background: "#ef4444", borderRadius: "50%", border: "2px solid #fff" }} />
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                style={{ 
                  position: "absolute", top: "100%", right: 0, width: 320, background: "#fff", 
                  borderRadius: 16, boxShadow: "0 10px 40px rgba(0,0,0,0.1)", border: "1px solid #f1f5f9", 
                  zIndex: 100, marginTop: 12, overflow: "hidden" 
                }}
              >
                <div style={{ padding: "16px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, fontSize: "14px", color: "#1e293b" }}>Notifications</span>
                  <span style={{ fontSize: "11px", color: "#64748b", background: "#f1f5f9", padding: "2px 8px", borderRadius: 99 }}>{notifications.length} Pending</span>
                </div>
                <div style={{ maxHeight: 400, overflowY: "auto" }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
                      All caught up!
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} style={{ padding: 16, borderBottom: "1px solid #f8fafc", transition: "background 0.2s" }} className="notif-item">
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b", marginBottom: 4 }}>{n.title}</div>
                        <div style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.4, marginBottom: 12 }}>{n.summary?.slice(0, 80)}...</div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button 
                            onClick={() => onNotificationAction(n.id, "make_rfp")}
                            style={{ flex: 1, padding: "6px", borderRadius: 8, background: "#6366f1", color: "#fff", border: "none", fontSize: "11px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
                          >
                            <FileText size={12} /> Make RFP
                          </button>
                          <button 
                            onClick={() => onNotificationAction(n.id, "reject")}
                            style={{ padding: "6px 10px", borderRadius: 8, background: "#f1f5f9", color: "#64748b", border: "none", fontSize: "11px", fontWeight: 600, cursor: "pointer" }}
                          >
                            Reject
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
        <div style={{ position: "relative" }}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            style={{ display: "flex", alignItems: "center", gap: 10, background: "#f8fafc", border: "1px solid #e2e8f0", padding: "4px 12px 4px 4px", borderRadius: 99, cursor: "pointer" }}
          >
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#6366f1", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700 }}>
              {currentUser?.name?.charAt(0) || "U"}
            </div>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{currentUser?.name || "User"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
