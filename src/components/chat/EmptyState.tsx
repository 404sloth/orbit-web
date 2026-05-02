import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  emptyStateWrapStyle,
  emptyLogoWrap,
  emptyStateTitleStyle,
  emptyStateSubtitleStyle,
  suggestionsContainerStyle,
  suggestionButtonStyle,
} from "../../styles/theme";

interface EmptyStateProps {
  suggestions: string[];
  onSelect: (text: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ suggestions, onSelect }) => {
  return (
    <div style={emptyStateWrapStyle}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{ ...emptyLogoWrap, background: 'var(--brand-light)', color: 'var(--brand-primary)' }}
      >
        <Sparkles size={42} color="var(--brand-primary)" />
      </motion.div>
      <div style={{ ...emptyStateTitleStyle, color: 'var(--text-primary)', fontSize: 24, fontWeight: 900 }}>Strategic Advisory</div>
      <div style={{ ...emptyStateSubtitleStyle, color: 'var(--text-secondary)' }}>Strategic orchestration across vendors, projects, and compliance.</div>
      <div style={suggestionsContainerStyle}>
        {suggestions.map((suggestion, i) => (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }}
            transition={{ delay: i * 0.05 }}
            key={suggestion}
            style={{ 
              ...suggestionButtonStyle, 
              border: '1px solid var(--border-light)', 
              background: 'var(--bg-card)', 
              color: 'var(--text-secondary)',
              borderRadius: '16px',
              padding: '12px 24px'
            }}
            onClick={() => onSelect(suggestion)}
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
