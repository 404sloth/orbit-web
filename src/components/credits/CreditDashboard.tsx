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
        <RefreshCw size={32} color="var(--brand-primary)" />
      </motion.div>
    </div>
  );

  if (error) return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", gap: "10px" }}>
      <ShieldAlert size={48} color="var(--accent-red)" />
      <div style={{ color: "var(--text-secondary)", fontSize: "14px" }}>{error}</div>
      <button 
        onClick={fetchData} 
        style={{ 
          background: "var(--brand-primary)", 
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

  const hasProjects = data && data.projectUsage && data.projectUsage.length > 0;

  return (
    <div style={{ padding: "40px 40px 100px", width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
      <header style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 900, color: "var(--brand-primary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Financial Operations</div>
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 400, color: "var(--text-primary)", fontFamily: "'Google Sans', sans-serif" }}>Billing & Credits</h1>
          <p style={{ margin: "8px 0 0", color: "var(--text-secondary)", fontSize: "14px", fontWeight: 400 }}>
            Monitor resource allocation and project-level consumption across the platform.
          </p>
        </div>
      </header>

      {hasProjects ? (
        <>
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
        </>
      ) : (
        <div style={{ 
          background: "var(--bg-main)", 
          borderRadius: "8px", 
          padding: "80px 40px", 
          textAlign: "center", 
          border: "1px dashed var(--border-light)",
          marginTop: "20px"
        }}>
          <PieChart size={48} color="var(--border-light)" style={{ marginBottom: "16px" }} />
          <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: 500, color: "var(--text-primary)" }}>No Managed Projects</h3>
          <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "14px" }}>
            You don't have any projects yet to manage. Billing data will appear once project activities commence.
          </p>
        </div>
      )}
    </div>
  );
};
