import React from "react";
import { motion } from "framer-motion";
import { ListChecks, ArrowDownCircle, ArrowUpCircle, RefreshCcw, History } from "lucide-react";

interface Transaction {
  task: string;
  amount: number;
  date: string;
  type: string;
  details?: string;
}

interface Props {
  transactions: Transaction[];
}

export const TransactionLedger: React.FC<Props> = ({ transactions }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "BILLING_ADJUSTMENT": return <ArrowDownCircle size={14} />;
      case "ALLOCATION": return <ArrowUpCircle size={14} />;
      case "CARRY_FORWARD": return <RefreshCcw size={14} />;
      default: return <ListChecks size={14} />;
    }
  };

  const getStyle = (type: string) => {
    switch (type) {
      case "BILLING_ADJUSTMENT": return { color: "var(--accent-red)", bg: "var(--accent-red-light)" };
      case "ALLOCATION": return { color: "var(--accent-green)", bg: "var(--accent-green-light)" };
      case "CARRY_FORWARD": return { color: "#f9ab00", bg: "#fffbeb" };
      default: return { color: "var(--brand-primary)", bg: "var(--brand-light)" };
    }
  };

  const getLabel = (type: string) => {
    return type.replace("_", " ").toLowerCase();
  };

  return (
    <div style={{ 
      background: "var(--bg-main)", 
      borderRadius: "8px", 
      padding: "24px",
      border: "1px solid var(--border-light)",
      boxShadow: "0 1px 2px 0 rgba(60,64,67,.30)",
      height: "100%"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <div style={{ background: "var(--bg-subtle)", padding: "8px", borderRadius: "4px", color: "var(--text-secondary)", border: "1px solid var(--border-light)" }}>
          <History size={18} />
        </div>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 500, color: "var(--text-primary)", fontFamily: "'Google Sans', sans-serif" }}>Audit Trail</h3>
      </div>
      
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border-subtle)" }}>
              <th style={{ padding: "12px", fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Description</th>
              <th style={{ padding: "12px", fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Pool Trace</th>
              <th style={{ padding: "12px", fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Category</th>
              <th style={{ padding: "12px", fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Timestamp</th>
              <th style={{ padding: "12px", fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "var(--text-tertiary)", padding: "80px 20px", fontSize: "13px" }}>
                  No transaction history available.
                </td>
              </tr>
            ) : (
              transactions.map((tx, i) => {
                const style = getStyle(tx.type);
                return (
                  <motion.tr
                    key={`${tx.task}-${tx.date}-${i}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      borderBottom: "1px solid var(--border-subtle)",
                      transition: "background 0.2s ease"
                    }}
                  >
                    <td style={{ padding: "16px 12px", fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>
                      {tx.task}
                    </td>
                    <td style={{ padding: "16px 12px", fontSize: "11px", color: "var(--text-secondary)", fontStyle: "italic", maxWidth: "200px" }}>
                      {tx.details || "System Allocation"}
                    </td>
                    <td style={{ padding: "16px 12px" }}>
                      <div style={{ 
                        display: "inline-flex", 
                        alignItems: "center", 
                        gap: "6px", 
                        fontSize: "10px", 
                        fontWeight: 800,
                        padding: "4px 8px",
                        borderRadius: "4px",
                        background: style.bg,
                        color: style.color,
                        textTransform: "uppercase",
                        letterSpacing: "0.02em"
                      }}>
                        {getIcon(tx.type)}
                        {getLabel(tx.type)}
                      </div>
                    </td>
                    <td style={{ padding: "16px 12px", fontSize: "12px", color: "var(--text-secondary)" }}>
                      {new Date(tx.date).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td style={{ 
                      padding: "16px 12px", 
                      textAlign: "right", 
                      fontWeight: 500, 
                      fontSize: "14px",
                      color: tx.amount > 0 ? "var(--accent-red)" : "var(--accent-green)",
                      fontFamily: "'Google Sans', sans-serif"
                    }}>
                      {tx.amount > 0 ? "-" : "+"}{Math.abs(tx.amount).toLocaleString()}
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
