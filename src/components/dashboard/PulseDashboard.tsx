import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronRight,
  Clock,
  Flag,
  MessageSquare,
  Target,
  Activity,
  Maximize2,
  ArrowLeft,
  ChevronLeft
} from "lucide-react";
import { PulseProject, PulseEvent } from "../../types";

interface PulseDashboardProps {
  projects: PulseProject[];
  selectedPid: string | null;
  timeline: PulseEvent[];
  loading: boolean;
  onSelect: (id: string | null) => void;
  onSimulate: (id: string) => void;
}

// ----------------------------------------------------------------------
// ProjectCard – classic & premium
// ----------------------------------------------------------------------
const ProjectCard = ({
  project,
  isSelected,
  onClick,
}: {
  project: PulseProject;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.div
      onClick={onClick}
      layout
      whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.05)" }}
      style={{
        background: "#ffffff",
        padding: "24px",
        borderRadius: "20px",
        border: `1px solid #e2e8f0`,
        cursor: "pointer",
        position: "relative",
        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
        overflow: "hidden",
        transition: "all 0.2s ease"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: "#c5a572", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          #{project.id}
        </span>
        <span style={{ padding: "3px 8px", borderRadius: 99, background: project.health_color === "green" ? "#f0fdf4" : project.health_color === "amber" ? "#fffbeb" : "#fef2f2", color: project.health_color === "green" ? "#166534" : project.health_color === "amber" ? "#92400e" : "#991b1b", fontSize: 9, fontWeight: 700, textTransform: "uppercase" }}>
          {project.status}
        </span>
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1e293b", marginBottom: 12, lineHeight: 1.3 }}>{project.name}</h3>
      <div style={{ display: "flex", gap: 16, color: "#64748b", fontSize: 12, fontWeight: 500 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Calendar size={14} /><span>{project.start_date || "---"}</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Clock size={14} /><span>{project.end_date || "---"}</span></div>
      </div>
    </motion.div>
  );
};

// ----------------------------------------------------------------------
// CurvedTimeline – focus on the path and hover tooltips
// ----------------------------------------------------------------------
const CurvedTimeline = ({
  timeline,
  loading,
  selectedEventId,
  onEventClick,
}: {
  timeline: PulseEvent[];
  loading: boolean;
  selectedEventId: string | null;
  onEventClick: (id: string | null) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 600 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => { if (el) setDimensions({ width: el.clientWidth, height: el.clientHeight }); };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { timelinePath, nodes, totalHeight } = useMemo(() => {
    if (!timeline.length) return { timelinePath: "", nodes: [], totalHeight: 0 };
    const dates = timeline.map((e) => new Date(e.date).getTime());
    const min = Math.min(...dates), max = Math.max(...dates);
    const range = max - min || 86400000;
    const padding = 50, minHeight = 400;
    const height = Math.max(minHeight, timeline.length * 70 + padding * 2);
    const usableHeight = height - padding * 2;
    const centerX = dimensions.width / 2;
    const amplitude = Math.min(80, dimensions.width * 0.2);
    const waveCount = 1.5;

    const initialNodes = timeline.map((event) => {
      const ratio = range === 0 ? 0.5 : (new Date(event.date).getTime() - min) / range;
      const y = padding + ratio * usableHeight;
      const x = centerX + amplitude * Math.sin(ratio * Math.PI * 2 * waveCount);
      return { id: event.id + event.date, event, x, y };
    });

    const step = 2;
    const points: string[] = [];
    for (let y = padding; y <= height - padding; y += step) {
      const ratio = (y - padding) / usableHeight;
      const x = centerX + amplitude * Math.sin(ratio * Math.PI * 2 * waveCount);
      points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return { timelinePath: points.join(" "), nodes: initialNodes, totalHeight: height };
  }, [timeline, dimensions.width]);

  if (loading) return <div style={{ padding: 60, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Synchronizing data...</div>;
  if (!timeline.length) return <div style={{ padding: 60, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No events detected.</div>;

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: totalHeight, minHeight: 400, overflow: "hidden", borderRadius: 24, background: "rgba(248, 250, 252, 0.5)" }}>
      <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
        <defs>
          <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c5a572" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#c5a572" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#c5a572" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <polyline points={timelinePath} fill="none" stroke="url(#curveGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={timelinePath} fill="none" stroke="#c5a572" strokeWidth="1" strokeDasharray="6 8" strokeLinecap="round" style={{ opacity: 0.3 }} />
      </svg>

      {nodes.map(({ id, event, x, y }) => {
        const isSelected = selectedEventId === id;
        const color = event.status?.toLowerCase() === "completed" ? "#059669" : event.status?.toLowerCase() === "in-progress" ? "#d97706" : "#c5a572";

        return (
          <motion.div
            key={id}
            style={{ position: "absolute", left: x, top: y, x: "-50%", y: "-50%", zIndex: isSelected ? 10 : 2 }}
            whileHover="hover"
            onClick={() => onEventClick(isSelected ? null : id)}
          >
            <motion.div
              variants={{ hover: { scale: 1.1 } }}
              style={{
                width: 32, height: 32, borderRadius: event.type === "milestone" ? 8 : "50%",
                background: isSelected ? color : "#ffffff", border: `2px solid ${color}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transform: event.type === "milestone" ? "rotate(45deg)" : "none",
                cursor: "pointer", boxShadow: isSelected ? `0 0 12px ${color}40` : "0 2px 6px rgba(0,0,0,0.05)"
              }}
            >
              <div style={{ transform: event.type === "milestone" ? "rotate(-45deg)" : "none", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {event.type === "meeting" ? <MessageSquare size={14} color={isSelected ? "#fff" : color} /> : <Flag size={14} color={isSelected ? "#fff" : color} />}
              </div>
            </motion.div>

            {/* Hover Tooltip - Trimmed to 2 lines */}
            <motion.div
              variants={{ hover: { opacity: 1, y: -8 } }}
              initial={{ opacity: 0, y: 0 }}
              style={{
                position: "absolute", bottom: "100%", left: "50%", x: "-50%", width: 200,
                background: "#1e293b", color: "#f8fafc", padding: "10px", borderRadius: 10,
                fontSize: 11, fontWeight: 500, pointerEvents: "none", marginBottom: 10,
                boxShadow: "0 8px 20px rgba(0,0,0,0.12)", zIndex: 100
              }}
            >
              <div style={{ fontWeight: 700, color: "#c5a572", marginBottom: 4, textTransform: "uppercase", fontSize: 9 }}>{event.title}</div>
              <div style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", textOverflow: "ellipsis", opacity: 0.8, lineHeight: 1.4 }}>
                {event.summary || "No details."}
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

// ----------------------------------------------------------------------
// Main Dashboard Component
// ----------------------------------------------------------------------
export const PulseDashboard: React.FC<PulseDashboardProps> = ({ projects, selectedPid, timeline, loading, onSelect }) => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const selectedProject = projects.find((p) => p.id === selectedPid);
  const selectedEvent = timeline.find((e) => e.id + e.date === selectedEventId);

  return (
    <div style={{ padding: "40px", width: "100%", maxWidth: "1400px", margin: "0 auto", minHeight: "100vh" }}>
      
      {!selectedPid ? (
        <>
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1e293b", marginBottom: 8, letterSpacing: "-0.02em" }}>Project Pulse</h1>
            <p style={{ color: "#64748b", fontSize: 15 }}>Monitor strategic vectors and organizational milestones.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} isSelected={false} onClick={() => onSelect(project.id)} />
            ))}
          </div>
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Header Section */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <button onClick={() => { onSelect(null); setSelectedEventId(null); }} style={{ background: "#ffffff", color: "#64748b", border: "1px solid #e2e8f0", width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
              <ArrowLeft size={20} />
            </button>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#c5a572", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Project Portfolio</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1e293b", margin: 0 }}>{selectedProject?.name}</h2>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 32, alignItems: "flex-start" }}>
            {/* Timeline View */}
            <div style={{ background: "#ffffff", borderRadius: 24, padding: "32px", border: "1px solid #e2e8f0", minHeight: 500, boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
              <CurvedTimeline timeline={timeline} loading={loading} selectedEventId={selectedEventId} onEventClick={setSelectedEventId} />
            </div>

            {/* Detail Panel on the Right */}
            <div style={{ position: "sticky", top: 40 }}>
              <AnimatePresence mode="wait">
                {selectedEvent ? (
                  <motion.div
                    key={selectedEventId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    style={{ background: "#ffffff", borderRadius: 24, border: "1px solid #e2e8f0", padding: "32px", boxShadow: "0 12px 32px rgba(0,0,0,0.04)", minHeight: 300, maxHeight: "80vh", overflowY: "auto" }}
                    className="hide-scrollbar"
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#c5a572" }}>{new Date(selectedEvent.date).toLocaleDateString("en-US", { month: "long", day: "numeric" })}</span>
                      <span style={{ padding: "3px 10px", borderRadius: 99, background: "#f8fafc", border: "1px solid #e2e8f0", color: "#64748b", fontSize: 9, fontWeight: 800, textTransform: "uppercase" }}>{selectedEvent.status}</span>
                    </div>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1e293b", marginBottom: 24, lineHeight: 1.2 }}>{selectedEvent.title}</h3>
                    
                    <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 20 }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: "#c5a572", textTransform: "uppercase", marginBottom: 12, letterSpacing: "0.05em" }}>Briefing Summary</div>
                      <ul style={{ margin: 0, paddingLeft: 16, color: "#475569", fontSize: 14, lineHeight: 1.7 }}>
                        {selectedEvent.summary?.split("\n").map((line, i) => (
                          <li key={i} style={{ marginBottom: 12 }}>{line.replace(/^[•-]\s*/, "")}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ) : (
                  <div style={{ height: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94a3b8", textAlign: "center", background: "#f8fafc", borderRadius: 24, border: "1px dashed #e2e8f0", padding: 32 }}>
                    <Target size={40} style={{ opacity: 0.2, marginBottom: 16, color: "#c5a572" }} />
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#64748b" }}>Event Details</div>
                    <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>Select a node to view insights.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};