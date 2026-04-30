import React from "react";
import { motion } from "framer-motion";
import { Wallet, PieChart, ArrowUpRight, History } from "lucide-react";

interface CreditSummaryProps {
  total: number;
  used: number;
  remaining: number;
  carryForward: number;
  financialYear: string;
}

export const CreditSummaryCard: React.FC<CreditSummaryProps> = ({ 
  total, used, remaining, carryForward, financialYear 
}) => {
  const cards = [
    { title: "Allocated Credits", value: total, icon: Wallet, color: "#1a73e8", sub: financialYear, desc: "Annual Budget" },
    { title: "Used Credits", value: used, icon: PieChart, color: "#d93025", sub: "Consumption", desc: "Total Usage" },
    { title: "Available Balance", value: remaining, icon: ArrowUpRight, color: "#188038", sub: "Live", desc: "Current Liquidity" },
    { title: "Carry Forward", value: carryForward, icon: History, color: "#f9ab00", sub: "Previous Year", desc: "Rollover Amount" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginBottom: "40px" }}>
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "8px",
            border: "1px solid #dadce0",
            boxShadow: "0 1px 2px 0 rgba(60,64,67,.30)",
            display: "flex",
            flexDirection: "column",
            gap: 16
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ background: `${card.color}10`, padding: "10px", borderRadius: "4px", color: card.color }}>
              <card.icon size={20} />
            </div>
            <span style={{ 
              fontSize: "10px", 
              color: card.color, 
              fontWeight: 800, 
              background: `${card.color}15`, 
              padding: "4px 8px", 
              borderRadius: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.02em"
            }}>
              {card.sub}
            </span>
          </div>
          
          <div>
            <div style={{ fontSize: "13px", color: "#5f6368", marginBottom: 4, fontWeight: 400 }}>{card.title}</div>
            <div style={{ fontSize: "28px", fontWeight: 400, color: "#202124", fontFamily: "'Google Sans', sans-serif" }}>
              {card.value.toLocaleString()}
            </div>
            <div style={{ fontSize: "11px", color: "#9aa0a6", marginTop: 4 }}>{card.desc}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
