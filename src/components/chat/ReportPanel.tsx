import React from "react";
import { FileText, Image as ImageIcon, Download, Calendar, Archive } from "lucide-react";
import { GeneratedReport } from "../../types";

interface ReportPanelProps {
  reports: GeneratedReport[];
}

export const ReportPanel: React.FC<ReportPanelProps> = ({ reports }) => {
  if (reports.length === 0) return null;

  return (
    <div style={{ 
      marginTop: "24px", 
      padding: "20px", 
      background: "#ffffff", 
      borderRadius: "20px", 
      border: "1px solid #e0e4e9",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)"
    }}>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "10px", 
        marginBottom: "20px",
        color: "#4f46e5",
        fontWeight: 700,
        fontSize: "12px",
        textTransform: "uppercase",
        letterSpacing: "0.1em"
      }}>
        <FileText size={18} />
        Executive Artifacts
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {reports.map((report, idx) => (
          <div key={idx} style={{ 
            padding: "16px", 
            borderRadius: "16px", 
            background: "#f8fafc",
            border: "1px solid #f1f5f9",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            transition: "all 0.2s ease"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ 
                  width: "40px", 
                  height: "40px", 
                  borderRadius: "12px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  background: 
                    report.type === "excel" ? "#ecfdf5" : 
                    report.type === "pdf" ? "#fef2f2" : "#eef2ff",
                  border: `1px solid ${
                    report.type === "excel" ? "#d1fae5" : 
                    report.type === "pdf" ? "#fee2e2" : "#e0e7ff"
                  }`
                }}>
                  {report.type === "excel" && <FileText size={20} color="#10b981" />}
                  {report.type === "pdf" && <FileText size={20} color="#ef4444" />}
                  {report.type === "image" && <ImageIcon size={20} color="#6366f1" />}
                  {report.type === "image_bundle" && <Archive size={20} color="#6366f1" />}
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b", wordBreak: "break-all" }}>
                    {report.type === "image_bundle" ? "Visual Summary Bundle" : report.filename.split('_')[0].toUpperCase() + " REPORT"}
                  </span>
                  <span style={{ fontSize: "11px", color: "#64748b", fontWeight: 500 }}>
                    {report.type === "image_bundle" ? "Multi-page ZIP" : report.type.toUpperCase()}
                  </span>
                </div>
              </div>
              <a 
                href={report.url} 
                download 
                style={{ 
                  color: "#6366f1", 
                  width: "36px",
                  height: "36px",
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  background: "#ffffff",
                  border: "1px solid #e0e7ff",
                  borderRadius: "10px",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "#6366f1";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.color = "#6366f1";
                }}
              >
                <Download size={18} />
              </a>
            </div>
            
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "6px", 
              fontSize: "10px", 
              color: "#94a3b8",
              fontWeight: 600,
              textTransform: "uppercase"
            }}>
              <Calendar size={12} />
              {new Date(report.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
