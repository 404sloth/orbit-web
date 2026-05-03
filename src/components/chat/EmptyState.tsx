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
    <div style={{ ...emptyStateWrapStyle, paddingTop: "80px" }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -15 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 15, stiffness: 100 }}
        whileHover={{ scale: 1.05, rotate: 5 }}
        style={{ 
          ...emptyLogoWrap, 
          background: 'linear-gradient(135deg, var(--brand-primary) 0%, #1557b0 100%)',
          color: '#fff',
          width: 80, height: 80,
          borderRadius: 24,
          marginBottom: 32,
          boxShadow: '0 12px 40px rgba(26, 115, 232, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <motion.div
          animate={{ 
            opacity: [0.2, 0.5, 0.2],
            x: [-40, 80],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          style={{ 
            position: 'absolute', 
            top: 0, left: 0, width: '30%', height: '100%', 
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            transform: 'skewX(-20deg)'
          }}
        />
        <Sparkles size={40} />
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div style={{ ...emptyStateTitleStyle, color: 'var(--text-primary)', fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>
          Strategic Advisory
        </div>
        <div style={{ ...emptyStateSubtitleStyle, color: 'var(--text-secondary)', fontSize: 16, maxWidth: 500, margin: "0 auto 48px", lineHeight: 1.6 }}>
          Your executive AI partner for cross-functional orchestration, risk mitigation, and strategic growth.
        </div>
      </motion.div>

      <div style={{ 
        ...suggestionsContainerStyle, 
        display: "flex", 
        flexDirection: "column", 
        gap: 12, 
        alignItems: "center",
        width: "100%",
        maxWidth: 600
      }}>
        {suggestions.map((suggestion, i) => (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: 8, background: 'var(--brand-light)', borderColor: 'var(--brand-primary)', color: 'var(--brand-primary)' }}
            whileTap={{ scale: 0.98 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            key={suggestion}
            style={{ 
              ...suggestionButtonStyle, 
              width: "100%",
              textAlign: "left",
              border: '1px solid var(--border-light)', 
              background: 'var(--bg-card)', 
              color: 'var(--text-secondary)',
              borderRadius: '12px',
              padding: '16px 24px',
              fontSize: '14px',
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 12,
              boxShadow: 'var(--shadow-xs)'
            }}
            onClick={() => onSelect(suggestion)}
          >
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--brand-primary)", opacity: 0.6 }} />
            {suggestion}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
