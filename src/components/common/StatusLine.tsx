import React from "react";
import { statusLineStyle, statusLineLabelStyle, statusLineValueStyle } from "../../styles/theme";

interface StatusLineProps {
  label: string;
  value: string;
}

export const StatusLine: React.FC<StatusLineProps> = ({ label, value }) => {
  return (
    <div style={statusLineStyle}>
      <span style={statusLineLabelStyle}>{label}</span>
      <span style={statusLineValueStyle}>{value}</span>
    </div>
  );
};
