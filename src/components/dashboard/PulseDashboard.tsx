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
  const healthColor = project.health_color === "green" ? "var(--accent-green)" : project.health_color === "amber" ? "var(--accent-amber)" : "var(--accent-red)";
  const healthBg = project.health_color === "green" ? "#ecfdf5" : project.health_color === "amber" ? "#fffbeb" : "#fef2f2";

  return (
    <motion.div
      onClick={onClick}
      layout
      whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.04)" }}
      style={{
        background: "var(--bg-card)",
        padding: "28px",
        borderRadius: "32px",
        border: `1px solid var(--border-light)`,
        cursor: "pointer",
        position: "relative",
        boxShadow: "0 4px 12px rgba(0,0,0,0.01)",
        overflow: "hidden",
        transition: "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'var(--brand-light)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--brand-primary)'
        }}>
          <Target size={20} />
        </div>
        <span style={{
          padding: "5px 12px", borderRadius: 12,
          background: healthBg, color: healthColor,
          fontSize: 10, fontWeight: 800, textTransform: "uppercase",
          letterSpacing: '0.05em', border: `1px solid ${healthColor}20`
        }}>
          {project.status}
        </span>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 900, color: "var(--text-primary)", marginBottom: 8, lineHeight: 1.4 }}>{project.name}</h3>
      <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 20, fontWeight: 500 }}>#{project.id} • Strategic Initiative</p>

      {/* Progress Visualization */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Delivery Velocity</span>
          <span style={{ fontSize: 10, fontWeight: 800, color: healthColor }}>{project.health_color === 'green' ? 'High' : 'At Risk'}</span>
        </div>
        <div style={{ height: 6, background: 'var(--bg-main)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border-light)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: project.health_color === 'green' ? '85%' : project.health_color === 'amber' ? '60%' : '35%' }}
            style={{ height: '100%', background: healthColor, borderRadius: 10 }}
          />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, color: "var(--text-tertiary)", fontSize: 11, fontWeight: 700 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Calendar size={14} /><span>{project.end_date || "TBD"}</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Activity size={14} /><span>Operational</span></div>
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

    // Sort: Meeting first then Milestone later if they share same date
    const sortedTimeline = [...timeline].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) return dateA - dateB;
      // Arrangement: Meeting (first) then Milestone (later)
      if (a.type === b.type) return 0;
      return a.type === "meeting" ? -1 : 1;
    });

    const dates = sortedTimeline.map((e) => new Date(e.date).getTime());
    const min = Math.min(...dates), max = Math.max(...dates);
    const range = max - min || 86400000;

    const padding = 60, minNodeSpacing = 100;
    const height = Math.max(600, sortedTimeline.length * minNodeSpacing + padding * 2);
    const usableHeight = height - padding * 2;
    const centerX = dimensions.width / 2;
    const amplitude = Math.min(100, dimensions.width * 0.25);
    const waveCount = 1.2;

    const initialNodes = sortedTimeline.map((event, index) => {
      // Linear distribution by index to prevent overlaps, but biased by time
      const timeRatio = range === 0 ? 0.5 : (new Date(event.date).getTime() - min) / range;
      const indexRatio = index / (sortedTimeline.length - 1 || 1);

      // Blend ratios: mostly index-based to guarantee spacing, slightly time-based
      const ratio = indexRatio * 0.8 + timeRatio * 0.2;

      const y = padding + ratio * usableHeight;
      const x = centerX + amplitude * Math.sin(ratio * Math.PI * 2 * waveCount);
      return { id: event.id + event.date, event, x, y, ratio };
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

  if (loading) return <div style={{ padding: 60, textAlign: "center", color: "var(--text-tertiary)", fontSize: 13, fontWeight: 700 }}>Synchronizing intelligence core...</div>;
  if (!timeline.length) return <div style={{ padding: 60, textAlign: "center", color: "var(--text-tertiary)", fontSize: 13 }}>No events detected in current timeline.</div>;

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: totalHeight, minHeight: 400, overflow: "hidden", borderRadius: 32, background: "rgba(255, 253, 245, 0.4)", border: "1px solid var(--border-light)" }}>
      <svg style={{ position: "absolute", inset: 0, overflow: "visible", pointerEvents: "none" }}>
        <defs>
          <linearGradient id="curveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="var(--brand-primary)" stopOpacity="0.05" />
            <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <motion.polyline
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          points={timelinePath} fill="none" stroke="url(#curveGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
        />
        <polyline points={timelinePath} fill="none" stroke="var(--brand-primary)" strokeWidth="1" strokeDasharray="4 6" strokeLinecap="round" style={{ opacity: 0.2 }} />
      </svg>

      {nodes.map(({ id, event, x, y, ratio }, idx) => {
        const isSelected = selectedEventId === id;
        const isCompleted = event.status?.toLowerCase() === "completed";
        const color = isCompleted ? "var(--accent-green)" : event.status?.toLowerCase() === "in-progress" ? "var(--accent-amber)" : "var(--brand-primary)";
        const labelSide = Math.sin(ratio * Math.PI * 2 * 1.2) > 0 ? 'right' : 'left';

        return (
          <motion.div
            key={id}
            initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%", translateY: 20 }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%", translateY: 0 }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 120, damping: 12 }}
            style={{
              position: "absolute",
              left: x,
              top: y,
              zIndex: isSelected ? 10 : 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => onEventClick(isSelected ? null : id)}
          >
            {/* Pulse Effect for Completed Sections */}
            {isCompleted && (
              <motion.div
                animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                style={{
                  position: "absolute", inset: -10, borderRadius: "50%",
                  background: "var(--accent-green)", filter: "blur(4px)", zIndex: -1
                }}
              />
            )}

            <motion.div
              animate={{
                scale: isSelected ? 1.2 : 1,
                boxShadow: isSelected ? `0 0 20px ${color}40` : "0 4px 12px rgba(0,0,0,0.05)"
              }}
              style={{
                width: 36, height: 36, borderRadius: event.type === "milestone" ? 10 : "50%",
                background: isSelected ? color : "#ffffff", border: `2.5px solid ${color}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transform: event.type === "milestone" ? "rotate(45deg)" : "none",
                cursor: "pointer", transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)"
              }}
            >
              <div style={{ transform: event.type === "milestone" ? "rotate(-45deg)" : "none", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {event.type === "meeting" ? <MessageSquare size={16} color={isSelected ? "#fff" : color} /> : <Flag size={16} color={isSelected ? "#fff" : color} />}
              </div>
            </motion.div>

            {/* Permanent Labels: Date and Title */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: labelSide === 'right' ? "100%" : "auto",
              right: labelSide === 'left' ? "100%" : "auto",
              transform: "translateY(-50%)",
              marginLeft: labelSide === 'right' ? 16 : 0,
              marginRight: labelSide === 'left' ? 16 : 0,
              width: 140,
              textAlign: labelSide,
              pointerEvents: "none"
            }}>
              <div style={{ fontSize: 9, fontWeight: 900, color: color, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {event.title}
              </div>
            </div>
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
              <div style={{ fontSize: 10, fontWeight: 800, color: "var(--brand-primary)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Project Portfolio</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: "var(--text-primary)", margin: 0 }}>{selectedProject?.name}</h2>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 32, alignItems: "flex-start" }}>
            {/* Timeline View */}
            <div style={{ background: "#ffffff", borderRadius: 28, padding: "32px", border: "1px solid var(--border-light)", minHeight: 500, boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
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
                    style={{ background: "#ffffff", borderRadius: 28, border: "1px solid var(--border-light)", padding: "32px", boxShadow: "0 12px 32px rgba(0,0,0,0.04)", minHeight: 300, maxHeight: "80vh", overflowY: "auto" }}
                    className="hide-scrollbar"
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: selectedEvent.status?.toLowerCase() === "completed" ? "var(--accent-green)" : "var(--brand-primary)" }} />
                        <span style={{ fontSize: 11, fontWeight: 900, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {new Date(selectedEvent.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                      <span style={{
                        padding: "4px 12px", borderRadius: 8,
                        background: selectedEvent.status?.toLowerCase() === "completed" ? "#ecfdf5" : "var(--brand-light)",
                        color: selectedEvent.status?.toLowerCase() === "completed" ? "var(--accent-green)" : "var(--brand-primary)",
                        fontSize: 9, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em",
                        border: "1px solid currentColor"
                      }}>
                        {selectedEvent.status}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 22, fontWeight: 900, color: "var(--text-primary)", marginBottom: 28, lineHeight: 1.2, letterSpacing: "-0.01em" }}>
                      {selectedEvent.title}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                      {/* Summary Section */}
                      <div style={{ background: 'var(--bg-main)', padding: 20, borderRadius: 20, border: '1px solid var(--border-light)' }}>
                        <div style={{ fontSize: 10, fontWeight: 900, color: "var(--brand-primary)", textTransform: "uppercase", marginBottom: 12, letterSpacing: "0.1em" }}>
                          Strategic Briefing
                        </div>
                        <div style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.7, fontWeight: 500 }}>
                          {selectedEvent.summary?.split("\n").filter(line => !line.trim().startsWith("[") && !line.toLowerCase().includes("deliverables:")).map((line, lineIdx) => {
                            // Handle Bullet Points
                            const isBullet = line.trim().startsWith("•") || line.trim().startsWith("-");
                            const content = isBullet ? line.trim().substring(1).trim() : line;

                            // Inline Formatter
                            const formatText = (text: string) => {
                              return text.split(/(\d{1,2}\s+[A-Z][a-z]+|@[\w-]+|`[^`]+`|"[^"]+")/g).map((part, i) => {
                                if (!part) return null;
                                // Date Match (e.g. 10 April)
                                if (/\d{1,2}\s+[A-Z][a-z]+/.test(part)) {
                                  return <span key={i} style={{ color: 'var(--brand-primary)', fontWeight: 800 }}>{part}</span>;
                                }
                                // Mention Match (@user)
                                if (part.startsWith("@")) {
                                  return <span key={i} style={{ background: 'var(--brand-light)', color: 'var(--brand-primary)', padding: '2px 6px', borderRadius: 6, fontWeight: 800, fontSize: '0.95em' }}>{part}</span>;
                                }
                                // Code Match (`term`)
                                if (part.startsWith("`") && part.endsWith("`")) {
                                  return <code key={i} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)', padding: '2px 5px', borderRadius: 5, fontFamily: 'monospace', fontSize: '0.9em', color: 'var(--brand-primary)' }}>{part.slice(1, -1)}</code>;
                                }
                                // Quote Match ("text")
                                if (part.startsWith('"') && part.endsWith('"')) {
                                  return <span key={i} style={{ fontStyle: 'italic', color: 'var(--text-primary)', opacity: 0.9 }}>{part}</span>;
                                }
                                return part;
                              });
                            };

                            return (
                              <div key={lineIdx} style={{
                                marginBottom: isBullet ? 8 : 16,
                                display: isBullet ? 'flex' : 'block',
                                gap: 10,
                                paddingLeft: isBullet ? 12 : 0
                              }}>
                                {isBullet && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-primary)', marginTop: 7, flexShrink: 0 }} />}
                                <div>{formatText(content)}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Deliverables / Checklist Section */}
                      {(selectedEvent.summary?.includes("[x]") || selectedEvent.summary?.includes("[ ]") || selectedEvent.summary?.toLowerCase().includes("deliverables:")) && (
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 900, color: "var(--text-primary)", textTransform: "uppercase", marginBottom: 16, letterSpacing: "0.1em", display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Target size={14} /> Deliverables & Milestones
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {selectedEvent.summary?.split("\n").filter(line => line.trim().startsWith("[")).map((line, i) => {
                              const isDone = line.includes("[x]");
                              const text = line.replace(/\[[x ]\]\s*/, "");
                              return (
                                <motion.div
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                  key={i}
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '12px 16px', borderRadius: 14,
                                    background: isDone ? 'rgba(5, 150, 105, 0.03)' : '#fff',
                                    border: `1px solid ${isDone ? 'rgba(5, 150, 105, 0.1)' : 'var(--border-light)'}`
                                  }}
                                >
                                  <div style={{
                                    width: 18, height: 18, borderRadius: 5,
                                    background: isDone ? 'var(--accent-green)' : '#fff',
                                    border: `1.5px solid ${isDone ? 'var(--accent-green)' : 'var(--border-light)'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                  }}>
                                    {isDone && <Clock size={10} color="#fff" />}
                                  </div>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: isDone ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: isDone ? 'line-through' : 'none', opacity: isDone ? 0.6 : 1 }}>
                                    {text}
                                  </span>
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div style={{ height: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text-tertiary)", textAlign: "center", background: "var(--bg-main)", borderRadius: 28, border: "1px dashed var(--border-light)", padding: 32 }}>
                    <Target size={40} style={{ opacity: 0.2, marginBottom: 16, color: "var(--brand-primary)" }} />
                    <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-secondary)" }}>Event Details</div>
                    <p style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 4 }}>Select a node to view insights.</p>
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