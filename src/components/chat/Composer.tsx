import React, { useState, useRef, useEffect } from "react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const pickerRef = useClickOutside(() => setAgentPickerOpen(false));

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      // Cap height at roughly 3 lines (~120px)
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + "px";
      textareaRef.current.style.overflowY = scrollHeight > 120 ? "auto" : "hidden";
    }
  }, [draft]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!draft.trim() || isThinking) return;
    onSend(draft, selectedAgentHint);
    setDraft("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (suggestionsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = suggestionsRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    // Add small delay to ensure rendering is complete
    const timer = setTimeout(checkScroll, 100);
    return () => clearTimeout(timer);
  }, [suggestions]);

  const scrollSuggestions = (direction: 'left' | 'right') => {
    if (suggestionsRef.current) {
      const amount = direction === 'left' ? -200 : 200;
      suggestionsRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div style={composerOuterWrapStyle}>
      {/* Dynamic Suggestions */}
      <div style={{ position: "relative", group: "suggestions" } as any}>
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => scrollSuggestions('left')}
              style={{
                position: "absolute",
                left: 6,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text-tertiary)",
                padding: 0
              }}
            >
              <ChevronUp size={14} style={{ transform: "rotate(-90deg)" }} />
            </motion.button>
          )}
        </AnimatePresence>

        <div 
          ref={suggestionsRef}
          onScroll={checkScroll}
          style={{ 
            ...contextualSuggestionsWrap, 
            marginBottom: "8px",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            maskImage: `linear-gradient(to right, 
              ${canScrollLeft ? 'transparent' : 'black'} 0%, 
              black 10%, 
              black 90%, 
              ${canScrollRight ? 'transparent' : 'black'} 100%)`,
            WebkitMaskImage: `linear-gradient(to right, 
              ${canScrollLeft ? 'transparent' : 'black'} 0%, 
              black 10%, 
              black 90%, 
              ${canScrollRight ? 'transparent' : 'black'} 100%)`,
            padding: "4px 0"
          }} 
          className="hide-scrollbar"
        >
          {suggestions.map((suggestion, i) => (
            <motion.button
              whileHover={{ background: 'var(--brand-light)', scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={suggestion}
              disabled={isThinking}
              style={{
                ...inlineSuggestionButtonStyle,
                background: 'var(--bg-main)',
                border: '1px solid var(--border-light)',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                padding: '8px 18px',
                borderRadius: '20px',
                opacity: isThinking ? 0.6 : 1,
                cursor: isThinking ? 'not-allowed' : 'pointer',
                fontWeight: 500,
                flexShrink: 0,
                transition: "all 0.2s ease"
              }}
              onClick={() => onSend(suggestion, selectedAgentHint)}
            >
              {suggestion}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => scrollSuggestions('right')}
              style={{
                position: "absolute",
                right: 6,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text-tertiary)",
                padding: 0
              }}
            >
              <ChevronUp size={14} style={{ transform: "rotate(90deg)" }} />
            </motion.button>
          )}
        </AnimatePresence>
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

      <div className="input-area" style={{ 
        background: 'var(--bg-card)', 
        borderRadius: selectedAgentHint ? '0 0 16px 16px' : '20px', 
        border: `1px solid ${agentPickerOpen ? 'var(--brand-primary)' : 'var(--border-light)'}`, 
        boxShadow: agentPickerOpen ? '0 4px 20px rgba(0,0,0,0.1)' : 'var(--shadow-sm)', 
        padding: '10px 16px', transition: 'all 0.3s ease',
        display: 'flex', alignItems: 'flex-end', gap: 12
      }}>
        <div style={agentPickerWrapStyle} ref={pickerRef}>
          <button
            type="button"
            disabled={isThinking}
            style={{ 
              ...agentPickerButtonStyle, 
              background: agentPickerOpen ? 'var(--brand-light)' : 'var(--bg-main)',
              color: agentPickerOpen ? 'var(--brand-primary)' : 'var(--text-tertiary)',
              marginBottom: "2px"
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
                style={{ ...agentPickerMenuStyle, width: 280, borderRadius: 12, padding: 8, boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-light)' }}
              >
                <div style={{ ...pickerHeaderStyle, color: 'var(--brand-primary)', display: 'flex', justifyContent: 'space-between', padding: '8px 12px' }}>
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>Specialized Advisory</span>
                </div>
                {AGENT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    style={{ 
                      ...agentPickerItemStyle(selectedAgentHint === option.id),
                      padding: '12px',
                      borderRadius: 12,
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
        
        <div style={{ flex: 1, minHeight: "40px", display: "flex", alignItems: "center" }}>
          <textarea
            ref={textareaRef}
            className="input-field hide-scrollbar"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isThinking ? "Consulting specialized agents..." : "Inquire with Advisory..."}
            disabled={isThinking}
            rows={1}
            style={{ 
              fontSize: '16px', 
              fontWeight: 500, 
              color: 'var(--text-primary)',
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              resize: 'none',
              padding: '8px 0',
              lineHeight: '1.5',
              maxHeight: '120px',
              display: "block"
            }}
          />
        </div>

        <div style={{ ...composerActionWrap, marginBottom: "2px" }}>
          <button type="button" disabled={isThinking} style={{ ...iconCircleButton(isListening), borderRadius: 10, background: isListening ? 'var(--accent-red)' : 'transparent' }} onClick={onVoice}>
            {isListening ? <Mic size={20} color="#fff" /> : <MicOff size={20} color="var(--text-secondary)" />}
          </button>
          <button 
            type="button" 
            onClick={() => handleSubmit()}
            style={{ 
              ...sendButtonStyle, 
              background: draft.trim() && !isThinking ? 'var(--brand-primary)' : 'transparent', 
              color: draft.trim() && !isThinking ? '#fff' : 'var(--border-light)',
              borderRadius: 10,
              width: 36, height: 36,
              transition: "all 0.2s ease",
              boxShadow: draft.trim() && !isThinking ? '0 4px 12px rgba(37, 99, 235, 0.2)' : 'none',
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }} 
            disabled={!draft.trim() || isThinking}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
