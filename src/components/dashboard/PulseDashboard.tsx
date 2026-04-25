import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  ChevronRight, 
  Clock, 
  Flag, 
  MessageSquare, 
  Target, 
  Activity,
  CheckCircle2,
  AlertCircle,
  Play
} from "lucide-react";
import { PulseProject, PulseEvent } from "../../types";

interface PulseDashboardProps {
  projects: PulseProject[];
  selectedPid: string | null;
  timeline: PulseEvent[];
  loading: boolean;
  onSelect: (id: string) => void;
  onSimulate: (id: string) => void;
}

const ProjectCard = ({ 
  project, 
  isSelected, 
  onClick 
}: { 
  project: PulseProject; 
  isSelected: boolean; 
  onClick: () => void;
}) => {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.06)" }}
      style={{
        background: isSelected ? "#ffffff" : "#f8fafc",
        padding: "24px",
        borderRadius: "20px",
        border: `1px solid ${isSelected ? "#4f46e5" : "#e2e8f0"}`,
        cursor: "pointer",
        transition: "all 0.2s ease",
        position: "relative",
        boxShadow: isSelected ? "0 8px 30px rgba(79, 70, 229, 0.1)" : "0 2px 4px rgba(0,0,0,0.02)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
        <div style={{
          fontSize: "10px",
          fontWeight: 800,
          color: isSelected ? "#4f46e5" : "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.05em"
        }}>
          #{project.id}
        </div>
        <div style={{
          padding: "4px 10px",
          borderRadius: "99px",
          background: project.health_color === "green" ? "#f0fdf4" : project.health_color === "amber" ? "#fffbeb" : "#fef2f2",
          color: project.health_color === "green" ? "#166534" : project.health_color === "amber" ? "#92400e" : "#991b1b",
          fontSize: "10px",
          fontWeight: 700,
          textTransform: "capitalize"
        }}>
          {project.status}
        </div>
      </div>

      <h3 style={{ 
        fontSize: "18px", 
        fontWeight: 800, 
        color: "#1e293b", 
        marginBottom: "12px",
        lineHeight: 1.2
      }}>
        {project.name}
      </h3>

      <div style={{ display: "flex", gap: "16px", color: "#64748b", fontSize: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Calendar size={14} />
          <span>{project.start_date || "---"}</span>
        </div>
        <ChevronRight size={14} style={{ opacity: 0.3 }} />
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Clock size={14} />
          <span>{project.end_date || "---"}</span>
        </div>
      </div>

      {isSelected && (
        <motion.div 
          layoutId="active-indicator"
          style={{
            position: "absolute",
            bottom: "0",
            left: "50%",
            transform: "translateX(-50%)",
            width: "40px",
            height: "3px",
            background: "#4f46e5",
            borderRadius: "3px 3px 0 0"
          }}
        />
      )}
    </motion.div>
  );
};

const TimelineMarker = ({ event }: { event: PulseEvent }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMeeting = event.type === "meeting";
  const isMilestone = event.type === "milestone";

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "completed": case "achieved": return "#10b981";
      case "in-progress": return "#f59e0b";
      case "pending": return "#94a3b8";
      default: return "#4f46e5";
    }
  };

  return (
    <div 
      style={{ display: "flex", gap: "24px", position: "relative", paddingBottom: "40px" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Connector line handled by parent container */}
      
      {/* Icon / Marker */}
      <div style={{ 
        width: "32px", 
        height: "32px", 
        borderRadius: isMilestone ? "8px" : "50%", 
        background: isHovered ? getStatusColor(event.status) : "#ffffff",
        border: `2px solid ${getStatusColor(event.status)}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2,
        transition: "all 0.2s ease",
        transform: isMilestone ? "rotate(45deg)" : "none",
        boxShadow: isHovered ? `0 0 15px ${getStatusColor(event.status)}40` : "none"
      }}>
        <div style={{ transform: isMilestone ? "rotate(-45deg)" : "none" }}>
          {isMeeting ? <MessageSquare size={14} color={isHovered ? "#fff" : "#4f46e5"} /> : 
           isMilestone ? <Flag size={14} color={isHovered ? "#fff" : "#4f46e5"} /> :
           <Activity size={14} color={isHovered ? "#fff" : "#4f46e5"} />}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8" }}>
            {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
          {isMilestone && (
            <span style={{
              fontSize: "9px",
              fontWeight: 800,
              padding: "2px 8px",
              borderRadius: "4px",
              background: `${getStatusColor(event.status)}15`,
              color: getStatusColor(event.status),
              textTransform: "uppercase"
            }}>
              {event.status}
            </span>
          )}
        </div>

        <h4 style={{ fontSize: "15px", fontWeight: 700, color: "#1e293b", margin: 0 }}>
          {event.title}
        </h4>

        {/* Hover Summary */}
        <AnimatePresence>
          {isHovered && event.summary && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "#ffffff",
                padding: "16px",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                zIndex: 10,
                marginTop: "8px",
                border: "1px solid #e2e8f0"
              }}
            >
              <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {isMeeting ? "Meeting Highlights" : "Deliverables"}
              </div>
              <ul style={{ margin: 0, paddingLeft: "18px", color: "#475569", fontSize: "13px", lineHeight: 1.5 }}>
                {event.summary.split("\n").map((line, i) => (
                  <li key={i} style={{ marginBottom: "4px" }}>{line.replace(/^[•-]\s*/, "")}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export const PulseDashboard: React.FC<PulseDashboardProps> = ({
  projects,
  selectedPid,
  timeline,
  loading,
  onSelect,
  onSimulate
}) => {
  const selectedProject = projects.find(p => p.id === selectedPid);

  return (
    <div style={{ padding: "40px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "48px" }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: 900, color: "#1e293b", marginBottom: "8px", letterSpacing: "-0.02em" }}>
            Project Pulse
          </h1>
          <p style={{ color: "#64748b", fontSize: "15px" }}>
            Tracking strategic alignment and lifecycle milestones across the organization.
          </p>
        </div>
        
        {selectedProject && (
          <button 
            onClick={() => onSimulate(selectedProject.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "12px",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)"
            }}
          >
            <Play size={16} fill="currentColor" />
            Simulate Progression
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "48px", alignItems: "flex-start" }}>
        {/* Project List */}
        <div style={{ display: "grid", gap: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Active Portfolios
          </div>
          {projects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              isSelected={selectedPid === project.id}
              onClick={() => onSelect(project.id)}
            />
          ))}
        </div>

        {/* Timeline Path */}
        <div style={{ 
          background: "#ffffff", 
          borderRadius: "24px", 
          padding: "40px", 
          border: "1px solid #e2e8f0",
          minHeight: "600px",
          position: "relative"
        }}>
          {!selectedPid ? (
            <div style={{ 
              height: "500px", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center",
              color: "#94a3b8",
              textAlign: "center"
            }}>
              <Target size={48} style={{ opacity: 0.2, marginBottom: "20px" }} />
              <h3 style={{ fontSize: "18px", fontWeight: 700 }}>Select a Portfolio</h3>
              <p style={{ fontSize: "14px" }}>Click on a project card to visualize its strategic path.</p>
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }}>
                <Activity size={20} color="#4f46e5" />
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#1e293b" }}>
                  Strategic Path: {selectedProject?.name}
                </h2>
              </div>

              {loading ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                  Synchronizing timeline data...
                </div>
              ) : timeline.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                  No lifecycle events recorded for this vector.
                </div>
              ) : (
                <div style={{ position: "relative", paddingLeft: "16px" }}>
                  {/* Vertical Path Line */}
                  <div style={{ 
                    position: "absolute", 
                    left: "31px", 
                    top: "16px", 
                    bottom: "40px", 
                    width: "2px", 
                    background: "linear-gradient(to bottom, #4f46e5 0%, #e2e8f0 100%)",
                    zIndex: 1
                  }} />

                  {timeline.map((event, i) => (
                    <TimelineMarker key={event.id + i} event={event} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
