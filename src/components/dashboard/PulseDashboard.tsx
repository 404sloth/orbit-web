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
  ChevronLeft,
  Check
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
      whileHover={{ boxShadow: "0 1px 6px rgba(32,33,36,.28)" }}
      style={{
        background: "var(--bg-main)",
        padding: "20px",
        borderRadius: "8px",
        border: `1px solid #dadce0`,
        cursor: "pointer",
        position: "relative",
        boxShadow: "0 1px 2px 0 rgba(60,64,67,.30)",
        overflow: "hidden",
        transition: "all 0.2s ease"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 4,
          background: '#e8f0fe',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#1a73e8'
        }}>
          <Target size={18} />
        </div>
        <span style={{
          padding: "4px 8px", borderRadius: 4,
          background: healthBg, color: healthColor,
          fontSize: 10, fontWeight: 500, textTransform: "uppercase",
          letterSpacing: '0.03em'
        }}>
          {project.status}
        </span>
      </div>

      <h3 style={{ fontSize: 15, fontWeight: 500, color: "#202124", marginBottom: 4, lineHeight: 1.4, fontFamily: "'Google Sans', sans-serif" }}>{project.name}</h3>
      <p style={{ fontSize: 12, color: '#5f6368', marginBottom: 16, fontWeight: 400 }}>#{project.id}</p>
      
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 500, color: '#5f6368', textTransform: 'uppercase' }}>Delivery Status</span>
          <span style={{ fontSize: 10, fontWeight: 800, color: healthColor }}>{project.health_color === 'green' ? 'High' : 'At Risk'}</span>
        </div>
        <div style={{ height: 4, background: '#f1f3f4', borderRadius: 2, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: project.health_color === 'green' ? '85%' : project.health_color === 'amber' ? '60%' : '35%' }}
            style={{ height: '100%', background: healthColor }}
          />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#5f6368", fontSize: 11, fontWeight: 400 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12} /><span>{project.end_date || "TBD"}</span></div>
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

  if (loading) return <div style={{ padding: 60, textAlign: "center", color: "var(--text-tertiary)", fontSize: 13, fontWeight: 700 }}>Synchronizing project data...</div>;
  if (!timeline.length) return <div style={{ padding: 60, textAlign: "center", color: "var(--text-tertiary)", fontSize: 13 }}>No events detected in current timeline.</div>;

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: totalHeight, minHeight: 400, overflow: "hidden", borderRadius: 8, background: "var(--bg-sidebar)", border: "1px solid #dadce0" }}>
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
                background: isSelected ? color : "var(--bg-card)", border: `2.5px solid ${color}`,
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
    <div style={{ padding: "40px 40px 100px", width: "100%", maxWidth: "1400px", margin: "0 auto" }}>

      {!selectedPid ? (
        <>
          {projects.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} isSelected={false} onClick={() => onSelect(project.id)} />
              ))}
            </div>
          ) : (
            <div style={{ 
              background: "var(--bg-main)", 
              borderRadius: "8px", 
              padding: "80px 40px", 
              textAlign: "center", 
              border: "1px dashed #dadce0",
              marginTop: "20px"
            }}>
              <Target size={48} color="#dadce0" style={{ marginBottom: "16px" }} />
              <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: 500, color: "#202124" }}>No Managed Projects</h3>
              <p style={{ margin: 0, color: "#5f6368", fontSize: "14px" }}>
                You don't have any projects yet to manage. Portfolio insights will appear once projects are initialized.
              </p>
            </div>
          )}
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Header Section */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: 0, 
            background: "var(--bg-main)", 
            padding: "8px 16px", 
            borderRadius: "12px", 
            border: "1px solid #dadce0",
            boxShadow: "0 1px 2px 0 rgba(60,64,67,.30)",
            width: "fit-content"
          }}>
            <button 
              onClick={() => { onSelect(null); setSelectedEventId(null); }} 
              style={{ 
                background: "transparent", 
                color: "#5f6368", 
                border: "none", 
                width: 32, 
                height: 32, 
                borderRadius: "4px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "#f1f3f4"}
              onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
            >
              <ArrowLeft size={18} />
            </button>
            
            <div style={{ width: 1, height: 24, background: "#dadce0", margin: "0 16px" }} />
            
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 10, fontWeight: 500, color: "#1a73e8", textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1 }}>Project Portfolio</div>
              <h2 style={{ fontSize: 16, fontWeight: 500, color: "#202124", margin: 0, fontFamily: "'Google Sans', sans-serif" }}>{selectedProject?.name}</h2>
            </div>

            <div style={{ width: 1, height: 24, background: "#dadce0", margin: "0 16px" }} />

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#188038" }} />
              <span style={{ fontSize: 12, color: "#5f6368", fontWeight: 400 }}>Live Execution</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "flex-start" }}>
            {/* Timeline View */}
            <div style={{ background: "var(--bg-main)", borderRadius: 8, padding: "24px", border: "1px solid #dadce0", minHeight: 600, boxShadow: "0 1px 2px 0 rgba(60,64,67,.30)" }}>
              <CurvedTimeline timeline={timeline} loading={loading} selectedEventId={selectedEventId} onEventClick={setSelectedEventId} />
            </div>

            {/* Detail Panel on the Right */}
            <div style={{ position: "sticky", top: 40 }}>
              <AnimatePresence mode="wait">
                {selectedEvent ? (
                  <motion.div
                    key={selectedEventId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    style={{ 
                      background: "var(--bg-main)", 
                      borderRadius: 8, 
                      border: "1px solid #dadce0", 
                      padding: "24px", 
                      boxShadow: "0 1px 3px 0 rgba(60,64,67,.30), 0 4px 8px 3px rgba(60,64,67,.15)", 
                      minHeight: 300, 
                      maxHeight: "calc(100vh - 200px)", 
                      overflowY: "auto" 
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: selectedEvent.status?.toLowerCase() === "completed" ? "#188038" : "#1a73e8" }} />
                        <span style={{ fontSize: 11, fontWeight: 500, color: "#5f6368", textTransform: "uppercase", letterSpacing: "0.03em" }}>
                          {new Date(selectedEvent.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                      <span style={{
                        padding: "2px 8px", borderRadius: 4,
                        background: selectedEvent.status?.toLowerCase() === "completed" ? "#e6f4ea" : "#e8f0fe",
                        color: selectedEvent.status?.toLowerCase() === "completed" ? "#188038" : "#1a73e8",
                        fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.03em"
                      }}>
                        {selectedEvent.status}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 18, fontWeight: 500, color: "#202124", marginBottom: 20, lineHeight: 1.3, letterSpacing: "-0.01em", fontFamily: "'Google Sans', sans-serif" }}>
                      {selectedEvent.title}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                      {/* Summary Section */}
                      <div style={{ background: 'var(--bg-sidebar)', padding: 20, borderRadius: 8, border: '1px solid #dadce0' }}>
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
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {selectedEvent.summary?.split("\n").filter(line => line.trim().startsWith("[")).map((line, i) => {
                              const isDone = line.includes("[x]");
                              const text = line.replace(/\[[x ]\]\s*/, "");
                              return (
                                <motion.div
                                  key={i}
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '8px 12px', borderRadius: 4,
                                    background: isDone ? 'var(--bg-sidebar)' : 'var(--bg-card)',
                                    border: `1px solid ${isDone ? '#e8f0fe' : '#dadce0'}`
                                  }}
                                >
                                  <div style={{
                                    width: 16, height: 16, borderRadius: 2,
                                    background: isDone ? '#1a73e8' : 'var(--bg-card)',
                                    border: `1px solid ${isDone ? '#1a73e8' : '#dadce0'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                  }}>
                                    {isDone && <Check size={10} color="#fff" />}
                                  </div>
                                  <span style={{ fontSize: 13, fontWeight: 400, color: isDone ? '#5f6368' : '#202124', textDecoration: isDone ? 'line-through' : 'none' }}>
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
                  <div style={{ height: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#5f6368", textAlign: "center", background: "var(--bg-main)", borderRadius: 8, border: "1px dashed #dadce0", padding: 32 }}>
                    <Target size={40} style={{ opacity: 0.2, marginBottom: 16, color: "#1a73e8" }} />
                    <div style={{ fontSize: 14, fontWeight: 500, color: "#202124" }}>Event Details</div>
                    <p style={{ fontSize: 12, color: "#5f6368", marginTop: 4 }}>Select a node to view insights.</p>
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