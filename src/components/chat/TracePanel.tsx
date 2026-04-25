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
              <button
                onClick={() => setTraceTab("live")}
                style={{
                  background: "none", border: "none", fontSize: 10, fontWeight: 700, padding: "4px 0", cursor: "pointer",
                  color: traceTab === "live" ? "#1a73e8" : "#9aa0a6",
                  borderBottom: traceTab === "live" ? "2px solid #1a73e8" : "none",
                  display: "flex", alignItems: "center", gap: 6
                }}
              >
                REAL-TIME FEED
                {isThinking && <div className="thinking-dot" />}
              </button>
              <button
                onClick={() => setTraceTab("dispatch")}
                style={{
                  background: "none", border: "none", fontSize: 10, fontWeight: 700, padding: "4px 0", cursor: "pointer",
                  color: traceTab === "dispatch" ? "#1a73e8" : "#9aa0a6",
                  borderBottom: traceTab === "dispatch" ? "2px solid #1a73e8" : "none"
                }}
              >
                DISPATCH
              </button>
              <button
                onClick={() => setTraceTab("brain")}
                style={{
                  background: "none", border: "none", fontSize: 10, fontWeight: 700, padding: "4px 0", cursor: "pointer",
                  color: traceTab === "brain" ? "#1a73e8" : "#9aa0a6",
                  borderBottom: traceTab === "brain" ? "2px solid #1a73e8" : "none"
                }}
              >
                BRAIN
              </button>
            </div>

            {isThinking && traceTab === "live" && (
              <div className="thinking-waves-container">
                <div className="wave w1" />
                <div className="wave w2" />
                <div className="wave w3" />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#1a73e8", marginLeft: 12 }}>ORBIT COGNITION ACTIVE</span>
              </div>
            )}

            {traceTab === "live" ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
            ) : traceTab === "dispatch" ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={tracePathOuterStyle}>
                  <TracePathStep label="Analyze Intent" status="complete" icon={Sparkles} />
                  <TracePathStep
                    label={prettifyAgent(lastRouting.agent) ?? "Intelligent Routing"}
                    status="complete"
                    icon={Bot}
                  />
                  <TracePathStep
                    label={lastRouting.action ?? "Executing Strategy"}
                    status="complete"
                    icon={Target}
                  />
                  <TracePathStep label="Final Briefing" status="current" icon={CheckCircle2} />
                </div>

                <div style={reasoningBoxStyle}>
                  <div style={reasoningLabelStyle}>Dispatcher Intent Reasoning</div>
                  <div style={{ lineHeight: 1.6, fontSize: 12.5 }}>
                    {lastRouting.intent_reasoning || "Logic-based extraction applied."}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={reasoningBoxStyle}>
                  <div style={reasoningLabelStyle}>Strategic Thinking Loop</div>
                  <div style={{ lineHeight: 1.6, fontSize: 12.5, whiteSpace: "pre-wrap" }}>
                    {lastRouting.thought || "Direct execution path taken without extended reasoning loop."}
                  </div>
                </div>

                <div style={{ marginTop: 24 }}>
                  <div style={detailsLabelStyle}>Tactical Capabilities</div>
                  <div style={toolsListStyle}>
                    {Object.keys(lastRouting.tool_descriptions ?? {}).map((tool) => (
                      <div key={tool} style={toolChipStyle}>
                        <div style={toolDotStyle} />
                        {tool}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
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
