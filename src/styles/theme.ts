import { CSSProperties } from "react";

export const appContainerStyle: CSSProperties = {
  display: "flex",
  height: "100vh",
  width: "100vw",
  background: "#f8fafc",
  overflow: "hidden",
  color: "#1e293b"
};

export const sidebarStyle: CSSProperties = {
  width: 280,
  background: "#f8f9fa",
  padding: "24px 8px 16px",
  display: "flex",
  flexDirection: "column",
  gap: 4,
  borderRight: "1px solid #dadce0",
  zIndex: 10,
  position: "relative",
};

export const sidebarHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: "0 8px 24px",
};

export const logoBadgeStyle: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 8,
  background: "#1a73e8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const primaryPillButton: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "10px 24px",
  borderRadius: 4,
  border: "none",
  background: "#1a73e8",
  color: "#ffffff",
  fontWeight: 500,
  fontSize: 14,
  boxShadow: "0 1px 2px 0 rgba(60,64,67,.30), 0 1px 3px 1px rgba(60,64,67,.15)",
  transition: "background 0.2s ease, box-shadow 0.2s ease",
  cursor: "pointer",
  marginBottom: 12,
  flexShrink: 0,
};

export const navContainerStyle: CSSProperties = {
  display: "grid",
  gap: 4,
  flexShrink: 0,
};

export const navButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  width: "100%",
  padding: "10px 16px",
  borderRadius: 8,
  color: "#5f6368",
  fontWeight: 500,
  fontSize: 13,
  background: "transparent",
  border: "none",
  cursor: "pointer",
  position: "relative",
};

export const activeNavButtonStyle: CSSProperties = {
  color: "#1a73e8",
  background: "#e8f0fe",
};

export const activeNavIndicatorStyle: CSSProperties = {
  position: "absolute",
  left: 0,
  width: 4,
  height: 16,
  background: "var(--brand-primary)",
  borderRadius: "0 4px 4px 0",
};

export const sessionsContainerStyle: CSSProperties = {
  marginTop: 24,
  paddingTop: 12,
  overflowY: "auto",
  flex: 1,
  minHeight: 0,
};

export const sectionLabelStyle: CSSProperties = {
  padding: "0 16px 12px",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: "#5f6368",
  fontWeight: 500,
  borderBottom: "1px solid #dadce0",
  margin: "0 8px 12px",
};

export const sessionCardStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  borderRadius: 4,
  padding: "2px 8px",
  marginBottom: 2,
};

export const activeSessionCardStyle: CSSProperties = {
  background: "#f8f9fa",
};

export const sessionButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  flex: 1,
  minWidth: 0,
  padding: "8px",
  borderRadius: 4,
  background: "transparent",
  border: "none",
  cursor: "pointer",
  textAlign: "left",
};

