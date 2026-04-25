import {
  MessageSquare,
  LayoutDashboard,
  Database,
  Globe,
  Target,
  TrendingUp,
} from "lucide-react";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export const NAV = [
  { id: "conversations", icon: MessageSquare, label: "Chat" },
  { id: "dashboard", icon: LayoutDashboard, label: "Pulse" },
  { id: "knowledge", icon: Database, label: "Assets" },
  { id: "research", icon: Globe, label: "Market" },
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
  "Check SLA compliance for V-001.",
  "Compare top cloud vendors by performance.",
  "AWS contract renewal status?",
  "Find Kubernetes vendors in Europe.",
  "Summarize yesterday's review.",
];

export const AGENT_COLORS: Record<string, string> = {
  vendor_management: "#1a73e8",
  meetings_communication: "#e37400",
  knowledge_base: "#1e8e3e",
};

export const AGENT_OPTIONS = [
  { id: "vendor_management", label: "Vendor Management", description: "Contracts, SLA, and scoring" },
  { id: "meetings_communication", label: "Communication", description: "Meetings and transcripts" },
  { id: "knowledge_base", label: "Knowledge Base", description: "Search docs and notes" },
] as const;
