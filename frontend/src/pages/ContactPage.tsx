import React, { useState } from "react";
import { useSubmitContactForm } from "../api/contactApi";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
// import AdminThemeToggle from "../components/ThemeToggle/AdminThemeToggle";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const submitContactForm = useSubmitContactForm();
  const { colors } = useAdminTheme();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContactForm.mutate(formData, {
      onSuccess: () => {
        setFormData({ name: "", email: "", subject: "", message: "" });
      },
    });
  };

  const googleMapsEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d250875.31940063165!2d79.082117!3d10.74012!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baabee185555555%3A0xcbb0bd1ecb02b6ec!2sCivil%20DigitalStore!5e0!3m2!1sen!2sin!4v1758196477578!5m2!1sen!2sin";

  return (
    <div
      className="min-h-[calc(100vh-120px)] p-6 md:p-10 relative"
      style={{
        background: `linear-gradient(135deg, ${colors.background.primary}, ${colors.background.secondary})`
      }}
    >
      

      <div
        className="mx-auto max-w-6xl rounded-xl shadow-xl overflow-hidden"
        style={{ backgroundColor: colors.background.secondary }}
      >
        {/* Header */}
        <div
          className="p-10 text-center"
          style={{
            background: `linear-gradient(135deg, ${colors.interactive.primary}90, ${colors.interactive.primaryHover}90)`,
            backgroundColor: colors.background.tertiary
          }}
        >
          <h1
            className="mb-2 text-3xl md:text-4xl font-bold"
            style={{ color: colors.text.primary }}
          >
            Contact Us
          </h1>
          <p
            className="mx-auto max-w-xl opacity-90"
            style={{ color: colors.text.secondary }}
          >
            We'd love to hear from you. Please fill out the form below or visit
            our headquarters.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-10">
          {/* Left side - Info */}
          <div className="space-y-6">
            <div className="space-y-5">
              {/* Phone */}
              <div
                className="flex gap-4 rounded-lg border-l-4 p-5"
                style={{
                  backgroundColor: colors.background.tertiary,
                  borderLeftColor: `${colors.interactive.primary}90`
                }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${colors.interactive.primary}90, ${colors.interactive.primaryHover})`,
                    color: colors.text.primary
                  }}
                >
                  <Phone size={20} />
                </div>
                <div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    Call to Us:
                  </h3>
                  <p style={{ color: colors.text.secondary }}>
                    We're available 24/7, 7 days a week.
                  </p>
                  <p
                    className="font-semibold"
                    style={{ color: colors.interactive.primary }}
                  >
                    +918807423228
                  </p>
                </div>
              </div>

              {/* Email */}
              <div
                className="flex gap-4 rounded-lg border-l-4 p-5"
                style={{
                  backgroundColor: colors.background.tertiary,
                  borderLeftColor: `${colors.interactive.primary}90`
                }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${colors.interactive.primary}90, ${colors.interactive.primaryHover})`,
                    color: colors.text.primary
                  }}
                >
                  <Mail size={20} />
                </div>
                <div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    Write to Us:
                  </h3>
                  <p style={{ color: colors.text.secondary }}>
                    Fill out our form and we will contact you within 24 hours.
                  </p>
                  <p
                    className="font-semibold"
                    style={{ color: colors.interactive.primary }}
                  >
                    Civildigitalstore@gmail.com
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div
                className="flex gap-4 rounded-lg border-l-4 p-5"
                style={{
                  backgroundColor: colors.background.tertiary,
                  borderLeftColor: `${colors.interactive.primary}90`
                }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${colors.interactive.primary}90, ${colors.interactive.primaryHover})`,
                    color: colors.text.primary
                  }}
                >
                  <Clock size={20} />
                </div>
                <div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    Business Hours:
                  </h3>
                  <p style={{ color: colors.text.secondary }}>Monday - Friday: 9:00-20:00</p>
                  <p style={{ color: colors.text.secondary }}>Saturday: 11:00 - 15:00</p>
                  <p style={{ color: colors.text.secondary }}>Sunday: Closed</p>
                </div>
              </div>

              {/* Address */}
              <div
                className="flex gap-4 rounded-lg border-l-4 p-5"
                style={{
                  backgroundColor: colors.background.tertiary,
                  borderLeftColor: `${colors.interactive.primary}90`
                }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${colors.interactive.primary}90, ${colors.interactive.primaryHover})`,
                    color: colors.text.primary
                  }}
                >
                  <MapPin size={20} />
                </div>
                <div>
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: colors.text.primary }}
                  >
                    Headquarters Address:
                  </h3>
                  <p style={{ color: colors.text.secondary }}>Civil Digital Store</p>
                  <p style={{ color: colors.text.secondary }}>Thanjavur, Tamilnadu</p>
                  <p style={{ color: colors.text.secondary }}>India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={submitContactForm.isPending}
                  placeholder="Enter your full name"
                  className="rounded-lg border-2 px-4 py-2 focus:ring disabled:cursor-not-allowed disabled:opacity-70"
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
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-semibold"
                  style={{ color: colors.text.primary }}
                >
                  Your Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={submitContactForm.isPending}
                  placeholder="Enter your email address"
                  className="rounded-lg border-2 px-4 py-2 focus:ring disabled:cursor-not-allowed disabled:opacity-70"
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

            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold"
                style={{ color: colors.text.primary }}
              >
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                disabled={submitContactForm.isPending}
                placeholder="What is this regarding?"
                className="rounded-lg border-2 px-4 py-2 focus:ring disabled:cursor-not-allowed disabled:opacity-70"
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

            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold"
                style={{ color: colors.text.primary }}
              >
                Your Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                disabled={submitContactForm.isPending}
                placeholder="Tell us more about your inquiry..."
                className="rounded-lg border-2 px-4 py-2 focus:ring disabled:cursor-not-allowed disabled:opacity-70"
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

            <button
              type="submit"
              disabled={submitContactForm.isPending}
              className="flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
              style={{
                background: `linear-gradient(135deg, ${colors.interactive.primary}90, ${colors.interactive.primaryHover})`,
                color: colors.text.inverse,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {submitContactForm.isPending ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
                    style={{
                      borderColor: colors.text.inverse,
                      borderTopColor: 'transparent'
                    }}
                  ></span>
                  Sending...
                </>
              ) : (
                "SUBMIT MESSAGE"
              )}
            </button>
          </form>
        </div>

        {/* Map Section */}
        <div
          className="mx-auto my-6 w-11/12 rounded-lg p-5 shadow-md"
          style={{
            background: `linear-gradient(135deg, ${colors.background.tertiary}, ${colors.background.secondary})`,
          }}
        >
          <div className="overflow-hidden rounded-lg shadow">
            <iframe
              src={googleMapsEmbedUrl}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Civil Digital Store Location"
              className="rounded-lg"
            />
          </div>
          <div className="mt-4 text-center">
            <a
              href="https://maps.app.goo.gl/UsepnwEqHCPHX3JY7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md px-5 py-2 font-medium transition"
              style={{
                background: `linear-gradient(135deg, ${colors.interactive.primary}90, ${colors.interactive.primaryHover})`,
                backgroundColor: colors.background.tertiary,
                color: colors.text.primary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, ${colors.interactive.primary}90, ${colors.interactive.primaryHover}90)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, ${colors.interactive.primary}90, ${colors.interactive.primaryHover})`;
              }}
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
