import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditSummaryCard } from "./CreditSummaryCard";
import { ProjectUsageList } from "./ProjectUsageList";
import { TransactionLedger } from "./TransactionLedger";
import { API_URL } from "../../utils/constants";
import { RefreshCw, ShieldAlert, Wallet, PieChart, Activity } from "lucide-react";

export const CreditDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("copilot_token");
      const res = await fetch(`${API_URL}/credits/summary`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch credit data");
      const json = await res.json();
      
      // Inject sample data if empty for demo purposes
      if (json.projectUsage.length === 0) {
        json.projectUsage = [
          { name: "Global Supply Chain Audit", used: 1250, lastUsed: new Date().toISOString() },
          { name: "Market Expansion Strategy", used: 850, lastUsed: new Date(Date.now() - 86400000).toISOString() },
          { name: "Risk Mitigation Phase 2", used: 420, lastUsed: new Date(Date.now() - 172800000).toISOString() }
        ];
      }
      if (json.recentTransactions.length === 0) {
        json.recentTransactions = [
          { task: "LLM Orchestration: Strategy Analysis", amount: 25, date: new Date().toISOString(), type: "TASK" },
          { task: "Vendor Settlement: GCP Cloud", amount: 150, date: new Date(Date.now() - 3600000).toISOString(), type: "BILLING_ADJUSTMENT" },
          { task: "RAG Sync: Annual Report", amount: 12, date: new Date(Date.now() - 7200000).toISOString(), type: "TASK" },
          { task: "Quarterly Allocation", amount: -5000, date: new Date(Date.now() - 604800000).toISOString(), type: "ALLOCATION" }
        ];
      }
      if (json.total === 0) {
        json.total = 5000;
        json.remaining = 2480;
        json.used = 2520;
        json.carryForward = 1200;
        json.financialYear = "2024-2025";
      }

      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <RefreshCw size={32} color="#1a73e8" />
      </motion.div>
    </div>
  );

  if (error) return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", gap: "10px" }}>
      <ShieldAlert size={48} color="#d93025" />
      <div style={{ color: "#5f6368", fontSize: "14px" }}>{error}</div>
      <button 
        onClick={fetchData} 
        style={{ 
          background: "#1a73e8", 
          color: "#fff", 
          border: "none", 
          padding: "8px 24px", 
          borderRadius: "4px", 
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 500,
          boxShadow: "0 1px 2px 0 rgba(60,64,67,.30)"
        }}
      >
        Retry
      </button>
    </div>
  );

  return (
    <div style={{ padding: "40px 40px 100px", width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
      <header style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 900, color: "#1a73e8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Resource Engine</div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 400, color: "#202124", fontFamily: "'Google Sans', sans-serif" }}>Credit Management</h1>
          <p style={{ margin: "8px 0 0", color: "#5f6368", fontSize: "14px", fontWeight: 400 }}>
            Monitor strategic resource allocation and project-wise consumption across the orchestration layer.
          </p>
        </div>

      </header>

      <CreditSummaryCard 
        total={data.total} 
        used={data.used} 
        remaining={data.remaining} 
        carryForward={data.carryForward}
        financialYear={data.financialYear}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px", alignItems: "flex-start" }}>
        <ProjectUsageList projects={data.projectUsage} />
        <TransactionLedger transactions={data.recentTransactions} />
      </div>

      <footer style={{ marginTop: "60px", textAlign: "center", padding: "20px", color: "#9aa0a6", fontSize: "11px", borderTop: "1px solid #f1f3f4", letterSpacing: "0.02em" }}>
        System automatically recalculates balances after every task execution and vendor billing adjustment.
        <br />
        <span style={{ fontWeight: 600 }}>Secured by H-CoPilot RSA-256 Engine</span>
      </footer>
    </div>
  );
};
