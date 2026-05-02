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
        <Icon size={12} color={isComplete || isCurrent ? "var(--brand-primary)" : "var(--text-tertiary)"} />
      </div>
      <div style={tracePathLabel(isComplete, isCurrent)}>{label}</div>
    </div>
  );
};

export const TracePanel: React.FC<TracePanelProps> = ({ lastRouting, isThinking, liveTrace }) => {
  return (
    <div style={{ ...detailsCardStyle, borderRadius: 8, background: "var(--bg-card)", border: "1px solid var(--border-light)", boxShadow: "0 1px 2px 0 rgba(60,64,67,.30)", padding: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ color: 'var(--text-primary)', fontSize: 14, fontWeight: 500, fontFamily: "'Google Sans', sans-serif" }}>Execution Trace</div>
        <div style={{ 
          display: "flex", alignItems: "center", gap: 6,
          background: 'var(--brand-light)', 
          color: 'var(--brand-primary)', 
          fontWeight: 500,
          fontSize: '11px',
          padding: '4px 10px',
          borderRadius: '4px'
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: 'var(--brand-primary)' }} />
          EXECUTION
        </div>
      </div>

      <div style={{ ...tracePathOuterStyle, marginTop: 24 }}>
        <AnimatePresence mode="popLayout">
          {liveTrace.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ color: "var(--text-tertiary)", fontSize: 12, textAlign: "center", padding: "40px 0", fontWeight: 600 }}
            >
              Awaiting execution events...
            </motion.div>
          ) : (
            liveTrace.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20, filter: 'blur(5px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                style={{ display: "flex", gap: 16, marginBottom: 24, position: "relative" }}
              >
                {i < liveTrace.length - 1 && (
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: 'calc(100% + 24px)' }}
                    style={{ 
                      position: 'absolute', left: 15, top: 32, width: 2, 
                      background: 'var(--border-light)', zIndex: 1 
                    }} 
                  />
                )}
                <div style={{ 
                  width: 28, height: 28, borderRadius: 4, 
                  background: step.status === 'running' ? 'var(--brand-light)' : 'var(--bg-card)', 
                  border: `1px solid ${step.status === 'running' ? 'var(--brand-primary)' : 'var(--border-light)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 2
                }}>
                  {step.status === "running" ? (
                    <Loader2 size={12} color="var(--brand-primary)" className="spin" />
                  ) : (
                    <CheckCircle2 size={12} color="var(--accent-green)" />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>{step.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.4, marginTop: 2 }}>{step.details}</div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
