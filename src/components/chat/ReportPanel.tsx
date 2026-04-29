import React from "react";
import { motion } from "framer-motion";
import { FileText, Image as ImageIcon, Download, Calendar, Archive, FileSpreadsheet, File } from "lucide-react";
import { GeneratedReport } from "../../types";

interface ReportPanelProps {
  reports: GeneratedReport[];
}

export const ReportPanel: React.FC<ReportPanelProps> = ({ reports }) => {
  if (reports.length === 0) return null;

  return (
    <div style={{ 
      marginTop: "16px", 
      padding: "16px", 
      background: "#ffffff", 
      borderRadius: "8px", 
      border: "1px solid #dadce0",
      boxShadow: "0 1px 2px 0 rgba(60,64,67,.30)"
    }}>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "10px", 
        marginBottom: "16px",
        color: "#202124",
        fontWeight: 500,
        fontSize: "14px",
        fontFamily: "'Google Sans', sans-serif"
      }}>
        <FileText size={18} color="#1a73e8" />
        Artifacts
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {reports.map((report, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ background: '#f8f9fa' }}
            style={{ 
              padding: "12px", 
              borderRadius: "8px", 
              background: "#ffffff",
              border: "1px solid #dadce0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "all 0.2s ease"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, minWidth: 0 }}>
              <div style={{ 
                width: "36px", 
                height: "36px", 
                borderRadius: "4px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                background: 
                  report.type === "excel" ? "#e6f4ea" : 
                  report.type === "pdf" ? "#fce8e6" : "#e8f0fe",
                border: "1px solid #dadce0"
              }}>
                {report.type === "excel" && <FileSpreadsheet size={16} color="#188038" />}
                {report.type === "pdf" && <FileText size={16} color="#d93025" />}
                {report.type === "image" && <ImageIcon size={16} color="#1a73e8" />}
                {report.type === "image_bundle" && <Archive size={16} color="#1a73e8" />}
                {!["excel", "pdf", "image", "image_bundle"].includes(report.type) && <File size={16} color="#5f6368" />}
              </div>
              <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <span style={{ fontSize: "13px", fontWeight: 500, color: "#202124", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {report.type === "image_bundle" ? "Visual Summary" : report.filename.split('_')[0].toUpperCase()}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: "11px", color: "#5f6368", fontWeight: 400 }}>
                    {report.type.toUpperCase()}
                  </span>
                  <span style={{ color: '#dadce0' }}>•</span>
                  <span style={{ fontSize: "11px", color: "#70757a", fontWeight: 400 }}>
                    {new Date(report.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
            <a 
              href={report.url} 
              download 
              style={{ 
                color: "#5f6368", 
                width: "32px",
                height: "32px",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                background: "transparent",
                border: "none",
                borderRadius: "4px",
                transition: "all 0.2s ease"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = "var(--brand-primary)";
                e.currentTarget.style.borderColor = "var(--brand-primary)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.borderColor = "var(--border-light)";
              }}
            >
              <Download size={16} />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
