import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, MicOff, PlusCircle, XCircle, Sparkles, Lightbulb } from "lucide-react";
import { AGENT_OPTIONS, AGENT_COLORS } from "../../utils/constants";
import {
  composerOuterWrapStyle,
  contextualSuggestionsWrap,
  inlineSuggestionButtonStyle,
  selectedAgentBarStyle,
  selectedAgentLabelStyle,
  agentHintChipStyle,
  clearAgentHintButtonStyle,
  agentPickerWrapStyle,
  agentPickerButtonStyle,
  agentPickerMenuStyle,
  pickerHeaderStyle,
  agentPickerItemStyle,
  pickerItemTitleWrap,
  pickerDot,
  agentPickerItemTitleStyle,
  agentPickerItemDescriptionStyle,
  composerActionWrap,
  iconCircleButton,
  sendButtonStyle,
} from "../../styles/theme";

interface ComposerProps {
  onSend: (text: string, agentHint?: string | null) => void;
  onVoice: () => void;
  isListening: boolean;
  isThinking: boolean;
  suggestions: string[];
  quickActions: string[];
  selectedAgentHint: string | null;
  onAgentChange: (agent: string | null) => void;
}

export const Composer: React.FC<ComposerProps> = ({
  onSend,
  onVoice,
  isListening,
  isThinking,
  suggestions,
  quickActions,
  selectedAgentHint,
  onAgentChange,
}) => {
  const [draft, setDraft] = useState("");
  const [agentPickerOpen, setAgentPickerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || isThinking) return;
    onSend(draft, selectedAgentHint);
    setDraft("");
  };

  return (
    <div style={composerOuterWrapStyle}>
      {/* Dynamic Suggestions (Frequently Asked / History Based) */}
      <div style={{ ...contextualSuggestionsWrap, marginBottom: "12px" }} className="hide-scrollbar">
        {suggestions.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 12, color: '#6366f1' }}>
            <Lightbulb size={14} />
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}></span>
          </div>
        )}
        {suggestions.slice(0, 5).map((suggestion, i) => (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            key={suggestion}
            disabled={isThinking}
            style={{
              ...inlineSuggestionButtonStyle,
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              color: '#475569',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              fontSize: '12px',
              padding: '6px 14px',
              opacity: isThinking ? 0.6 : 1,
              cursor: isThinking ? 'not-allowed' : 'pointer'
            }}
            onClick={() => onSend(suggestion, selectedAgentHint)}
          >
            {suggestion}
          </motion.button>
        ))}
      </div>

      {/* Quick Actions (Proceed / Reject) */}
      <AnimatePresence>
        {quickActions.length > 0 && (
          <div style={{ ...contextualSuggestionsWrap, marginBottom: "12px" }} className="hide-scrollbar">
            {quickActions.map((action, i) => (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={action}
                disabled={isThinking}
                style={{
                  ...inlineSuggestionButtonStyle,
                  background: action.toLowerCase() === "proceed" ? "#22c55e" : "#ef4444",
                  color: "#fff",
                  border: "none",
                  fontWeight: 700,
                  padding: "6px 16px",
                  boxShadow: action.toLowerCase() === "proceed" ? "0 4px 12px rgba(34, 197, 94, 0.2)" : "0 4px 12px rgba(239, 68, 68, 0.2)",
                  opacity: isThinking ? 0.6 : 1,
                  cursor: isThinking ? 'not-allowed' : 'pointer'
                }}
                onClick={() => onSend(action.toLowerCase(), selectedAgentHint)}
              >
                {action}
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>

      {selectedAgentHint ? (
        <div style={selectedAgentBarStyle}>
          <Sparkles size={12} color={AGENT_COLORS[selectedAgentHint]} />
          <span style={selectedAgentLabelStyle}>Routing:</span>
          <span style={agentHintChipStyle(selectedAgentHint)}>
            {AGENT_OPTIONS.find((option) => option.id === selectedAgentHint)?.label ?? selectedAgentHint}
          </span>
          <button
            type="button"
            disabled={isThinking}
            style={clearAgentHintButtonStyle}
            onClick={() => onAgentChange(null)}
          >
            <XCircle size={14} />
          </button>
        </div>
      ) : null}

      <form className="input-area" style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', padding: '4px 12px' }} onSubmit={handleSubmit}>
        <div style={agentPickerWrapStyle}>
          <button
            type="button"
            disabled={isThinking}
            style={agentPickerButtonStyle}
            onClick={() => setAgentPickerOpen((open) => !open)}
          >
            <PlusCircle size={20} color="#64748b" />
          </button>
          <AnimatePresence>
            {agentPickerOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                style={agentPickerMenuStyle}
              >
                <div style={pickerHeaderStyle}>Agents & Skills</div>
                {AGENT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    style={agentPickerItemStyle(selectedAgentHint === option.id)}
                    onClick={() => {
                      onAgentChange(option.id);
                      setAgentPickerOpen(false);
                    }}
                  >
                    <div style={pickerItemTitleWrap}>
                      <div style={pickerDot(AGENT_COLORS[option.id])} />
                      <span style={agentPickerItemTitleStyle}>{option.label}</span>
                    </div>
                    <span style={agentPickerItemDescriptionStyle}>{option.description}</span>
                  </button>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div className="input-container">
          <input
            className="input-field"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={isThinking ? "Thinking..." : "Ask anything..."}
            disabled={isThinking}
            style={{ fontSize: '15px', fontWeight: 500 }}
          />
        </div>
        <div style={composerActionWrap}>
          <button type="button" disabled={isThinking} style={iconCircleButton(isListening)} onClick={onVoice}>
            {isListening ? <Mic size={20} color="#fff" /> : <MicOff size={20} color="#64748b" />}
          </button>
          <button type="submit" style={{ ...sendButtonStyle, background: draft.trim() && !isThinking ? '#6366f1' : '#f1f5f9', color: draft.trim() && !isThinking ? '#fff' : '#94a3b8' }} disabled={!draft.trim() || isThinking}>
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};
