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
  { id: "conversations", icon: MessageSquare, label: "Advisory" },
  { id: "dashboard", icon: LayoutDashboard, label: "Portfolio" },
  { id: "knowledge", icon: Database, label: "Knowledge" },
  { id: "audit", icon: ShieldCheck, label: "Security" },
  { id: "credits", icon: CreditCard, label: "Billing" },
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
  hybrid: "#7c3aed",   // Strategic Intelligence (Purple)
  sql: "#2563eb",      // Data Analytics (Blue)
  rag: "#059669",      // Knowledge Base (Emerald)
  report: "#d97706",   // Executive Reporting (Amber)
  image: "#db2777",    // Visual Intelligence (Pink)
  human: "#dc2626",    // Strategic Approval (Red)
};

export const AGENT_OPTIONS = [
  { id: "hybrid", label: "Strategic Intelligence", description: "People search and general advisory" },
  { id: "sql", label: "Data Analytics", description: "Quantitative metrics and budget analysis" },
  { id: "rag", label: "Knowledge Base", description: "Semantic search in documents and notes" },
  { id: "report", label: "Executive Reporting", description: "Exports, Excel, and PDF generation" },
  { id: "image", label: "Visual Intelligence", description: "Data visualization and chart generation" },
  { id: "human", label: "Strategic Approval", description: "Irreversible actions and gates" },
] as const;
