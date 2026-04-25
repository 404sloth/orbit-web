import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timeout = window.setTimeout(onClose, 4000);
    return () => window.clearTimeout(timeout);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      style={{
        position: "fixed",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 20px",
        borderRadius: 40,
        background: type === "success" ? "#1e8e3e" : "#d93025",
        color: "#fff",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        backdropFilter: "blur(12px)",
      }}
    >
      {type === "success" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
      <span style={{ fontSize: 13, fontWeight: 600 }}>{message}</span>
    </motion.div>
  );
};
