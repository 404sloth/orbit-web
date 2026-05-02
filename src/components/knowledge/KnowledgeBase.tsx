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
  kbScope: string;
  setKbScope: (v: string) => void;
  kbFile: File | null;
  setKbFile: (f: File | null) => void;
  kbLoading: boolean;
  handleKbSubmit: () => Promise<boolean | undefined>;
  setToast: (toast: { message: string, type: "success" | "error" } | null) => void;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({
  kbText, setKbText, kbSource, setKbSource, kbScope, setKbScope, kbFile, setKbFile, kbLoading, handleKbSubmit, setToast
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
      setToast({ message: "Knowledge base updated successfully.", type: "success" });
    } else {
      setToast({ message: "Failed to ingest knowledge payload.", type: "error" });
    }
  };

  return (
    <div style={{ ...contentWrapStyle, padding: "40px 24px" }}>
      <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 32, borderBottom: "1px solid var(--border-light)" }}>
        <button 
          onClick={() => setIngestionMode("file")}
          style={{ 
            padding: "12px 24px", 
            background: "none",
            color: ingestionMode === "file" ? "var(--brand-primary)" : "var(--text-secondary)",
            border: "none",
            borderBottom: ingestionMode === "file" ? "3px solid var(--brand-primary)" : "none",
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.2s ease",
            fontSize: "14px"
          }}
        >
          <Upload size={16} /> Documents
        </button>
        <button 
          onClick={() => setIngestionMode("text")}
          style={{ 
            padding: "12px 24px", 
            background: "none",
            color: ingestionMode === "text" ? "var(--brand-primary)" : "var(--text-secondary)",
            border: "none",
            borderBottom: ingestionMode === "text" ? "3px solid var(--brand-primary)" : "none",
            fontWeight: 500,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.2s ease",
            fontSize: "14px"
          }}
        >
          <Database size={16} /> Text Data
        </button>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {ingestionMode === "file" ? (
          <div 
            style={{ ...contentCardStyle, borderColor: isDragOver ? "var(--brand-primary)" : "var(--border-light)", background: "var(--bg-card)", padding: "24px", borderRadius: 8, boxShadow: "0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15)" }} 
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }} 
            onDragLeave={() => setIsDragOver(false)} 
            onDrop={(e) => { e.preventDefault(); setIsDragOver(false); const file = e.dataTransfer.files?.[0]; if (file) handleFileChange(file); }}
          >
            <div style={{ marginBottom: 16 }}><span style={{ fontSize: 18, fontWeight: 500, color: 'var(--text-primary)', fontFamily: "'Google Sans', sans-serif" }}>Ingest Documents</span></div>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>Upload internal documents for RAG-based strategic reasoning and recall.</p>
            <div onClick={() => fileInputRef.current?.click()} style={{ height: 180, border: `2px dashed ${isDragOver ? "var(--brand-primary)" : (kbFile ? "var(--brand-primary)" : "var(--border-light)")}`, borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s ease", background: kbFile ? "var(--brand-light)" : "var(--bg-sidebar)", position: "relative" }}>
              <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={(e) => handleFileChange(e.target.files?.[0] || null)} accept=".pdf,.json,.md,.txt" />
              {kbFile ? (
                <>
                  <FileText size={40} color="var(--brand-primary)" />
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)", marginTop: 12 }}>{kbFile.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>{(kbFile.size / 1024).toFixed(1)} KB ready</div>
                  <button onClick={(e) => { e.stopPropagation(); handleFileChange(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} style={{ position: "absolute", top: 12, right: 12, background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 4, padding: "4px 10px", color: "var(--text-primary)", fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Clear</button>
                </>
              ) : (
                <>
                  <Upload size={32} color="var(--text-secondary)" style={{ marginBottom: 12 }} />
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>Drop document here</div>
                  <div style={{ fontSize: 12, color: "var(--text-tertiary)", marginTop: 4 }}>PDF, JSON, MD, TXT (Max {MAX_FILE_SIZE_MB} MB)</div>
                </>
              )}
            </div>
            <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>Source Label</label>
                <input id="kbSourceFile" value={kbSource} onChange={(event) => setKbSource(event.target.value)} style={{ width: "100%", height: 40, border: "1px solid var(--border-light)", borderRadius: 4, padding: "0 12px", fontSize: 14 }} placeholder="e.g., Q4 Internal Report" disabled={kbLoading} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>Access Scope</label>
                <select 
                  id="kbScopeFile" 
                  value={kbScope} 
                  onChange={(event) => setKbScope(event.target.value)} 
                  style={{ width: "100%", height: 40, border: "1px solid var(--border-light)", borderRadius: 4, padding: "0 12px", fontSize: 14, background: "var(--bg-card)" }}
                  disabled={kbLoading}
                >
                  <option value="global">Global (All Users)</option>
                  <option value="workspace">Workspace (Team)</option>
                  <option value="personal">Personal (Private)</option>
                </select>
              </div>
            </div>
            <button style={{ width: "100%", marginTop: 24, height: 40, borderRadius: 4, background: 'var(--brand-primary)', color: '#fff', border: 'none', fontWeight: 500, fontSize: 14, cursor: kbLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: "0 1px 2px 0 rgba(60,64,67,.30)" }} onClick={() => void handleSubmit()} disabled={kbLoading || !kbFile}>
              {kbLoading ? <Loader2 size={16} className="spin" /> : <ChevronRight size={16} />}
              {kbLoading ? "Indexing Knowledge..." : "Ingest Document"}
            </button>
          </div>
        ) : (
          <div style={{ ...contentCardStyle, background: "var(--bg-card)", padding: "24px", borderRadius: 8, boxShadow: "0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15)" }}>
            <div style={{ marginBottom: 16 }}><span style={{ fontSize: 18, fontWeight: 500, color: 'var(--text-primary)', fontFamily: "'Google Sans', sans-serif" }}>Ingest Text</span></div>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>Add structured text content directly to the knowledge repository.</p>
            <textarea value={kbText} onChange={(event) => setKbText(event.target.value)} rows={10} style={{ width: "100%", border: "1px solid var(--border-light)", borderRadius: 4, padding: "12px", fontSize: 14, background: "var(--bg-sidebar)" }} placeholder="Enter or paste content here..." disabled={kbLoading} />
            <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>Source Label</label>
                <input id="kbSourceText" value={kbSource} onChange={(event) => setKbSource(event.target.value)} style={{ width: "100%", height: 40, border: "1px solid var(--border-light)", borderRadius: 4, padding: "0 12px", fontSize: 14 }} placeholder="e.g., Knowledge Snippet" disabled={kbLoading} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>Access Scope</label>
                <select 
                  id="kbScopeText" 
                  value={kbScope} 
                  onChange={(event) => setKbScope(event.target.value)} 
                  style={{ width: "100%", height: 40, border: "1px solid var(--border-light)", borderRadius: 4, padding: "0 12px", fontSize: 14, background: "var(--bg-card)" }}
                  disabled={kbLoading}
                >
                  <option value="global">Global (All Users)</option>
                  <option value="workspace">Workspace (Team)</option>
                  <option value="personal">Personal (Private)</option>
                </select>
              </div>
            </div>
            <button style={{ width: "100%", marginTop: 24, height: 40, borderRadius: 4, background: 'var(--brand-primary)', color: '#fff', border: 'none', fontWeight: 500, fontSize: 14, cursor: kbLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: "0 1px 2px 0 rgba(60,64,67,.30)" }} onClick={() => void handleSubmit()} disabled={kbLoading || !kbText.trim()}>
              {kbLoading ? <Loader2 size={16} className="spin" /> : <Database size={16} />}
              {kbLoading ? "Indexing Knowledge..." : "Commit Knowledge"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