export const sessionIconStyle = (active: boolean): CSSProperties => ({
  width: 28,
  height: 28,
  borderRadius: 4,
  background: active ? "#e8f0fe" : "#ffffff",
  border: `1px solid ${active ? "#e8f0fe" : "#dadce0"}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: active ? "#1a73e8" : "#dadce0",
});

export const sessionTitleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 400,
  color: "#202124",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

export const sessionTimestampStyle: CSSProperties = {
  fontSize: 10,
  color: "#9aa0a6",
  marginTop: 2,
};

export const trashButtonStyle: CSSProperties = {
  padding: 8,
  borderRadius: 10,
  color: "#dadce0",
  background: "transparent",
  border: "none",
  cursor: "pointer",
};

export const sidebarFooterStyle: CSSProperties = {
  marginTop: "auto",
  borderTop: "1px solid #f1f3f4",
  paddingTop: 12,
  flexShrink: 0,
};

export const statusToggleStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  width: "100%",
  padding: "12px 16px",
  borderRadius: 8,
  background: "transparent",
  color: "#3c4043",
  fontWeight: 500,
  fontSize: 12,
  border: "none",
  cursor: "pointer",
};

export const statusIndicatorWrapStyle = (connected: boolean): CSSProperties => ({
  width: 16,
  height: 16,
  borderRadius: 99,
  background: connected ? "#e6f4ea" : "#fce8e6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const statusDotStyle = (connected: boolean): CSSProperties => ({
  width: 6,
  height: 6,
  borderRadius: 99,
  background: connected ? "#1e8e3e" : "#d93025",
});

export const statusCardStyle: CSSProperties = {
  margin: "4px 8px 12px",
  padding: "12px",
  borderRadius: 8,
  background: "#f8f9fa",
  border: "1px solid #dadce0",
  display: "grid",
  gap: 8,
};

export const messagesPaneStyle: CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "20px 40px",
  scrollBehavior: "smooth",
};

export const emptyRoutingStyle: CSSProperties = {
  padding: 24,
  textAlign: "center",
  color: "#9aa0a6",
  fontSize: 13,
};

export const mainStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
  background: "var(--bg-main)",
  height: "100vh",
  overflow: "hidden",
};

export const pageTitleStyle: CSSProperties = {
  fontSize: 22,
  fontWeight: 400,
  color: "#202124",
  fontFamily: "'Google Sans', Roboto, Arial, sans-serif",
};

export const contentLayout: CSSProperties = {
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  overflow: "auto",
};

export const chatLayoutStyle: CSSProperties = {
  flex: 1,
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) 300px",
  gap: 0,
  minHeight: 0,
  overflow: "hidden",
  background: "#ffffff",
};

export const chatColumnStyle: CSSProperties = {
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  background: "transparent",
  borderRight: "1px solid #e2e8f0",
  height: "100%",
  overflow: "hidden",
};

export const composerOuterWrapStyle: CSSProperties = {
  padding: "0 40px 24px",
  background: "transparent",
  flexShrink: 0,
};

export const contextualSuggestionsWrap: CSSProperties = {
  display: "flex",
  flexWrap: "nowrap",
  gap: 8,
  padding: "8px 0",
  background: "transparent",
  overflowX: "auto",
};

export const inlineSuggestionButtonStyle: CSSProperties = {
  padding: "6px 12px",
  borderRadius: 4,
  background: "#ffffff",
  border: "1px solid #dadce0",
  fontSize: 12,
  fontWeight: 400,
  color: "#5f6368",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

export const composerActionWrap: CSSProperties = {
  display: "flex",
  gap: 6,
};

export const iconCircleButton = (active: boolean): CSSProperties => ({
  width: 40,
  height: 40,
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: active ? "#d93025" : "#f8f9fa",
  border: "none",
  cursor: "pointer",
});

export const sendButtonStyle: CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 4,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#1a73e8",
  color: "#ffffff",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 1px 2px 0 rgba(60,64,67,.30)",
  transition: "all 0.2s ease",
};

export const detailsPanelStyle: CSSProperties = {
  background: "#f8f9fa",
  display: "flex",
  flexDirection: "column",
  padding: "0",
  gap: 0,
  overflow: "hidden",
  borderLeft: "1px solid #dadce0",
};

export const premiumCardStyle: CSSProperties = {
  borderRadius: 8,
  background: "#ffffff",
  padding: 16,
  boxShadow: "0 1px 2px 0 rgba(60,64,67,.30)",
  border: "1px solid #dadce0",
  transition: "all 0.2s ease",
};

export const detailsCardStyle: CSSProperties = {
  ...premiumCardStyle,
  padding: 20,
};

export const detailsHeaderWithToggle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 16,
};

export const detailsTitleStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 900,
  color: "var(--text-primary)",
};

export const traceIndicatorWrap: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontSize: 10,
  fontWeight: 700,
  color: "#1e8e3e",
  textTransform: "uppercase",
};

export const traceDot: CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: 99,
  background: "#1e8e3e",
};

export const detailsLabelStyle: CSSProperties = {
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  fontWeight: 700,
  color: "#80868b",
  marginBottom: 4,
};

export const tracePathOuterStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 0,
  padding: "4px 0",
};

export const tracePathStepStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 16,
  position: "relative",
  padding: "10px 0",
};

export const tracePathLine = (complete: boolean): CSSProperties => ({
  position: "absolute",
  left: 13,
  top: 30,
  bottom: -10,
  width: 2,
  background: complete ? "#e8f0fe" : "#f1f3f4",
  zIndex: 1,
});

export const tracePathIconBox = (complete: boolean, current: boolean): CSSProperties => ({
  width: 28,
  height: 28,
  borderRadius: 10,
  background: current || complete ? "#e8f0fe" : "#f8f9fa",
  border: `1px solid ${current || complete ? "#d2e3fc" : "#f1f3f4"}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2,
  boxShadow: current ? "0 0 0 4px rgba(26,115,232,0.1)" : "none",
});

export const tracePathLabel = (complete: boolean, current: boolean): CSSProperties => ({
  fontSize: 13,
  fontWeight: current ? 700 : 500,
  color: current ? "#1a73e8" : (complete ? "#3c4043" : "#9aa0a6"),
});

export const reasoningBoxStyle: CSSProperties = {
  marginTop: 12,
  padding: "16px",
  borderRadius: 14,
  background: "rgba(26,115,232,0.03)",
  border: "1px solid rgba(26,115,232,0.08)",
  color: "#3c4043",
  boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
};

export const reasoningLabelStyle: CSSProperties = {
  fontSize: 9,
  textTransform: "uppercase",
  letterSpacing: "0.15em",
  fontWeight: 900,
  color: "var(--brand-primary)",
  marginBottom: 8,
  display: "block",
};

