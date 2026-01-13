import React, { useState } from "react";
import { X } from "lucide-react";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { createEnquiry } from "../api/enquiryApi";
import Swal from "sweetalert2";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    _id: string;
    name: string;
    image: string;
    version?: string;
  };
}

const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { colors } = useAdminTheme();
  const [formData, setFormData] = useState({
    subject: product ? `Enquiry about ${product.name}` : "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.message.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please fill in all fields",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await createEnquiry({
        productId: product?._id,
        subject: formData.subject,
        message: formData.message,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Your enquiry has been submitted successfully! We'll respond soon.",
        timer: 3000,
      });

      setFormData({ subject: "", message: "" });
      onClose();
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to submit enquiry",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div
        className="w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: colors.background.secondary }}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between p-6 border-b"
          style={{
            backgroundColor: colors.background.secondary,
            borderColor: colors.border.primary,
          }}
        >
          <h2
            className="text-2xl font-bold"
            style={{ color: colors.text.primary }}
          >
            Submit Enquiry
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{
              color: colors.text.secondary,
              backgroundColor: colors.background.accent,
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Info */}
          {product && (
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: colors.background.accent,
                borderColor: colors.border.primary,
              }}
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-contain rounded-lg"
                  style={{ backgroundColor: colors.background.secondary }}
                />
                <div>
                  <h3
                    className="font-semibold text-lg"
                    style={{ color: colors.text.primary }}
                  >
                    {product.name}
                  </h3>
                  {product.version && (
                    <p
                      className="text-sm"
                      style={{ color: colors.text.secondary }}
                    >
                      Version: {product.version}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Subject */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.text.primary }}
            >
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg border outline-none transition-colors"
              style={{
                backgroundColor: colors.background.primary,
                borderColor: colors.border.primary,
                color: colors.text.primary,
              }}
              placeholder="Enter enquiry subject"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: colors.text.primary }}
            >
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={6}
              className="w-full px-4 py-3 rounded-lg border outline-none resize-none transition-colors"
              style={{
                backgroundColor: colors.background.primary,
                borderColor: colors.border.primary,
                color: colors.text.primary,
              }}
              placeholder="Type your enquiry here..."
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: colors.background.accent,
                color: colors.text.primary,
              }}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg font-medium transition-colors"
              style={{
                backgroundColor: colors.interactive.primary,
                color: "#ffffff",
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Enquiry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnquiryModal;
