import React from "react";
import { ChevronRight } from "lucide-react";
import { RESEARCH_CATEGORIES } from "../../utils/constants";
import { contentWrapStyle, researchGridStyle, contentCardStyle, cardHeaderStyle, cardHeaderTitleStyle, researchQueriesContainerStyle, researchButtonStyle } from "../../styles/theme";

interface ResearchPanelProps {
  onSend: (text: string) => void;
  setActiveTab: (tab: any) => void;
}

export const ResearchPanel: React.FC<ResearchPanelProps> = ({ onSend, setActiveTab }) => {
  return (
    <div style={contentWrapStyle}>
      <div style={researchGridStyle}>
        {RESEARCH_CATEGORIES.map((category) => (
          <div key={category.title} style={contentCardStyle}>
            <div style={cardHeaderStyle}>
              <span style={cardHeaderTitleStyle}>
                <category.icon size={20} color={category.color} />
                {category.title}
              </span>
            </div>
            <div style={researchQueriesContainerStyle}>
              {category.queries.map((query) => (
                <button
                  key={query}
                  style={researchButtonStyle}
                  onClick={() => {
                    setActiveTab("conversations");
                    onSend(query);
                  }}
                >
                  <ChevronRight size={14} color="var(--border-light)" />
                  {query}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
