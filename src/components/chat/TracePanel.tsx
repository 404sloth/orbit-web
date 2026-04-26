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
    <div style={{ ...detailsCardStyle, borderRadius: 28 }}>
      <div style={detailsHeaderWithToggle}>
        <div style={{ ...detailsTitleStyle, color: 'var(--text-primary)', fontSize: 13, fontWeight: 900 }}>Trace</div>
        <div style={{ 
          ...traceIndicatorWrap, 
          background: 'var(--brand-light)', 
          color: 'var(--brand-primary)', 
          fontWeight: 900,
          fontSize: '9px',
          padding: '4px 10px',
          borderRadius: '8px'
        }}>
          <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ ...traceDot, background: 'var(--brand-primary)' }} 
          />
          REASONING
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
                  width: 32, height: 32, borderRadius: 10, 
                  background: step.status === 'running' ? 'var(--brand-light)' : '#ffffff', 
                  border: `1.5px solid ${step.status === 'running' ? 'var(--brand-primary)' : 'var(--border-light)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 2, boxShadow: step.status === 'running' ? '0 0 15px rgba(124, 58, 237, 0.2)' : 'none'
                }}>
                  {step.status === "running" ? (
                    <Loader2 size={12} color="var(--brand-primary)" className="spin" />
                  ) : (
                    <CheckCircle2 size={14} color="var(--accent-green)" />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>{step.name}</div>
                  <div style={{ fontSize: 10, color: "var(--text-secondary)", lineHeight: 1.5, marginTop: 4, fontWeight: 500 }}>{step.details}</div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
