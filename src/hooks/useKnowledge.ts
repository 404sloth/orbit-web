import { useState, useCallback } from "react";
import { knowledgeApi } from "../services/api";

export function useKnowledge(token: string | null) {
  const [kbText, setKbText] = useState("");
  const [kbSource, setKbSource] = useState("");
  const [kbFile, setKbFile] = useState<File | null>(null);
  const [kbLoading, setKbLoading] = useState(false);

  const handleKbSubmit = useCallback(async () => {
    if (!kbText.trim() && !kbFile) return;
    setKbLoading(true);
    try {
      const formData = new FormData();
      if (kbFile) {
        formData.append("file", kbFile);
        if (kbSource) formData.append("source", kbSource);
      } else {
        formData.append("content", kbText.trim());
        formData.append("source", kbSource || "Manual ingestion");
      }

      const response = await knowledgeApi.ingest(formData, token);
      if (!response.ok) throw new Error("Upload failed");

      setKbText("");
      setKbSource("");
      setKbFile(null);
      return true;
    } catch (error) {
      console.error("Failed to ingest knowledge payload", error);
      return false;
    } finally {
      setKbLoading(false);
    }
  }, [kbText, kbFile, kbSource, token]);

  return {
    kbText,
    setKbText,
    kbSource,
    setKbSource,
    kbFile,
    setKbFile,
    kbLoading,
    handleKbSubmit,
  };
}
