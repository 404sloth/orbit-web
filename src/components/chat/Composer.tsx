import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, MicOff, PlusCircle, XCircle, Sparkles } from "lucide-react";
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
  dynamicSuggestions: string[];
  quickActions: string[];
  selectedAgentHint: string | null;
  setSelectedAgentHint: (agent: string | null) => void;
}

export const Composer: React.FC<ComposerProps> = ({
  onSend,
  onVoice,
  isListening,
  dynamicSuggestions,
  quickActions,
  selectedAgentHint,
  setSelectedAgentHint,
}) => {
  const [draft, setDraft] = useState("");
  const [agentPickerOpen, setAgentPickerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onSend(draft, selectedAgentHint);
    setDraft("");
  };

  return (
    <div style={composerOuterWrapStyle}>
      {/* Quick Actions (Proceed / Reject) */}
      <AnimatePresence>
        {quickActions.length > 0 && (
          <div style={{ ...contextualSuggestionsWrap, marginBottom: "8px" }} className="hide-scrollbar">
            {quickActions.map((action, i) => (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={action}
                style={{
                  ...inlineSuggestionButtonStyle,
                  background: action.toLowerCase() === "proceed" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                  color: action.toLowerCase() === "proceed" ? "#4ade80" : "#f87171",
                  border: `1px solid ${action.toLowerCase() === "proceed" ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"}`,
                  fontWeight: 600,
                  padding: "6px 16px",
                }}
                onClick={() => onSend(action.toLowerCase(), selectedAgentHint)}
              >
                {action}
              </motion.button>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div style={contextualSuggestionsWrap} className="hide-scrollbar">
        {dynamicSuggestions.map((suggestion, i) => (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={suggestion}
            style={inlineSuggestionButtonStyle}
            onClick={() => onSend(suggestion, selectedAgentHint)}
          >
            {suggestion}
          </motion.button>
        ))}
      </div>

      {selectedAgentHint ? (
        <div style={selectedAgentBarStyle}>
          <Sparkles size={12} color={AGENT_COLORS[selectedAgentHint]} />
          <span style={selectedAgentLabelStyle}>Routing:</span>
          <span style={agentHintChipStyle(selectedAgentHint)}>
            {AGENT_OPTIONS.find((option) => option.id === selectedAgentHint)?.label ?? selectedAgentHint}
          </span>
          <button
            type="button"
            style={clearAgentHintButtonStyle}
            onClick={() => setSelectedAgentHint(null)}
          >
            <XCircle size={14} />
          </button>
        </div>
      ) : null}

      <form className="input-area" onSubmit={handleSubmit}>
        <div style={agentPickerWrapStyle}>
          <button
            type="button"
            style={agentPickerButtonStyle}
            onClick={() => setAgentPickerOpen((open) => !open)}
          >
            <PlusCircle size={20} />
          </button>
          <AnimatePresence>
            {agentPickerOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                style={agentPickerMenuStyle}
              >
                <div style={pickerHeaderStyle}>Specialized Agents</div>
                {AGENT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    style={agentPickerItemStyle(selectedAgentHint === option.id)}
                    onClick={() => {
                      setSelectedAgentHint(option.id);
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
            placeholder="Ask anything..."
          />
        </div>
        <div style={composerActionWrap}>
          <button type="button" style={iconCircleButton(isListening)} onClick={onVoice}>
            {isListening ? <Mic size={20} color="#fff" /> : <MicOff size={20} color="#5f6368" />}
          </button>
          <button type="submit" style={sendButtonStyle} disabled={!draft.trim()}>
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};
