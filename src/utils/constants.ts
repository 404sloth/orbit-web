import {
  MessageSquare,
  LayoutDashboard,
  Database,
  ShieldCheck,
  Target,
  TrendingUp,
  CreditCard,
} from "lucide-react";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export const NAV = [
  { id: "conversations", icon: MessageSquare, label: "Chat" },
  { id: "dashboard", icon: LayoutDashboard, label: "Pulse" },
  { id: "knowledge", icon: Database, label: "Assets" },
  { id: "audit", icon: ShieldCheck, label: "Guard" },
  { id: "credits", icon: CreditCard, label: "Credits" },
] as const;

export const RESEARCH_CATEGORIES = [
  {
    title: "Competitive Intelligence",
    icon: Target,
    color: "#d93025",
    queries: [
      "Compare our top cloud vendors by service coverage and quality.",
      "Analyze market positioning for managed Kubernetes providers.",
      "Summarize emerging vendor risks in our infrastructure stack.",
    ],
  },
  {
    title: "Market & Industry",
    icon: TrendingUp,
    color: "#1a73e8",
    queries: [
      "List all vendors for different services we have across all category.",
      "Find the best cloud vendor within $50,000 budget.",
      "Show data analytics vendors with strong delivery performance.",
    ],
  },
] as const;

export const INITIAL_SUGGESTIONS = [
  "What is the health of Phoenix ERP?",
  "Summarize the latest meeting highlights.",
  "Check budget status for cloud vendors.",
  "What are the upcoming project milestones?",
  "List all vendors with rating above 4.5.",
];

export const AGENT_COLORS: Record<string, string> = {
  vendor_management: "#7c3aed", // Premium Purple
  meetings_communication: "#db2777", // Pink/Rose for contrast
  knowledge_base: "#059669", // Emerald for balance
};

export const AGENT_OPTIONS = [
  { id: "vendor_management", label: "Vendor Management", description: "Contracts, SLA, and scoring" },
  { id: "meetings_communication", label: "Communication", description: "Meetings and transcripts" },
  { id: "knowledge_base", label: "Knowledge Base", description: "Search docs and notes" },
] as const;
