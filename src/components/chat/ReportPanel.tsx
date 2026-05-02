import React from "react";
import { motion } from "framer-motion";
import { FileText, Image as ImageIcon, Download, FileSpreadsheet, File, RefreshCw, Layers } from "lucide-react";
import { GeneratedReport } from "../../types";

interface ReportPanelProps {
  reports: GeneratedReport[];
  onRefresh?: () => void;
}

export const ReportPanel: React.FC<ReportPanelProps> = ({ reports, onRefresh }) => {
  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      gap: "20px"
    }}>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        marginBottom: "8px"
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "10px", 
          color: "#0f172a",
          fontWeight: 700,
          fontSize: "13px",
          fontFamily: "'Outfit', sans-serif",
          letterSpacing: "0.05em"
        }}>
          <Layers size={18} color="#1a73e8" />
          STRATEGY ARTIFACTS
        </div>
        <button 
          onClick={onRefresh}
          style={{
            background: "none",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            padding: "4px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            transition: "all 0.2s ease"
          }}
          title="Refresh Artifacts"
          onMouseOver={(e) => e.currentTarget.style.color = "#1a73e8"}
          onMouseOut={(e) => e.currentTarget.style.color = "#94a3b8"}
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {reports.length === 0 ? (
        <div style={{ 
          padding: "40px 20px", 
          textAlign: "center", 
          background: "rgba(248, 250, 252, 0.5)", 
          borderRadius: "16px",
          border: "2px dashed #e2e8f0"
        }}>
          <FileText size={32} color="#cbd5e1" style={{ marginBottom: "12px", opacity: 0.5 }} />
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#64748b", marginBottom: "4px" }}>No Artifacts Generated</div>
          <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.4" }}>Generated reports and data extracts will appear here for quick access.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {reports.map((report, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              style={{ 
                padding: "12px", 
                borderRadius: "12px", 
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                cursor: "pointer"
              }}
              onClick={() => handleDownload(report.url, report.filename)}
            >
              <div style={{ 
                width: "36px", 
                height: "36px", 
                borderRadius: "10px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                background: 
                  report.type === "excel" ? "#f0fdf4" : 
                  report.type === "pdf" ? "#fef2f2" : "#f0f9ff",
                flexShrink: 0
              }}>
                {report.type === "excel" && <FileSpreadsheet size={18} color="#16a34a" />}
                {report.type === "pdf" && <FileText size={18} color="#dc2626" />}
                {report.type === "image" && <ImageIcon size={18} color="#2563eb" />}
                {!["excel", "pdf", "image"].includes(report.type) && <File size={18} color="#64748b" />}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  fontSize: "12px", 
                  fontWeight: 600, 
                  color: "#1e293b", 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  textTransform: 'capitalize'
                }}>
                  {report.filename.split('_')[0].replace(/-/g, ' ')}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: "6px", marginTop: "2px" }}>
                  <span style={{ 
                    fontSize: "9px", 
                    fontWeight: 700, 
                    color: report.type === "pdf" ? "#ef4444" : (report.type === "excel" ? "#22c55e" : "#3b82f6"),
                    background: report.type === "pdf" ? "#fee2e2" : (report.type === "excel" ? "#dcfce7" : "#dbeafe"),
                    padding: "1px 6px",
                    borderRadius: "4px",
                    textTransform: "uppercase"
                  }}>
                    {report.type}
                  </span>
                  <span style={{ fontSize: "10px", color: "#94a3b8" }}>
                    {new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(report.url, report.filename);
                }}
                style={{ 
                  color: "#94a3b8",
                  padding: "6px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#f1f5f9";
                  e.currentTarget.style.color = "#1a73e8";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#94a3b8";
                }}
              >
                <Download size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