export const toolsListStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
};

export const toolChipStyle: CSSProperties = {
  fontSize: 9,
  fontWeight: 800,
  padding: "4px 10px",
  borderRadius: 8,
  background: "var(--bg-main)",
  color: "var(--brand-primary)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  display: "flex",
  alignItems: "center",
  border: "1px solid #e8f0fe",
};

export const toolDotStyle: CSSProperties = {
  width: 5,
  height: 5,
  borderRadius: 99,
  background: "#1a73e8",
  marginRight: 8,
};

export const helpCardStyle: CSSProperties = {
  display: "flex",
  gap: 12,
  padding: "16px",
  borderRadius: 16,
  background: "var(--brand-light)",
  border: "1px solid rgba(124, 58, 237, 0.1)",
};

export const helpIconWrap: CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 8,
  background: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

export const helpTitle: CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  color: "var(--brand-primary)",
  marginBottom: 2,
};

export const helpText: CSSProperties = {
  fontSize: 11,
  color: "#5f6368",
  lineHeight: 1.4,
};

export const selectedAgentBarStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 12px",
  background: "#f8f9fa",
  borderRadius: "12px 12px 0 0",
  border: "1px solid #f1f3f4",
  borderBottom: "none",
};

export const selectedAgentLabelStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  color: "#5f6368",
  textTransform: "uppercase",
};

export const agentHintChipStyle = (agent: string): CSSProperties => ({
  fontSize: 9,
  fontWeight: 800,
  padding: "2px 6px",
  borderRadius: 6,
  background: "var(--brand-primary)",
  color: "#ffffff",
});

export const clearAgentHintButtonStyle: CSSProperties = {
  padding: 4,
  background: "transparent",
  border: "none",
  color: "#dadce0",
  cursor: "pointer",
  marginLeft: "auto",
};

export const agentPickerWrapStyle: CSSProperties = {
  position: "relative",
};

export const agentPickerButtonStyle: CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f8f9fa",
  border: "none",
  color: "#5f6368",
  cursor: "pointer",
};

export const agentPickerMenuStyle: CSSProperties = {
  position: "absolute",
  bottom: "100%",
  left: 0,
  width: 240,
  background: "#ffffff",
  borderRadius: 20,
  boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
  border: "1px solid #f1f3f4",
  padding: 8,
  marginBottom: 12,
  zIndex: 100,
};

export const pickerHeaderStyle: CSSProperties = {
  fontSize: 10,
  fontWeight: 800,
  color: "#9aa0a6",
  textTransform: "uppercase",
  padding: "8px 12px",
  letterSpacing: "0.05em",
};

export const agentPickerItemStyle = (selected: boolean): CSSProperties => ({
  width: "100%",
  padding: "10px 12px",
  borderRadius: 4,
  background: selected ? "#e8f0fe" : "transparent",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  gap: 2,
});

export const pickerItemTitleWrap: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

export const pickerDot = (color: string): CSSProperties => ({
  width: 6,
  height: 6,
  borderRadius: 99,
  background: color,
});

export const agentPickerItemTitleStyle: CSSProperties = {
  fontSize: 13,
  fontWeight: 500,
  color: "#202124",
};

export const agentPickerItemDescriptionStyle: CSSProperties = {
  fontSize: 11,
  color: "#5f6368",
  paddingLeft: 14,
};

export const emptyStateWrapStyle: CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 40px",
  textAlign: "center",
};

export const emptyLogoWrap: CSSProperties = {
  width: 64,
  height: 64,
  borderRadius: 8,
  background: "#e8f0fe",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 20,
};

export const emptyStateTitleStyle: CSSProperties = {
  fontSize: 28,
  fontWeight: 400,
  color: "#202124",
  marginBottom: 8,
  fontFamily: "'Google Sans', sans-serif"
};

export const emptyStateSubtitleStyle: CSSProperties = {
  fontSize: 15,
  color: "#5f6368",
  maxWidth: 400,
  lineHeight: 1.6,
  marginBottom: 40,
};

export const suggestionsContainerStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: 12,
  maxWidth: 600,
};

export const suggestionButtonStyle: CSSProperties = {
  padding: "8px 16px",
  borderRadius: 4,
  background: "#ffffff",
  border: "1px solid #dadce0",
  fontSize: 13,
  fontWeight: 400,
  color: "#202124",
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0 1px 2px 0 rgba(60,64,67,.30)",
};

export const contentWrapStyle: CSSProperties = {
  padding: "40px",
  maxWidth: 1400,
  margin: "0 auto",
  width: "100%",
};

export const researchGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
  gap: 32,
};

