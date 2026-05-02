import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";
import {
  modalBackdropStyle, modalCardStyle, modalHeaderStyle, warningIconWrapStyle,
  modalPromptWrapStyle, modalPromptStyle, modalActionsStyle, secondaryActionButton, primaryActionButton
} from "../../styles/theme";

interface ApprovalGatewayProps {
  prompt: string;
  onReject: () => void;
  onApprove: () => void;
}

export const ApprovalGateway: React.FC<ApprovalGatewayProps> = ({ prompt, onReject, onApprove }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={modalBackdropStyle}>
      <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 20 }} style={modalCardStyle}>
        <div style={modalHeaderStyle}>
          <div style={warningIconWrapStyle}><AlertTriangle size={20} color="#f9ab00" /></div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Approval Gateway</div>
            <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>Human intervention required for this high-impact action.</div>
          </div>
        </div>
        <div style={modalPromptWrapStyle}><pre style={modalPromptStyle}>{prompt}</pre></div>
        <div style={modalActionsStyle}>
          <button style={{ ...secondaryActionButton, borderRadius: 14 }} onClick={onReject}><XCircle size={18} />Deny</button>
          <button style={{ ...primaryActionButton, borderRadius: 14, background: 'var(--brand-gradient)', border: 'none', color: '#fff', fontWeight: 800 }} onClick={onApprove}><CheckCircle2 size={18} />Approve</button>
        </div>
      </motion.div>
    </motion.div>
  );
};
