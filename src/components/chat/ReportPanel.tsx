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
      marginTop: "24px", 
      padding: "24px", 
      background: "#ffffff", 
      borderRadius: "28px", 
      border: "1px solid var(--border-light)",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.02)"
    }}>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "12px", 
        marginBottom: "24px",
        color: "var(--brand-primary)",
        fontWeight: 900,
        fontSize: "10px",
        textTransform: "uppercase",
        letterSpacing: "0.15em"
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--brand-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FileText size={16} />
        </div>
        Executive Artifacts
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {reports.map((report, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -2, boxShadow: '0 8px 20px rgba(0,0,0,0.03)' }}
            style={{ 
              padding: "16px", 
              borderRadius: "20px", 
              background: "var(--bg-main)",
              border: "1px solid var(--border-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "all 0.3s cubic-bezier(0.23, 1, 0.32, 1)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flex: 1, minWidth: 0 }}>
              <div style={{ 
                width: "42px", 
                height: "42px", 
                borderRadius: "14px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                background: 
                  report.type === "excel" ? "#ecfdf5" : 
                  report.type === "pdf" ? "#fef2f2" : "#ffffff",
                border: "1px solid var(--border-light)",
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}>
                {report.type === "excel" && <FileSpreadsheet size={18} color="#059669" />}
                {report.type === "pdf" && <FileText size={18} color="#dc2626" />}
                {report.type === "image" && <ImageIcon size={18} color="var(--brand-primary)" />}
                {report.type === "image_bundle" && <Archive size={18} color="var(--brand-primary)" />}
                {!["excel", "pdf", "image", "image_bundle"].includes(report.type) && <File size={18} color="var(--text-tertiary)" />}
              </div>
              <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <span style={{ fontSize: "13px", fontWeight: 800, color: "var(--text-primary)", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {report.type === "image_bundle" ? "Visual Summary Bundle" : report.filename.split('_')[0].toUpperCase() + " BRIEF"}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <span style={{ fontSize: "10px", color: "var(--text-tertiary)", fontWeight: 700, textTransform: 'uppercase' }}>
                    {report.type.toUpperCase()}
                  </span>
                  <span style={{ color: 'var(--border-light)' }}>•</span>
                  <span style={{ fontSize: "10px", color: "var(--text-tertiary)", fontWeight: 600 }}>
                    {new Date(report.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
            <a 
              href={report.url} 
              download 
              style={{ 
                color: "var(--text-secondary)", 
                width: "36px",
                height: "36px",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                background: "#ffffff",
                border: "1px solid var(--border-light)",
                borderRadius: "12px",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
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
