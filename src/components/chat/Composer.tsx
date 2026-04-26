import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, MicOff, PlusCircle, XCircle, Sparkles, Lightbulb, ChevronUp } from "lucide-react";
import { AGENT_OPTIONS, AGENT_COLORS } from "../../utils/constants";
import { useClickOutside } from "../../hooks/useClickOutside";
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

  const pickerRef = useClickOutside(() => setAgentPickerOpen(false));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || isThinking) return;
    onSend(draft, selectedAgentHint);
    setDraft("");
  };

  return (
    <div style={composerOuterWrapStyle}>
      {/* Dynamic Suggestions */}
      <div style={{ ...contextualSuggestionsWrap, marginBottom: "12px" }} className="hide-scrollbar">
        {suggestions.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 12, color: 'var(--brand-primary)' }}>
            <Lightbulb size={14} />
          </div>
        )}
        {suggestions.slice(0, 5).map((suggestion, i) => (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02, background: 'var(--brand-light)' }}
            whileTap={{ scale: 0.98 }}
            key={suggestion}
            disabled={isThinking}
            style={{
              ...inlineSuggestionButtonStyle,
              background: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(8px)',
              border: '1px solid var(--border-light)',
              color: 'var(--text-secondary)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              fontSize: '12px',
              padding: '8px 16px',
              opacity: isThinking ? 0.6 : 1,
              cursor: isThinking ? 'not-allowed' : 'pointer'
            }}
            onClick={() => onSend(suggestion, selectedAgentHint)}
          >
            {suggestion}
          </motion.button>
        ))}
      </div>

      {/* Quick Actions */}
      <AnimatePresence>
        {quickActions.length > 0 && (
          <div style={{ ...contextualSuggestionsWrap, marginBottom: "12px" }} className="hide-scrollbar">
            {quickActions.map((action, i) => (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                key={action}
                disabled={isThinking}
                style={{
                  ...inlineSuggestionButtonStyle,
                  background: action.toLowerCase() === "proceed" ? "var(--accent-green)" : "var(--accent-red)",
                  color: "#fff",
                  border: "none",
                  fontWeight: 800,
                  padding: "8px 20px",
                  boxShadow: action.toLowerCase() === "proceed" ? "0 4px 15px rgba(5, 150, 105, 0.3)" : "0 4px 15px rgba(220, 38, 38, 0.3)",
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
        <div style={{ ...selectedAgentBarStyle, background: 'var(--brand-light)', borderColor: 'rgba(109, 40, 217, 0.2)', padding: '8px 16px' }}>
          <Sparkles size={14} color="var(--brand-primary)" />
          <span style={{ ...selectedAgentLabelStyle, color: 'var(--brand-primary)' }}>Routed to:</span>
          <span style={{ 
            ...agentHintChipStyle(selectedAgentHint), 
            background: 'var(--brand-primary)', 
            color: '#fff',
            borderRadius: '6px',
            padding: '2px 8px',
            fontSize: '10px',
            fontWeight: 800
          }}>
            {AGENT_OPTIONS.find((option) => option.id === selectedAgentHint)?.label ?? selectedAgentHint}
          </span>
          <button
            type="button"
            disabled={isThinking}
            style={{ ...clearAgentHintButtonStyle, color: 'var(--brand-primary)', opacity: 0.6 }}
            onClick={() => onAgentChange(null)}
          >
            <XCircle size={16} />
          </button>
        </div>
      ) : null}

      <form className="input-area" style={{ 
        background: '#fff', borderRadius: '24px', 
        border: `2px solid ${agentPickerOpen ? 'var(--brand-primary)' : 'var(--border-light)'}`, 
        boxShadow: agentPickerOpen ? '0 8px 32px rgba(124, 58, 237, 0.1)' : '0 4px 20px rgba(0,0,0,0.02)', 
        padding: '6px 12px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', alignItems: 'center', gap: 12
      }} onSubmit={handleSubmit}>
        <div style={agentPickerWrapStyle} ref={pickerRef}>
          <button
            type="button"
            disabled={isThinking}
            style={{ 
              ...agentPickerButtonStyle, 
              background: agentPickerOpen ? 'var(--brand-light)' : 'var(--bg-main)',
              color: agentPickerOpen ? 'var(--brand-primary)' : 'var(--text-tertiary)'
            }}
            onClick={() => setAgentPickerOpen((open) => !open)}
          >
            <PlusCircle size={22} />
          </button>
          <AnimatePresence>
            {agentPickerOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 15, scale: 0.95, filter: "blur(4px)" }}
                style={{ ...agentPickerMenuStyle, width: 280, borderRadius: 24, padding: 12, boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}
              >
                <div style={{ ...pickerHeaderStyle, color: 'var(--brand-primary)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Select Expert Agent</span>
                  <ChevronUp size={14} />
                </div>
                {AGENT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    style={{ 
                      ...agentPickerItemStyle(selectedAgentHint === option.id),
                      padding: '12px',
                      borderRadius: 16,
                      background: selectedAgentHint === option.id ? 'var(--brand-light)' : 'transparent'
                    }}
                    onClick={() => {
                      onAgentChange(option.id);
                      setAgentPickerOpen(false);
                    }}
                  >
                    <div style={pickerItemTitleWrap}>
                      <div style={pickerDot(AGENT_COLORS[option.id])} />
                      <span style={{ ...agentPickerItemTitleStyle, color: selectedAgentHint === option.id ? 'var(--brand-primary)' : 'var(--text-primary)' }}>{option.label}</span>
                    </div>
                    <span style={{ ...agentPickerItemDescriptionStyle, color: 'var(--text-tertiary)' }}>{option.description}</span>
                  </button>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <div className="input-container" style={{ background: 'transparent', padding: 0 }}>
          <input
            className="input-field"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={isThinking ? "Consulting agents..." : "Message Orbit AI..."}
            disabled={isThinking}
            style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}
          />
        </div>
        <div style={composerActionWrap}>
          <button type="button" disabled={isThinking} style={{ ...iconCircleButton(isListening), borderRadius: 14 }} onClick={onVoice}>
            {isListening ? <Mic size={20} color="#fff" /> : <MicOff size={20} color="var(--text-tertiary)" />}
          </button>
          <button 
            type="submit" 
            style={{ 
              ...sendButtonStyle, 
              background: draft.trim() && !isThinking ? 'var(--brand-gradient)' : 'var(--bg-main)', 
              color: draft.trim() && !isThinking ? '#fff' : 'var(--text-tertiary)',
              borderRadius: 14,
              width: 42, height: 42
            }} 
            disabled={!draft.trim() || isThinking}
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};
