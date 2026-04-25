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
  onPickSuggestion: (text: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ suggestions, onPickSuggestion }) => {
  return (
    <div style={emptyStateWrapStyle}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={emptyLogoWrap}
      >
        <Sparkles size={42} color="#1a73e8" />
      </motion.div>
      <div style={emptyStateTitleStyle}>Human CoPilot</div>
      <div style={emptyStateSubtitleStyle}>It orchestrates complex cross-domain tasks using specialized agents.</div>
      <div style={suggestionsContainerStyle}>
        {suggestions.map((suggestion, i) => (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={suggestion}
            style={suggestionButtonStyle}
            onClick={() => onPickSuggestion(suggestion)}
          >
            {suggestion}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
