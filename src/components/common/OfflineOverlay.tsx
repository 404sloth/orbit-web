import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff } from "lucide-react";
import { offlineOverlayStyle } from "../../styles/theme";

interface OfflineOverlayProps {
  connected: boolean;
  onRetry?: () => void;
}

export const OfflineOverlay: React.FC<OfflineOverlayProps> = ({ connected, onRetry }) => {
  return (
    <AnimatePresence>
      {!connected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={offlineOverlayStyle}
        >
          <div style={{ position: "relative" }}>
            <div
              className="pulse"
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "rgba(239,68,68,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <WifiOff size={32} color="#ef4444" />
            </div>
          </div>
          <div style={{ textAlign: "center", maxWidth: 400 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1e293b", marginBottom: 8 }}>System Offline</h2>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
              Synchronization with core intelligence lost. Please check your network or re-establish connection.
            </p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              style={{
                padding: "12px 32px",
                background: "#6366f1",
                color: "#fff",
                borderRadius: 99,
                fontSize: 14,
                fontWeight: 700,
                boxShadow: "0 8px 16px rgba(99,102,241,0.3)",
                border: "none",
                cursor: "pointer"
              }}
            >
              Re-establish Connection
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
