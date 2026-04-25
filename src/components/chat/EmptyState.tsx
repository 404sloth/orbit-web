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
        style={emptyLogoWrap}
      >
        <Sparkles size={42} color="#6366f1" />
      </motion.div>
      <div style={emptyStateTitleStyle}>Orbit Intelligence</div>
      <div style={emptyStateSubtitleStyle}>Strategic orchestration across vendors, projects, and compliance.</div>
      <div style={suggestionsContainerStyle}>
        {suggestions.map((suggestion, i) => (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={suggestion}
            style={{ ...suggestionButtonStyle, border: '1px solid #e2e8f0', background: '#fff', color: '#475569' }}
            onClick={() => onSelect(suggestion)}
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
