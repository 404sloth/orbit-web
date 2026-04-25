import React from "react";
import { motion } from "framer-motion";
import { WifiOff } from "lucide-react";
import { offlineOverlayStyle } from "../../styles/theme";

interface OfflineOverlayProps {
  onRetry: () => void;
}

export const OfflineOverlay: React.FC<OfflineOverlayProps> = ({ onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={offlineOverlayStyle}
    >
      <div style={{ position: "relative" }}>
        <div
          className="pulse"
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(26,115,232,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <WifiOff size={32} color="#1a73e8" />
        </div>
      </div>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#202124", marginBottom: 8 }}>System Recalibration</h2>
        <p style={{ fontSize: 14, color: "#5f6368", lineHeight: 1.6 }}>
          Lost synchronization with core intelligence. Attempting to restore secure channel...
        </p>
      </div>
      <button
        onClick={onRetry}
        style={{
          padding: "12px 32px",
          background: "#1a73e8",
          color: "#fff",
          borderRadius: 99,
          fontSize: 14,
          fontWeight: 700,
          boxShadow: "0 8px 16px rgba(26,115,232,0.3)",
        }}
      >
        Re-establish Connection
      </button>
    </motion.div>
  );
};
