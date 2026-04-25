import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, Check, Bot, Target, CheckCircle2 } from "lucide-react";
import { RoutingMetadata } from "../../types";
import { prettifyAgent } from "../../utils/helpers";
import {
  detailsCardStyle,
  detailsHeaderWithToggle,
  detailsTitleStyle,
  traceIndicatorWrap,
  traceDot,
  tracePathOuterStyle,
  reasoningBoxStyle,
  reasoningLabelStyle,
  toolsListStyle,
  toolChipStyle,
  toolDotStyle,
  detailsLabelStyle,
  emptyRoutingStyle,
  tracePathStepStyle,
  tracePathLine,
  tracePathIconBox,
  tracePathLabel,
} from "../../styles/theme";

interface TracePanelProps {
  lastRouting: RoutingMetadata | null;
  isThinking: boolean;
  liveTrace: any[];
}

const TracePathStep = ({ label, status, icon: Icon }: { label: string, status: "pending" | "current" | "complete" | "error", icon: any }) => {
  const isComplete = status === "complete";
  const isCurrent = status === "current";

  return (
    <div style={tracePathStepStyle}>
      <div style={tracePathLine(isComplete)} />
      <div style={tracePathIconBox(isComplete, isCurrent)}>
        <Icon size={12} color={isComplete || isCurrent ? "#1a73e8" : "#9aa0a6"} />
      </div>
      <div style={tracePathLabel(isComplete, isCurrent)}>{label}</div>
    </div>
  );
};

export const TracePanel: React.FC<TracePanelProps> = ({ lastRouting, isThinking, liveTrace }) => {
  const [traceTab, setTraceTab] = useState<"dispatch" | "brain" | "live">("live");

  return (
    <div style={detailsCardStyle}>
      <div style={detailsHeaderWithToggle}>
        <div style={detailsTitleStyle}>Trace</div>
        <div style={traceIndicatorWrap}>
          <div style={traceDot} className="pulse" />
          Reasoning
        </div>
      </div>

      <AnimatePresence mode="wait">
        {lastRouting ? (
          <motion.div
            key="trace-content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <div style={{ display: "flex", gap: 16, marginBottom: 20, borderBottom: "1px solid #f1f3f4", paddingBottom: 8, alignItems: "center" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#1a73e8", display: "flex", alignItems: "center", gap: 6 }}>
                {isThinking && <div className="thinking-dot" />}
              </div>
            </div>

            <div style={tracePathOuterStyle}>
              {liveTrace.length === 0 && (
                <div style={{ color: "#9aa0a6", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
                  Awaiting execution events...
                </div>
              )}
              {liveTrace.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`trace-step-animate ${step.status}`}
                  style={{ display: "flex", gap: 16, marginBottom: 20, position: "relative" }}
                >
                  {i < liveTrace.length - 1 && <div className="trace-path-line-live" />}
                  <div className={`trace-icon-box ${step.status}`}>
                    {step.status === "running" ? (
                      <div className="trace-pulse-ring">
                        <Loader2 size={12} color="#1a73e8" className="spin" />
                      </div>
                    ) : (
                      <Check size={12} color="#1e8e3e" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#202124", letterSpacing: "-0.01em" }}>{step.name}</div>
                    <div style={{ fontSize: 11, color: "#5f6368", lineHeight: 1.4, marginTop: 2 }}>{step.details}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="trace-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={emptyRoutingStyle}
          >
            Engage the core to see real-time routing logic here.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