export const contentCardStyle: CSSProperties = {
  background: "#ffffff",
  borderRadius: 8,
  padding: "24px",
  border: "1px solid #dadce0",
  boxShadow: "0 1px 2px 0 rgba(60,64,67,.30)",
};

export const cardHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 24,
};

export const cardHeaderTitleStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  fontSize: 16,
  fontWeight: 500,
  color: "#202124",
  fontFamily: "'Google Sans', sans-serif"
};

export const researchQueriesContainerStyle: CSSProperties = {
  display: "grid",
  gap: 12,
};

export const researchButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "12px 16px",
  borderRadius: 4,
  background: "#ffffff",
  border: "1px solid #dadce0",
  textAlign: "left",
  fontSize: 13,
  fontWeight: 400,
  color: "#202124",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

export const messageIconWrap = (isUser: boolean, agentColor: string): CSSProperties => ({
  width: 32,
  height: 32,
  borderRadius: 4,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: isUser ? "#1a73e8" : agentColor,
  flexShrink: 0,
});

export const messageSenderStyle = (isUser: boolean, agentColor: string): CSSProperties => ({
  fontSize: 11,
  fontWeight: 500,
  color: isUser ? "#1a73e8" : agentColor,
});

export const messageMetaStyle = (isUser: boolean): CSSProperties => ({
  display: "flex",
  alignItems: "center",
  justifyContent: isUser ? "flex-end" : "flex-start",
  marginTop: 4,
  color: "#9aa0a6",
});

export const statusLineStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontSize: 12,
};

export const statusLineLabelStyle: CSSProperties = {
  color: "#80868b",
  fontWeight: 500,
};

export const statusLineValueStyle: CSSProperties = {
  color: "#202124",
  fontWeight: 700,
};

export const detailRowStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 0",
};

export const detailValueStyle = (highlight: boolean): CSSProperties => ({
  fontSize: 13,
  fontWeight: 700,
  color: highlight ? "#1a73e8" : "#202124",
});

export const systemMessageStyle: CSSProperties = {
  padding: "6px 20px",
  borderRadius: 40,
  fontSize: 12,
  fontWeight: 500,
  color: "#5f6368",
  background: "#e8eaed",
};

export const modalBackdropStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(32,33,36,0.6)",
  backdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 2000,
};

export const modalCardStyle: CSSProperties = {
  width: "100%",
  maxWidth: 500,
  background: "#ffffff",
  borderRadius: 32,
  padding: 32,
  boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
};

export const modalHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 20,
  marginBottom: 24,
};

export const warningIconWrapStyle: CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 16,
  background: "#fff9eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const modalPromptWrapStyle: CSSProperties = {
  background: "#f8f9fa",
  borderRadius: 20,
  padding: 20,
  marginBottom: 32,
  border: "1px solid #f1f3f4",
};

export const modalPromptStyle: CSSProperties = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.6,
  color: "#3c4043",
  whiteSpace: "pre-wrap",
  fontFamily: "inherit",
};

export const modalActionsStyle: CSSProperties = {
  display: "flex",
  gap: 12,
};

export const primaryActionButton: CSSProperties = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  padding: "14px",
  borderRadius: 16,
  border: "none",
  background: "#1a73e8",
  color: "#ffffff",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
  boxShadow: "0 8px 16px rgba(26,115,232,0.2)",
};

export const secondaryActionButton: CSSProperties = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  padding: "14px",
  borderRadius: 16,
  border: "1px solid #dadce0",
  background: "#ffffff",
  color: "#3c4043",
  fontWeight: 700,
  fontSize: 14,
  cursor: "pointer",
};

export const offlineOverlayStyle: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 5000,
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(20px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: 24,
};

export const kbIntroText: CSSProperties = {
  fontSize: 14,
  color: "#5f6368",
  lineHeight: 1.6,
};

export const fieldLabelStyle: CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 800,
  color: "#5f6368",
  textTransform: "uppercase",
  marginBottom: 8,
};

export const textInputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 14,
  border: "1px solid #dadce0",
  fontSize: 14,
  outline: "none",
  transition: "all 0.2s ease",
};

export const textareaStyle: CSSProperties = {
  width: "100%",
  padding: "16px",
  borderRadius: 14,
  border: "1px solid #dadce0",
  fontSize: 14,
  outline: "none",
  resize: "none",
  transition: "all 0.2s ease",
};

export const alertActionButton: CSSProperties = {
  border: "none",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 12,
  transition: "all 0.2s ease",
};

export const fullPanePanel: CSSProperties = {
  flex: 1,
  height: "100%",
  overflowY: "auto",
};

export const dataPreviewStyle: CSSProperties = {
  fontFamily: "monospace",
  fontSize: 11,
  overflowX: "auto",
};
