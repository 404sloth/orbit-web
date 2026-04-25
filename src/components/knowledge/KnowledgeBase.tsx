import React, { useRef, useState } from "react";
import { Upload, FileText, Plus, Loader2, ChevronRight, Database } from "lucide-react";
import {
  contentWrapStyle, contentCardStyle, cardHeaderStyle, cardHeaderTitleStyle,
  kbIntroText, fieldLabelStyle, textInputStyle, textareaStyle, primaryActionButton
} from "../../styles/theme";

interface KnowledgeBaseProps {
  kbText: string;
  setKbText: (v: string) => void;
  kbSource: string;
  setKbSource: (v: string) => void;
  kbFile: File | null;
  setKbFile: (f: File | null) => void;
  kbLoading: boolean;
  handleKbSubmit: () => Promise<boolean | undefined>;
  setToast: (toast: { message: string, type: "success" | "error" } | null) => void;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  kbText, setKbText, kbSource, setKbSource, kbFile, setKbFile, kbLoading, handleKbSubmit, setToast
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ingestionMode, setIngestionMode] = useState<"file" | "text">("file");
  const [isDragOver, setIsDragOver] = useState(false);
  const MAX_FILE_SIZE_MB = 10;
  const ALLOWED_TYPES = [".pdf", ".json", ".md", ".txt", "application/pdf", "application/json", "text/markdown", "text/plain"];

  const validateFile = (file: File): boolean => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const isValidType = ALLOWED_TYPES.includes(`.${ext}`) || ALLOWED_TYPES.includes(file.type);
    if (!isValidType) {
      setToast({ message: `Unsupported file type.`, type: "error" });
      return false;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setToast({ message: `File exceeds ${MAX_FILE_SIZE_MB} MB limit.`, type: "error" });
      return false;
    }
    return true;
  };

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setKbFile(null);
      return;
    }
    if (validateFile(file)) {
      setKbFile(file);
    } else {
      setKbFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!kbFile && !kbText.trim()) {
      setToast({ message: "Please provide a file or text to ingest.", type: "error" });
      return;
    }
    if (!kbSource.trim()) {
      setToast({ message: "Please provide a source label.", type: "error" });
      return;
    }
    const success = await handleKbSubmit();
    if (success) {
      setToast({ message: "Strategic intelligence ingested successfully.", type: "success" });
    } else {
      setToast({ message: "Failed to ingest knowledge payload.", type: "error" });
    }
  };

  return (
    <div style={contentWrapStyle}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 40, gap: 12 }}>
        <button 
          onClick={() => setIngestionMode("file")}
          style={{ 
            padding: "12px 24px", 
            borderRadius: "14px", 
            background: ingestionMode === "file" ? "#1a73e8" : "rgba(0,0,0,0.04)",
            color: ingestionMode === "file" ? "white" : "#5f6368",
            border: "none",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
            transition: "all 0.2s ease",
            boxShadow: ingestionMode === "file" ? "0 4px 12px rgba(26,115,232,0.2)" : "none"
          }}
        >
          <Upload size={18} /> Upload File
        </button>
        <button 
          onClick={() => setIngestionMode("text")}
          style={{ 
            padding: "12px 24px", 
            borderRadius: "14px", 
            background: ingestionMode === "text" ? "#1a73e8" : "rgba(0,0,0,0.04)",
            color: ingestionMode === "text" ? "white" : "#5f6368",
            border: "none",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 10,
            transition: "all 0.2s ease",
            boxShadow: ingestionMode === "text" ? "0 4px 12px rgba(26,115,232,0.2)" : "none"
          }}
        >
          <Database size={18} /> Paste Text
        </button>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {ingestionMode === "file" ? (
          <div 
            style={{ ...contentCardStyle, borderColor: isDragOver ? "#1a73e8" : undefined, transition: "border 0.2s ease", padding: "32px" }} 
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }} 
            onDragLeave={() => setIsDragOver(false)} 
            onDrop={(e) => { e.preventDefault(); setIsDragOver(false); const file = e.dataTransfer.files?.[0]; if (file) handleFileChange(file); }}
          >
            <div style={cardHeaderStyle}><span style={cardHeaderTitleStyle}><Upload size={20} color="#1a73e8" />Upload File</span></div>
            <p style={{ ...kbIntroText, marginBottom: 24 }}>Upload PDF reports, JSON exports, or Markdown briefs directly to the intelligence core.</p>
            <div onClick={() => fileInputRef.current?.click()} style={{ height: 220, border: `2px dashed ${isDragOver ? "#1a73e8" : (kbFile ? "#1a73e8" : "#dadce0")}`, borderRadius: 24, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.3s ease", background: kbFile ? "rgba(26,115,232,0.02)" : "transparent", position: "relative" }}>
              <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={(e) => handleFileChange(e.target.files?.[0] || null)} accept=".pdf,.json,.md,.txt" />
              {kbFile ? (
                <>
                  <FileText size={48} color="#1a73e8" />
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#202124", marginTop: 16 }}>{kbFile.name}</div>
                  <div style={{ fontSize: 13, color: "#5f6368", marginTop: 4 }}>{(kbFile.size / 1024).toFixed(1)} KB ready for indexing</div>
                  <button onClick={(e) => { e.stopPropagation(); handleFileChange(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} style={{ position: "absolute", top: 16, right: 16, background: "#f1f3f4", border: "none", borderRadius: 20, padding: "6px 14px", color: "#202124", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>✕ Clear</button>
                </>
              ) : (
                <>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(26,115,232,0.05)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}><Plus size={28} color="#1a73e8" /></div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#202124" }}>Select Strategic Document</div>
                  <div style={{ fontSize: 13, color: "#9aa0a6", marginTop: 6 }}>Supports PDF, JSON, MD, TXT (max {MAX_FILE_SIZE_MB} MB)</div>
                </>
              )}
            </div>
            <div style={{ marginTop: 28 }}>
              <label style={fieldLabelStyle} htmlFor="kbSourceFile">Strategic Source Label</label>
              <input id="kbSourceFile" value={kbSource} onChange={(event) => setKbSource(event.target.value)} style={{ ...textInputStyle, height: 48 }} placeholder="e.g., Annual Strategic Audit 2024" disabled={kbLoading} />
            </div>
            <button style={{ ...primaryActionButton, width: "100%", marginTop: 28, height: 52, borderRadius: 16, opacity: kbLoading ? 0.7 : 1, fontSize: 15 }} onClick={() => void handleSubmit()} disabled={kbLoading || !kbFile}>{kbLoading ? <Loader2 size={20} className="spin" /> : <ChevronRight size={20} />}{kbLoading ? "Indexing Knowledge..." : "Ingest Document"}</button>
          </div>
        ) : (
          <div style={{ ...contentCardStyle, padding: "32px" }}>
            <div style={cardHeaderStyle}><span style={cardHeaderTitleStyle}><Database size={20} color="#1a73e8" />Paste Text Here</span></div>
            <p style={{ ...kbIntroText, marginBottom: 24 }}>Paste raw strategic data, meeting snippets, or tactical updates for immediate semantic recall.</p>
            <textarea value={kbText} onChange={(event) => setKbText(event.target.value)} rows={10} style={{ ...textareaStyle, borderRadius: 24, padding: "20px", fontSize: 15 }} placeholder="Paste raw documentation or briefings here..." disabled={kbLoading} />
            <div style={{ marginTop: 24 }}>
              <label style={fieldLabelStyle} htmlFor="kbSourceText">Source Attribution</label>
              <input id="kbSourceText" value={kbSource} onChange={(event) => setKbSource(event.target.value)} style={{ ...textInputStyle, height: 48 }} placeholder="e.g., Q3 Stakeholder Update" disabled={kbLoading} />
            </div>
            <button style={{ ...primaryActionButton, width: "100%", marginTop: 24, height: 52, borderRadius: 16, opacity: kbLoading ? 0.7 : 1, fontSize: 15 }} onClick={() => void handleSubmit()} disabled={kbLoading || !kbText.trim()}>{kbLoading ? <Loader2 size={20} className="spin" /> : <Database size={20} />}{kbLoading ? "Indexing Knowledge..." : "Commit Intelligence"}</button>
          </div>
        )}
      </div>
    </div>
  );
};
