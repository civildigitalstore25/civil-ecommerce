import { HelpCircle, Plus, X } from "lucide-react";
import type { ThemeColors } from "../../../../contexts/AdminThemeContext";
import type { FAQ } from "../../../../constants/productFormConstants";

type Props = {
  colors: ThemeColors;
  faqs: FAQ[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: "question" | "answer", value: string) => void;
};

export function AddProductModalFaqSection({ colors, faqs, onAdd, onRemove, onUpdate }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <HelpCircle className="h-5 w-5" style={{ color: colors.interactive.primary }} />
        <h2 className="text-xl font-semibold" style={{ color: colors.text.primary }}>
          Frequently Asked Questions
        </h2>
      </div>
      <p className="text-sm" style={{ color: colors.text.secondary }}>
        Add common questions and answers to help customers understand your product better.
      </p>

      {faqs.length > 0 ? (
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg transition-colors duration-200"
              style={{
                backgroundColor: colors.background.secondary,
                borderColor: colors.border.primary,
              }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium" style={{ color: colors.text.secondary }}>
                    FAQ #{index + 1}
                  </label>
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="p-1 rounded hover:opacity-80 transition-colors duration-200"
                    style={{ color: colors.status.error }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
                    Question
                  </label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => onUpdate(index, "question", e.target.value)}
                    placeholder="Enter the question"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200"
                    style={{
                      backgroundColor: colors.background.primary,
                      borderColor: colors.border.primary,
                      color: colors.text.primary,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.interactive.primary;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.border.primary;
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium" style={{ color: colors.text.secondary }}>
                    Answer
                  </label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => onUpdate(index, "answer", e.target.value)}
                    placeholder="Enter the answer"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 transition-colors duration-200 min-h-[80px]"
                    style={{
                      backgroundColor: colors.background.primary,
                      borderColor: colors.border.primary,
                      color: colors.text.primary,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.interactive.primary;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.border.primary;
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8" style={{ color: colors.text.secondary }}>
          <HelpCircle
            className="h-12 w-12 mx-auto mb-4 opacity-50"
            style={{ color: colors.text.secondary }}
          />
          <p>No FAQs added yet. Click &quot;Add FAQ&quot; to get started.</p>
        </div>
      )}

      <button
        type="button"
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:opacity-80 transition-colors duration-200"
        style={{
          color: colors.interactive.primary,
          borderColor: colors.interactive.primary,
        }}
      >
        <Plus className="h-4 w-4" />
        Add FAQ
      </button>
    </div>
  );
}
