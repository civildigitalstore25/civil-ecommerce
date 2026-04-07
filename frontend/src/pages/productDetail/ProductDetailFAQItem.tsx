import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import type { ThemeColors } from "../../contexts/AdminThemeContext";

type Props = {
  question: string;
  answer: string;
  index: number;
  colors: ThemeColors;
};

export const ProductDetailFAQItem: React.FC<Props> = ({ question, answer, index, colors }) => {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <div
      className="rounded-2xl border transition-all duration-300"
      style={{
        backgroundColor: colors.background.secondary,
        borderColor: isOpen ? colors.interactive.primary : colors.border.primary,
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-center justify-between group transition-colors duration-200"
        style={{ color: colors.text.primary }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200"
            style={{
              backgroundColor: isOpen
                ? colors.interactive.primary
                : colors.background.primary,
              color: isOpen ? colors.background.primary : colors.text.secondary,
            }}
          >
            {index + 1}
          </div>
          <h4 className="text-lg font-semibold group-hover:opacity-80">{question}</h4>
        </div>
        <div
          className={`w-6 h-6 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          style={{ color: colors.interactive.primary }}
        >
          <LucideIcons.ChevronDown size={24} />
        </div>
      </button>

      {isOpen && (
        <div className="px-6 pb-6">
          <div
            className="pl-12 border-l-2 transition-colors duration-200"
            style={{ borderColor: colors.interactive.primary + "30" }}
          >
            <div
              className="leading-relaxed"
              style={{ color: colors.text.secondary }}
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
