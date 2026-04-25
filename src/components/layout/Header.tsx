import React from "react";
import { motion } from "framer-motion";
import { Loader2, Wifi, WifiOff } from "lucide-react";
import { pageTitleStyle } from "../../styles/theme";

interface HeaderProps {
  activeTabLabel: string;
  isThinking: boolean;
  connected: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTabLabel, isThinking, connected }) => {
  return (
    <header className="main-header">
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <h1 style={pageTitleStyle}>{activeTabLabel}</h1>
        {isThinking ? (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="thinking-badge"
          >
            <Loader2 size={14} className="spin" />
            Thinking...
          </motion.div>
        ) : null}
      </div>
      <div className={`connection-badge ${connected ? "active" : "offline"}`}>
        {connected ? <Wifi size={14} /> : <WifiOff size={14} />}
        {connected ? "Active" : "Offline"}
      </div>
    </header>
  );
};
