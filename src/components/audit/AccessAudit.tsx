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
      label: "Redundant Access Points",
      val: highSeverityCount.toString(),
      sub: `Across ${new Set(gaps.map((g) => g.project)).size} projects`,
      icon: AlertTriangle,
      color: "#ef4444",
    },
    {
      label: "Stale Permissions",
      val: gaps.length.toString(),
      sub: "Awaiting remediation",
      icon: History,
      color: "#7c3aed",
    },
    {
      label: "Security Integrity",
      val: `${integrityPercentage.toFixed(1)}%`,
      sub: "Post-audit target: 100%",
      icon: ShieldAlert,
      color: "#10b981",
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 40,
            padding: "0 20px",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: "var(--brand-primary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>System Integrity</div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: "var(--text-primary)", margin: 0 }}>Access Guard</h1>
            </div>
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div
              style={{
                background: "#fff",
                border: "1px solid var(--border-light)",
                borderRadius: 24,
                padding: "0 20px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                backdropFilter: "blur(12px)",
              }}
            >
              <Search size={18} color="var(--text-tertiary)" />
              <input
                type="text"
                placeholder="Search users, projects, or permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  padding: "10px 0",
                  fontSize: 14,
                  fontWeight: 500,
                  width: 240,
                  background: "transparent",
                  color: "var(--text-primary)",
                }}
              />
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={fetchGaps}
              aria-label="Refresh access audit data"
              style={{
                background: refreshing ? "var(--bg-card)" : "#fff",
                border: "1px solid var(--border-light)",
                borderRadius: 20,
                padding: "10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                backdropFilter: "blur(12px)"
              }}
            >
              <motion.div
                animate={refreshing ? { rotate: 360 } : {}}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ display: "flex", alignItems: "center" }}
              >
                <RefreshCw size={20} color="var(--text-secondary)" />
              </motion.div>
            </motion.button>
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
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 90 }}
              style={{
                background: "#fff",
                padding: "20px 24px",
                borderRadius: 24,
                border: "1px solid var(--border-light)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.03)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* subtle accent circles */}
              <div
                style={{
                  position: "absolute",
                  top: -30,
                  right: -30,
                  width: 140,
                  height: 140,
                  background: `${kpi.color}08`,
                  borderRadius: "50%",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -20,
                  left: -20,
                  width: 80,
                  height: 80,
                  background: `${kpi.color}10`,
                  borderRadius: "50%",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 16,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    background: `${kpi.color}15`,
                    padding: 12,
                    borderRadius: 16,
                  }}
                >
                  <kpi.icon color={kpi.color} size={22} />
                </div>
                <div
                  style={{
                    background: "var(--bg-main)",
                    padding: "6px 14px",
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--text-tertiary)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  Live
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: kpi.color,
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  fontSize: 30,
                  fontWeight: 900,
                  color: "var(--text-primary)",
                  marginBottom: 4,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                {kpi.val}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  marginBottom: 4,
                }}
              >
                {kpi.label}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: "var(--text-tertiary)",
                  opacity: 0.75,
                }}
              >
                {kpi.sub}
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
              borderRadius: 32,
              border: "1px solid var(--border-light)",
              overflow: "hidden",
              boxShadow: "0 20px 50px rgba(0,0,0,0.04)",
            }}
          >
            {/* Filter bar */}
            <div
              style={{
                padding: "16px 32px",
                borderBottom: "1px solid var(--border-light)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
                background: "rgba(249,250,251,0.7)",
                backdropFilter: "blur(16px)",
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
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "var(--bg-main)",
                  padding: "10px 18px",
                  borderRadius: 14,
                }}
              >
                <Filter size={15} color="var(--brand-primary)" />
                Monitoring{" "}
                <span
                  style={{
                    color: "var(--text-primary)",
                    fontWeight: 900,
                  }}
                >
                  {filteredGaps.length}
                </span>{" "}
                Anomalies
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
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ delay: i * 0.03, duration: 0.2 }}
                        style={{
                          background:
                            selectedGapId === gap.id
                              ? "rgba(124, 58, 237, 0.03)"
                              : gap.severity === "high"
                              ? "rgba(254,226,226,0.1)"
                              : "transparent",
                          borderRadius: 18,
                          border: `1px solid ${selectedGapId === gap.id ? 'var(--brand-primary)' : 'var(--border-light)'}`,
                          boxShadow: selectedGapId === gap.id ? "0 8px 24px rgba(124, 58, 237, 0.08)" : "0 2px 10px rgba(0,0,0,0.02)",
                          cursor: "pointer",
                        }}
                      >
                        <td style={{ padding: "16px 12px 16px 24px", borderRadius: "18px 0 0 18px" }}>
                          <div
                            style={{ display: "flex", alignItems: "center", gap: 16 }}
                          >
                            <div
                              style={{
                                width: 38,
                                height: 38,
                                borderRadius: 12,
                                background:
                                  "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 13,
                                fontWeight: 900,
                                color: "var(--brand-primary)",
                                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
                              }}
                            >
                              {gap.user.avatar}
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: 13,
                                  fontWeight: 800,
                                  color: "var(--text-primary)",
                                  marginBottom: 3,
                                }}
                              >
                                {gap.user.name}
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  fontWeight: 500,
                                  color: "var(--text-tertiary)",
                                }}
                              >
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
                            <motion.button
                              whileHover={{ scale: 1.05, background: "var(--brand-primary)", color: "#fff" }}
                              whileTap={{ scale: 0.95 }}
                              style={{
                                padding: "6px 12px",
                                borderRadius: 10,
                                background: "transparent",
                                border: "1px solid var(--brand-primary)",
                                color: "var(--brand-primary)",
                                fontSize: 11,
                                fontWeight: 800,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                cursor: "pointer",
                                transition: "all 0.2s cubic-bezier(0.23, 1, 0.32, 1)"
                              }}
                              aria-label={`Revoke access for ${gap.user.name}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                // Revoke logic here
                              }}
                            >
                              <UserMinus size={15} /> Revoke
                            </motion.button>
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
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: "var(--brand-light)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 24px",
                      boxShadow: "inset 0 4px 12px rgba(0,0,0,0.05)",
                    }}
                  >
                    <CheckCircle2 color="var(--brand-primary)" size={36} />
                  </div>
                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 900,
                      color: "var(--text-primary)",
                      marginBottom: 12,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Security Perimeter Integrity Confirmed
                  </h3>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: 15,
                      fontWeight: 500,
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
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: "#fff",
                  borderRadius: 32,
                  border: "1px solid var(--border-light)",
                  padding: "40px",
                  boxShadow: "0 40px 100px rgba(0,0,0,0.2)",
                  width: "100%",
                  maxWidth: "500px",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  position: "relative"
                }}
                className="hide-scrollbar"
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                  <div style={{ 
                    width: 64, height: 64, borderRadius: 20, 
                    background: 'var(--brand-light)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, fontWeight: 900, color: 'var(--brand-primary)',
                    boxShadow: '0 8px 20px rgba(124, 58, 237, 0.15)'
                  }}>
                    {selectedGap.user.avatar}
                  </div>
                  <button 
                    onClick={() => setSelectedGapId(null)}
                    style={{ 
                      background: 'var(--bg-main)', 
                      border: 'none', 
                      cursor: 'pointer', 
                      color: 'var(--text-tertiary)',
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    ✕
                  </button>
                </div>

                <h3 style={{ fontSize: 24, fontWeight: 900, color: "var(--text-primary)", marginBottom: 6 }}>{selectedGap.user.name}</h3>
                <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-tertiary)", marginBottom: 32 }}>{selectedGap.user.role}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ background: 'var(--bg-main)', padding: 24, borderRadius: 24, border: '1px solid var(--border-light)' }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: "var(--brand-primary)", textTransform: "uppercase", marginBottom: 12, letterSpacing: "0.12em" }}>
                      Risk Rationale
                    </div>
                    <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                      {selectedGap.reason}
                    </p>
                  </div>

                  <div style={{ padding: '0 8px' }}>
                    <div style={{ fontSize: 11, fontWeight: 900, color: "var(--text-tertiary)", textTransform: "uppercase", marginBottom: 16, letterSpacing: "0.12em" }}>
                      Technical Context
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Permission</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{selectedGap.permission}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Project Scope</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--brand-primary)' }}>{selectedGap.project}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Last Activity</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{selectedGap.lastActive}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
                    <motion.button
                      whileHover={{ scale: 1.02, background: "var(--brand-primary)", color: "#fff" }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        padding: "16px",
                        borderRadius: 16,
                        background: "transparent",
                        border: "1px solid var(--brand-primary)",
                        color: "var(--brand-primary)",
                        fontSize: 14,
                        fontWeight: 800,
                        cursor: "pointer",
                        transition: "all 0.2s cubic-bezier(0.23, 1, 0.32, 1)"
                      }}
                    >
                      Initiate Remediation
                    </motion.button>
                    <button 
                      onClick={() => setSelectedGapId(null)}
                      style={{
                        padding: "16px",
                        borderRadius: 16,
                        background: "transparent",
                        border: "none",
                        color: "var(--text-tertiary)",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
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