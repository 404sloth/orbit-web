import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  AlertTriangle,
  UserMinus,
  CheckCircle2,
  Filter,
  Search,
  ArrowUpRight,
  ShieldAlert,
  History,
  Lock,
  ExternalLink,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { API_URL } from "../../utils/constants";

interface AccessGap {
  id: string;
  user: {
    name: string;
    role: string;
    avatar: string;
  };
  permission: string;
  project: string;
  reason: string;
  severity: "high" | "medium" | "low";
  lastActive: string;
  status: "flagged" | "resolved" | "ignored";
}

export const AccessAudit: React.FC = () => {
  const [gaps, setGaps] = useState<AccessGap[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "high" | "resolved">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGapId, setSelectedGapId] = useState<string | null>(null);

  const selectedGap = gaps.find((g) => g.id === selectedGapId);

  const fetchGaps = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(`${API_URL}/audit/access-gaps`);
      const data = await response.json();
      setGaps(data);
    } catch (error) {
      console.error("Failed to fetch access gaps:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGaps();
  }, []);

  const filteredGaps = React.useMemo(() => {
    return gaps
      .filter((gap) => {
        if (activeFilter === "high") return gap.severity === "high";
        if (activeFilter === "resolved") return gap.status === "resolved";
        return true;
      })
      .filter(
        (gap) =>
          gap.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          gap.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
          gap.permission.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [gaps, activeFilter, searchTerm]);

  // --- Dynamic KPIs derived purely from API data ---
  const highSeverityCount = gaps.filter((g) => g.severity === "high").length;
  const integrityPercentage = gaps.length
    ? ((gaps.length - highSeverityCount) / gaps.length) * 100
    : 100;

  const kpis = [
    {
      label: "Redundant Access",
      val: highSeverityCount.toString(),
      sub: `Across ${new Set(gaps.map((g) => g.project)).size} projects`,
      icon: AlertTriangle,
      color: "#d93025",
    },
    {
      label: "Stale Permissions",
      val: gaps.length.toString(),
      sub: "Awaiting remediation",
      icon: History,
      color: "#1a73e8",
    },
    {
      label: "System Integrity",
      val: `${integrityPercentage.toFixed(1)}%`,
      sub: "Target: 100%",
      icon: ShieldCheck,
      color: "#188038",
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-main)",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={40} color="var(--brand-primary)" />
        </motion.div>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "40px 20px",
        background: "var(--bg-main)",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* ---------- Header ---------- */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, padding: "0 20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 0,
              background: "#ffffff",
              padding: "8px 16px",
              borderRadius: "12px",
              border: "1px solid #dadce0",
              boxShadow: "0 1px 2px 0 rgba(60,64,67,.30)",
              width: "fit-content",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 10, fontWeight: 500, color: "#1a73e8", textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1 }}>Security</div>
              <h1 style={{ fontSize: 16, fontWeight: 500, color: "#202124", margin: 0, fontFamily: "'Google Sans', sans-serif" }}>Access Guard</h1>
            </div>

            <div style={{ width: 1, height: 24, background: "#dadce0", margin: "0 16px" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#188038" }} />
              <span style={{ fontSize: 12, color: "#5f6368", fontWeight: 400 }}>Monitoring Active</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div
              style={{
                background: "#fff",
                border: "1px solid #dadce0",
                borderRadius: 4,
                padding: "0 12px",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 1px 2px 0 rgba(60,64,67,.30)",
              }}
            >
              <Search size={16} color="#5f6368" />
              <input
                type="text"
                placeholder="Search anomalies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  padding: "8px 0",
                  fontSize: 13,
                  fontWeight: 400,
                  width: 200,
                  background: "transparent",
                  color: "#202124",
                }}
              />
            </div>
            <button
              onClick={fetchGaps}
              style={{
                background: "#fff",
                border: "1px solid #dadce0",
                borderRadius: 4,
                width: 32,
                height: 32,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 1px 2px 0 rgba(60,64,67,.30)",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "#f1f3f4"}
              onMouseOut={(e) => e.currentTarget.style.background = "#fff"}
            >
              <motion.div
                animate={refreshing ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ display: "flex", alignItems: "center" }}
              >
                <RefreshCw size={16} color="#5f6368" />
              </motion.div>
            </button>
          </div>
        </div>

        {/* ---------- KPI Cards ---------- */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
            marginBottom: 32,
            padding: "0 20px",
          }}
        >
          {kpis.map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: "#fff",
                padding: "16px",
                borderRadius: 8,
                border: "1px solid #dadce0",
                boxShadow: "0 1px 2px 0 rgba(60,64,67,.30)",
                display: "flex",
                flexDirection: "column",
                gap: 12
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ background: `${kpi.color}10`, padding: 8, borderRadius: 4 }}>
                  <kpi.icon color={kpi.color} size={20} />
                </div>
                <div style={{ fontSize: 10, fontWeight: 500, color: "#188038", background: "#e6f4ea", padding: "2px 8px", borderRadius: 4 }}>Live</div>
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 500, color: "#202124", letterSpacing: "-0.01em" }}>{kpi.val}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#202124", marginTop: 4 }}>{kpi.label}</div>
                <div style={{ fontSize: 11, color: "#5f6368", marginTop: 2 }}>{kpi.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ---------- Main Content Card ---------- */}
        <div style={{ 
          padding: "0 20px 60px",
        }}>
          {/* Table Card */}
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: "#fff",
              borderRadius: 8,
              border: "1px solid #dadce0",
              overflow: "hidden",
              boxShadow: "0 1px 2px 0 rgba(60,64,67,.30)",
            }}
          >
            {/* Filter bar */}
            <div
              style={{
                padding: "8px 24px",
                borderBottom: "1px solid #dadce0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
                background: "#f8f9fa",
              }}
            >
              <div style={{ display: "flex", gap: 32 }}>
                {(["all", "high", "resolved"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: "12px 4px",
                      fontSize: 12,
                      fontWeight: 800,
                      color:
                        activeFilter === f
                          ? "var(--brand-primary)"
                          : "var(--text-tertiary)",
                      cursor: "pointer",
                      position: "relative",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      transition: "color 0.2s",
                    }}
                  >
                    {f === "all"
                      ? "All Findings"
                      : f === "high"
                        ? "High Risk"
                        : "Resolved"}
                    {activeFilter === f && (
                      <motion.div
                        layoutId="activeFilter"
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: 3,
                          background: "var(--brand-primary)",
                          borderRadius: "3px 3px 0 0",
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "#5f6368",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#fff",
                  padding: "4px 12px",
                  borderRadius: 4,
                  border: "1px solid #dadce0"
                }}
              >
                <Filter size={14} color="#1a73e8" />
                <span>Monitoring <strong style={{ color: "#202124" }}>{filteredGaps.length}</strong> Anomalies</span>
              </div>
            </div>

            {/* Table area */}
            <div style={{ padding: "0 40px", overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "separate",
                  borderSpacing: "0 16px",
                }}
              >
                <thead>
                  <tr style={{ textAlign: "left" }}>
                    <th
                      style={{
                        padding: "16px 12px 8px 24px",
                        fontSize: 10,
                        fontWeight: 900,
                        color: "var(--text-tertiary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        width: "25%",
                      }}
                    >
                      User
                    </th>
                    <th
                      style={{
                        padding: "16px 12px 8px",
                        fontSize: 10,
                        fontWeight: 900,
                        color: "var(--text-tertiary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        width: "30%",
                      }}
                    >
                      Access Scope
                    </th>
                    <th
                      style={{
                        padding: "16px 12px 8px",
                        fontSize: 10,
                        fontWeight: 900,
                        color: "var(--text-tertiary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        width: "15%",
                        textAlign: "center"
                      }}
                    >
                      Risk
                    </th>
                    <th
                      style={{
                        padding: "16px 12px 8px",
                        fontSize: 10,
                        fontWeight: 900,
                        color: "var(--text-tertiary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        width: "15%",
                        textAlign: "center"
                      }}
                    >
                      Last Sync
                    </th>
                    <th
                      style={{
                        padding: "16px 24px 8px 12px",
                        fontSize: 10,
                        fontWeight: 900,
                        color: "var(--text-tertiary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        textAlign: "right",
                        width: "15%",
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="wait">
                    {filteredGaps.map((gap, i) => (
                      <motion.tr
                        key={gap.id}
                        onClick={() => setSelectedGapId(selectedGapId === gap.id ? null : gap.id)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          background: selectedGapId === gap.id ? "#e8f0fe" : "transparent",
                          cursor: "pointer",
                          borderBottom: "1px solid #f1f3f4",
                          transition: "background 0.2s"
                        }}
                        onMouseOver={(e) => { if (selectedGapId !== gap.id) e.currentTarget.style.background = "#f8f9fa"; }}
                        onMouseOut={(e) => { if (selectedGapId !== gap.id) e.currentTarget.style.background = "transparent"; }}
                      >
                        <td style={{ padding: "16px 12px 16px 24px", borderRadius: "18px 0 0 18px" }}>
                          <div
                            style={{ display: "flex", alignItems: "center", gap: 16 }}
                          >
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 4,
                                background: "#f1f3f4",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 12,
                                fontWeight: 500,
                                color: "#1a73e8",
                              }}
                            >
                              {gap.user.avatar}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 500, color: "#202124", marginBottom: 2 }}>
                                {gap.user.name}
                              </div>
                              <div style={{ fontSize: 11, color: "#5f6368" }}>
                                {gap.user.role}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "16px 12px" }}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 8,
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                fontSize: 13,
                                fontWeight: 800,
                                color: "var(--text-primary)",
                              }}
                            >
                              <div
                                style={{
                                  background: "var(--brand-light)",
                                  padding: 6,
                                  borderRadius: 8,
                                }}
                              >
                                <Lock size={14} color="var(--brand-primary)" />
                              </div>
                              {gap.permission}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "var(--text-secondary)",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                paddingLeft: 30,
                              }}
                            >
                              Scope:{" "}
                              <span
                                style={{
                                  color: "var(--brand-primary)",
                                  fontWeight: 800,
                                }}
                              >
                                {gap.project}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "16px 12px", textAlign: "center" }}>
                          <span
                            style={{
                              padding: "4px 10px",
                              borderRadius: 8,
                              fontSize: 10,
                              fontWeight: 900,
                              textTransform: "uppercase",
                              letterSpacing: "0.03em",
                              background:
                                gap.severity === "high"
                                  ? "#fee2e2"
                                  : gap.severity === "medium"
                                    ? "#fef3c7"
                                    : "#d1fae5",
                              color:
                                gap.severity === "high"
                                  ? "#ef4444"
                                  : gap.severity === "medium"
                                    ? "#d97706"
                                    : "#10b981",
                            }}
                          >
                            {gap.severity}
                          </span>
                        </td>
                        <td style={{ padding: "16px 12px", textAlign: "center" }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-tertiary)" }}>
                            {gap.lastActive}
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "16px 24px 16px 12px",
                            textAlign: "right",
                            borderRadius: "0 18px 18px 0",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: 10,
                              justifyContent: "flex-end",
                            }}
                          >
                            <button
                               onClick={(e) => { e.stopPropagation(); }}
                               style={{
                                 padding: "4px 12px",
                                 borderRadius: 4,
                                 background: "#fff",
                                 border: "1px solid #dadce0",
                                 color: "#5f6368",
                                 fontSize: 11,
                                 fontWeight: 500,
                                 cursor: "pointer",
                                 display: "flex",
                                 alignItems: "center",
                                 gap: 4,
                                 transition: "all 0.2s"
                               }}
                               onMouseOver={(e) => { e.currentTarget.style.background = "#f1f3f4"; e.currentTarget.style.color = "#d93025"; }}
                               onMouseOut={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#5f6368"; }}
                            >
                              <UserMinus size={14} /> Revoke
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {filteredGaps.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    padding: "80px 0",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "#e6f4ea",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 24px",
                    }}
                  >
                    <CheckCircle2 color="#188038" size={32} />
                  </div>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 500,
                      color: "#202124",
                      marginBottom: 8,
                      fontFamily: "'Google Sans', sans-serif"
                    }}
                  >
                    Security Perimeter Integrity Confirmed
                  </h3>
                  <p
                    style={{
                      color: "#5f6368",
                      fontSize: 14,
                      fontWeight: 400,
                      maxWidth: 420,
                      margin: "0 auto",
                    }}
                  >
                    No redundant access permissions detected. All privilege
                    assignments align with current project lifecycle states.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer legend */}
            <div
              style={{
                padding: "22px 40px",
                background: "var(--bg-main)",
                borderTop: "1px solid var(--border-light)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--text-tertiary)",
                }}
              >
                System:{" "}
                <span style={{ color: "var(--brand-primary)", fontWeight: 700 }}>
                  Orbit Guard v2.4
                </span>{" "}
                | Last sync: Just now
              </div>
              <div style={{ display: "flex", gap: 20 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#ef4444",
                    }}
                  />{" "}
                  High Risk
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#f59e0b",
                    }}
                  />{" "}
                  Medium Risk
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--text-secondary)",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#10b981",
                    }}
                  />{" "}
                  Low Risk
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detail Modal Overlay */}
        <AnimatePresence>
          {selectedGap && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                padding: 20
              }}
              onClick={() => setSelectedGapId(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  border: "1px solid #dadce0",
                  padding: "32px",
                  boxShadow: "0 1px 3px 0 rgba(60,64,67,.30), 0 4px 8px 3px rgba(60,64,67,.15)",
                  width: "100%",
                  maxWidth: "480px",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  position: "relative"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                  <div style={{ 
                    width: 48, height: 48, borderRadius: 8, 
                    background: '#e8f0fe', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, fontWeight: 500, color: '#1a73e8',
                    border: "1px solid #1a73e8"
                  }}>
                    {selectedGap.user.avatar}
                  </div>
                  <button 
                    onClick={() => setSelectedGapId(null)}
                    style={{ 
                      background: 'transparent', 
                      border: 'none', 
                      cursor: 'pointer', 
                      color: '#5f6368',
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = "#f1f3f4"}
                    onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    ✕
                  </button>
                </div>

                <h3 style={{ fontSize: 20, fontWeight: 500, color: "#202124", marginBottom: 4, fontFamily: "'Google Sans', sans-serif" }}>{selectedGap.user.name}</h3>
                <p style={{ fontSize: 13, color: "#5f6368", marginBottom: 24 }}>{selectedGap.user.role}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8, border: '1px solid #dadce0' }}>
                    <div style={{ fontSize: 10, fontWeight: 500, color: "#1a73e8", textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.05em" }}>
                      Risk Rationale
                    </div>
                    <p style={{ fontSize: 13, color: "#3c4043", lineHeight: 1.6, margin: 0, fontWeight: 400 }}>
                      {selectedGap.reason}
                    </p>
                  </div>

                  <div style={{ padding: '0 4px' }}>
                    <div style={{ fontSize: 10, fontWeight: 500, color: "#5f6368", textTransform: "uppercase", marginBottom: 12, letterSpacing: "0.05em" }}>
                      Technical Context
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, color: '#5f6368' }}>Permission</span>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#202124' }}>{selectedGap.permission}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, color: '#5f6368' }}>Project Scope</span>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#1a73e8' }}>{selectedGap.project}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, color: '#5f6368' }}>Last Activity</span>
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#202124' }}>{selectedGap.lastActive}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                    <button
                      style={{
                        padding: "12px",
                        borderRadius: 4,
                        background: "#1a73e8",
                        border: "none",
                        color: "#fff",
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = "#185abc"}
                      onMouseOut={(e) => e.currentTarget.style.background = "#1a73e8"}
                    >
                      Initiate Remediation
                    </button>
                    <button 
                      onClick={() => setSelectedGapId(null)}
                      style={{
                        padding: "12px",
                        borderRadius: 4,
                        background: "transparent",
                        border: "1px solid #dadce0",
                        color: "#5f6368",
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "background 0.2s"
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = "#f1f3f4"}
                      onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      Dismiss View
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};