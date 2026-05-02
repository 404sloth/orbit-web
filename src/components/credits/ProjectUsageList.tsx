import React from "react";
import { motion } from "framer-motion";
import { FolderKanban, Calendar, Target } from "lucide-react";

interface ProjectUsage {
  name: string;
  used: number;
  lastUsed: string;
}

interface Props {
  projects: ProjectUsage[];
}

export const ProjectUsageList: React.FC<Props> = ({ projects }) => {
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
        <div style={{ background: "var(--brand-light)", padding: "8px", borderRadius: "4px", color: "var(--brand-primary)" }}>
          <Target size={18} />
        </div>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 500, color: "var(--text-primary)", fontFamily: "'Google Sans', sans-serif" }}>Project Allocation</h3>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {projects.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--text-secondary)", padding: "60px 20px", fontSize: "13px" }}>
            No project usage recorded in this cycle.
          </div>
        ) : (
          projects.map((proj, i) => (
            <motion.div
              key={proj.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px",
                borderRadius: "8px",
                background: "var(--bg-subtle)",
                border: "1px solid var(--border-light)"
              }}
            >
              <div>
                <div style={{ fontWeight: 500, color: "var(--text-primary)", marginBottom: "4px", fontSize: "14px" }}>{proj.name}</div>
                <div style={{ fontSize: "11px", color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Calendar size={12} />
                  Active since {new Date(proj.lastUsed).toLocaleDateString()}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 500, color: "var(--brand-primary)", fontSize: "18px", fontFamily: "'Google Sans', sans-serif" }}>
                  {proj.used.toLocaleString()}
                </div>
                <div style={{ fontSize: "9px", color: "var(--text-secondary)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>Credits Used</div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
