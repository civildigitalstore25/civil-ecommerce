import React from "react";
import { Controller } from "react-hook-form";
import { Helmet } from "react-helmet";
import { useAppForm } from "../hooks/useAppForm";
import { useSubmitContactForm } from "../api/contactApi";
import { useAdminTheme } from "../contexts/AdminThemeContext";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { getContactSEO } from "../utils/seo";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const submitContactForm = useSubmitContactForm();
  const { colors, theme } = useAdminTheme();
  const seoData = getContactSEO();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useAppForm<ContactFormData>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormData) => {
    submitContactForm.mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  const googleMapsEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d250875.31940063165!2d79.082117!3d10.74012!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baabee185555555%3A0xcbb0bd1ecb02b6ec!2sCivil%20DigitalStore!5e0!3m2!1sen!2sin!4v1758196477578!5m2!1sen!2sin";

  return (
    <>
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <div
        className="min-h-[calc(100vh-120px)] p-6 md:p-10 pt-20 relative mt-20"
        style={{
          backgroundColor: theme === "light" ? "#F5F7FA" : colors.background.primary,
        }}
      >
        <div
          className="mx-auto max-w-6xl rounded-xl shadow-xl overflow-hidden"
          style={{
            backgroundColor: theme === "light" ? "#fff" : colors.background.secondary,
            border: `1px solid ${theme === "light" ? "#E2E8F0" : colors.border.primary}`,
          }}
        >
          {/* Header */}
          <div
            className="p-10 text-center"
            style={{
              background: "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)",
            }}
          >
            <h1
              className="mb-2 text-3xl md:text-4xl font-bold"
              style={{ color: "#fff" }}
            >
              Contact Us
            </h1>
            <p
              className="mx-auto max-w-xl opacity-90"
              style={{ color: "#fff" }}
            >
              Customer satisfaction is our top priority. Our support team is ready to help you at every step.
            </p>
          </div>

          {/* Introduction Section */}
          <div className="p-10 pb-5">
            <div
              className="rounded-lg p-6"
              style={{
                backgroundColor: theme === "light" ? "#F8FAFC" : colors.background.primary,
                border: `1px solid ${theme === "light" ? "#E2E8F0" : colors.border.primary}`,
              }}
            >
              <p
                className="text-base leading-relaxed mb-4"
                style={{ color: theme === "light" ? "#1E293B" : colors.text.primary }}
              >
                At SoftZcart, customer satisfaction is our top priority. Whether you have a question about a product, need assistance with activation, want to check your order status, or have any feedback, our support team is ready to help you at every step.
              </p>
              <p
                className="text-base leading-relaxed"
                style={{ color: theme === "light" ? "#1E293B" : colors.text.primary }}
              >
                We understand how important genuine digital software is for your work, studies, and security. Our dedicated support team is committed to providing quick responses, expert guidance, and a personalized experience.
              </p>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-10 pt-5">
            {/* Left side - Info */}
            <div className="space-y-6">
              {/* How to Reach Us Section */}
              <div>
                <h2
                  className="text-2xl font-bold mb-5"
                  style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
                >
                  How to Reach Us
                </h2>
                <p
                  className="text-sm mb-5 leading-relaxed"
                  style={{ color: theme === "light" ? "#475569" : colors.text.secondary }}
                >
                  You can contact us anytime through the following channels:
                </p>
              </div>

              <div className="space-y-5">
                <div
                  className="flex gap-4 rounded-lg border-l-4 p-5"
                  style={{
                    backgroundColor: theme === "light" ? "#fff" : colors.background.secondary,
                    border: theme === "light" ? `1px solid #384354` : `2px solid #384354`,
                    color: theme === "light" ? "#0A2A6B" : colors.text.primary,
                  }}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{
                      background: "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)",
                      color: "#fff",
                    }}
                  >
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
                    >
                      Phone & WhatsApp Support
                    </h3>
                    <p className="text-sm mb-2" style={{ color: theme === "light" ? "#475569" : colors.text.secondary }}>
                      For quick support or custom order inquiries, you can call or message us.
                    </p>
                    <p
                      className="font-semibold mb-1"
                      style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
                    >
                      <a href="tel:+919042993986" className="hover:underline" style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}>
                        +91 90429 93986
                      </a>
                    </p>
                    <p className="text-sm" style={{ color: theme === "light" ? "#475569" : colors.text.secondary }}>
                      Available for both voice calls and WhatsApp chat 24×7.
                    </p>
                  </div>
                </div>

                <div
                  className="flex gap-4 rounded-lg border-l-4 p-5"
                  style={{
                    backgroundColor: theme === "light" ? "#fff" : colors.background.secondary,
                    border: theme === "light" ? `1px solid #384354` : `2px solid #384354`,
                    color: theme === "light" ? "#0A2A6B" : colors.text.primary,
                  }}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{
                      background: "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)",
                      color: "#fff",
                    }}
                  >
                    <Mail size={20} />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
                    >
                      Email Support
                    </h3>
                    <p className="text-sm mb-2" style={{ color: theme === "light" ? "#475569" : colors.text.secondary }}>
                      For detailed queries, product guidance, or activation support.
                    </p>
                    <p
                      className="font-semibold mb-1"
                      style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
                    >
                      softzcart@gmail.com
                    </p>
                    <p className="text-sm" style={{ color: theme === "light" ? "#475569" : colors.text.secondary }}>
                      We typically respond within 1 to 6 hours depending on the query volume.
                    </p>
                  </div>
                </div>

                <div
                  className="flex gap-4 rounded-lg border-l-4 p-5"
                  style={{
                    backgroundColor: theme === "light" ? "#fff" : colors.background.secondary,
                    border: theme === "light" ? `1px solid #384354` : `2px solid #384354`,
                    color: theme === "light" ? "#0A2A6B" : colors.text.primary,
                  }}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{
                      background: "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)",
                      color: "#fff",
                    }}
                  >
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
                    >
                      Website Helpdesk
                    </h3>
                    <p className="text-sm mb-2" style={{ color: theme === "light" ? "#475569" : colors.text.secondary }}>
                      Visit our website and use the contact form or upcoming live chat feature for direct assistance.
                    </p>
                    <p
                      className="font-semibold"
                      style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
                    >
                      www.softzcart.com
                    </p>
                  </div>
                </div>

                <div
                  className="flex gap-4 rounded-lg border-l-4 p-5"
                  style={{
                    backgroundColor: theme === "light" ? "#fff" : colors.background.secondary,
                    border: theme === "light" ? `1px solid #384354` : `2px solid #384354`,
                    color: theme === "light" ? "#0A2A6B" : colors.text.primary,
                  }}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{
                      background: "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)",
                      color: "#fff",
                    }}
                  >
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
                    >
                      Headquarters Address
                    </h3>
                    <p style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}>Civil DigitalStore</p>
                    <p style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}>D.No.2/308, Main Road</p>
                    <p style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}>Ellammal Colony, Pillaiyarpatti</p>
                    <p style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}>Thanjavur-613403</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right side - Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <h2
                className="text-2xl font-bold mb-5"
                style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
              >
                Connect
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name Field */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-sm font-semibold"
                    style={{ color: theme === "light" ? colors.text.primary : colors.text.accent }}
                  >
                    Your Name *
                  </label>
                  <Controller
                    name="name"
                    control={control}
                    rules={{
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "Name must not exceed 50 characters",
                      },
                      pattern: {
                        value: /^[a-zA-Z\s]+$/,
                        message: "Name can only contain letters and spaces",
                      },
                    }}
                    render={({ field }) => (
                      <input
                        type="text"
                        value={field.value}
                        onChange={field.onChange}
                        disabled={submitContactForm.isPending}
                        placeholder="Enter your full name"
                        className={`rounded-lg border-2 px-4 py-2 focus:ring disabled:cursor-not-allowed disabled:opacity-70 ${errors.name ? "border-red-500" : ""}`}
                        style={{
                          backgroundColor: colors.background.primary,
                          borderColor: errors.name ? "#ef4444" : colors.border.primary,
                          color: colors.text.primary,
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = errors.name ? "#ef4444" : colors.interactive.primary;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.name ? "#ef4444" : colors.border.primary;
                        }}
                      />
                    )}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-sm font-semibold"
                    style={{ color: theme === "light" ? colors.text.primary : colors.text.accent }}
                  >
                    Your Email *
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                    }}
                    render={({ field }) => (
                      <input
                        type="email"
                        value={field.value}
                        onChange={field.onChange}
                        disabled={submitContactForm.isPending}
                        placeholder="Enter your email address"
                        className={`rounded-lg border-2 px-4 py-2 focus:ring disabled:cursor-not-allowed disabled:opacity-70 ${errors.email ? "border-red-500" : ""}`}
                        style={{
                          backgroundColor: colors.background.primary,
                          borderColor: errors.email ? "#ef4444" : colors.border.primary,
                          color: colors.text.primary,
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = errors.email ? "#ef4444" : colors.interactive.primary;
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = errors.email ? "#ef4444" : colors.border.primary;
                        }}
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Subject Field */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-semibold"
                  style={{ color: theme === "light" ? colors.text.primary : colors.text.accent }}
                >
                  Subject *
                </label>
                <Controller
                  name="subject"
                  control={control}
                  rules={{
                    required: "Subject is required",
                    minLength: {
                      value: 5,
                      message: "Subject must be at least 5 characters",
                    },
                    maxLength: {
                      value: 100,
                      message: "Subject must not exceed 100 characters",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      type="text"
                      value={field.value}
                      onChange={field.onChange}
                      disabled={submitContactForm.isPending}
                      placeholder="What is this regarding?"
                      className={`rounded-lg border-2 px-4 py-2 focus:ring disabled:cursor-not-allowed disabled:opacity-70 ${errors.subject ? "border-red-500" : ""}`}
                      style={{
                        backgroundColor: colors.background.primary,
                        borderColor: errors.subject ? "#ef4444" : colors.border.primary,
                        color: colors.text.primary,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = errors.subject ? "#ef4444" : colors.interactive.primary;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.subject ? "#ef4444" : colors.border.primary;
                      }}
                    />
                  )}
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm">{errors.subject.message}</p>
                )}
              </div>

              {/* Message Field */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-semibold"
                  style={{ color: theme === "light" ? colors.text.primary : colors.text.accent }}
                >
                  Your Message (Optional)
                </label>
                <Controller
                  name="message"
                  control={control}
                  rules={{
                    maxLength: {
                      value: 1000,
                      message: "Message must not exceed 1000 characters",
                    },
                  }}
                  render={({ field }) => (
                    <textarea
                      value={field.value}
                      onChange={field.onChange}
                      rows={5}
                      disabled={submitContactForm.isPending}
                      placeholder="Tell us more about your inquiry..."
                      className={`rounded-lg border-2 px-4 py-2 focus:ring disabled:cursor-not-allowed disabled:opacity-70 ${errors.message ? "border-red-500" : ""}`}
                      style={{
                        backgroundColor: colors.background.primary,
                        borderColor: errors.message ? "#ef4444" : colors.border.primary,
                        color: colors.text.primary,
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = errors.message ? "#ef4444" : colors.interactive.primary;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.message ? "#ef4444" : colors.border.primary;
                      }}
                    />
                  )}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitContactForm.isPending}
                className="flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                style={{
                  background: "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)",
                  color: "#fff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {submitContactForm.isPending ? (
                  <>
                    <span
                      className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"
                      style={{
                        borderColor: "#fff",
                        borderTopColor: "transparent",
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

          <div className="lg:col-span-2 p-10">
            {/* Support Availability */}
            <div
              className="rounded-lg p-5 w-full"
              style={{
                backgroundColor: theme === "light" ? "#F0F9FF" : colors.background.secondary,
                border: `2px solid ${theme === "light" ? "#0EA5E9" : colors.border.primary}`,
              }}
            >
              <h3
                className="text-lg font-bold mb-3"
                style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
              >
                Support Availability
              </h3>
              <p className="text-sm mb-2" style={{ color: theme === "light" ? "#1E293B" : colors.text.primary }}>
                Our support team operates 24×7 to assist you with your queries and orders.
              </p>
              <ul className="text-sm space-y-1 ml-4" style={{ color: theme === "light" ? "#475569" : colors.text.secondary }}>
                <li className="list-disc">Standard queries are answered 24×7</li>
                <li className="list-disc">Urgent issues are monitored and responded to even outside these hours</li>
              </ul>
              <p className="text-sm mt-3 font-semibold" style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}>
                Whether day or night, our team ensures that no important query goes unanswered.
              </p>
            </div>

            {/* Common Support Topics */}
            <div
              className="rounded-lg p-5 w-full mt-6"
              style={{
                backgroundColor: theme === "light" ? "#FFF7ED" : colors.background.secondary,
                border: `2px solid ${theme === "light" ? "#FB923C" : colors.border.primary}`,
              }}
            >
              <h3
                className="text-lg font-bold mb-3"
                style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
              >
                Common Support Topics
              </h3>
              <ul className="text-sm space-y-2 ml-4" style={{ color: theme === "light" ? "#475569" : colors.text.secondary }}>
                <li className="list-disc">Assistance with software activation or installation</li>
                <li className="list-disc">Non-receipt of license key within the standard delivery timeframe</li>
                <li className="list-disc">Clarifications regarding product versions (OEM, Retail, Volume, etc.)</li>
                <li className="list-disc">Requests for GST-compliant invoices</li>
                <li className="list-disc">Help with re-activation or lost license keys</li>
                <li className="list-disc">Business inquiries, partnerships, or general feedback</li>
              </ul>
            </div>

            {/* Stay Connected */}
            <div
              className="rounded-lg p-5 w-full mt-6"
              style={{
                backgroundColor: theme === "light" ? "#F0FDF4" : colors.background.secondary,
                border: `2px solid ${theme === "light" ? "#4ADE80" : colors.border.primary}`,
              }}
            >
              <h3
                className="text-lg font-bold mb-3"
                style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
              >
                Stay Connected
              </h3>
              <p className="text-sm mb-3" style={{ color: theme === "light" ? "#1E293B" : colors.text.primary }}>
                Stay updated with the latest offers, new product launches, and software tips:
              </p>
              <ul className="text-sm space-y-1 ml-4" style={{ color: theme === "light" ? "#475569" : colors.text.secondary }}>
                <li className="list-disc">Subscribe to our newsletter</li>
                <li className="list-disc">Save our customer support number for fast assistance</li>
              </ul>
              <p className="text-sm mt-3 font-semibold" style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}>
                We are here to ensure you have a smooth, safe, and reliable digital buying experience.
              </p>
            </div>
          </div>

          {/* Map Section (hidden) */}
          <div
            className="mx-auto my-6 w-11/12 rounded-lg p-5 shadow-md"
            style={{
              display: "none", // Hidden for now — enable later by removing this style
              backgroundColor: theme === "light" ? colors.background.primary : colors.background.secondary,
            }}
            aria-hidden="true"
          >
            <div className="overflow-hidden rounded-lg shadow">
              <iframe
                src={googleMapsEmbedUrl}
                width="100%"
                height="300"
                style={{ border: 0, background: theme === "light" ? colors.background.secondary : colors.background.primary }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Softzcart Location"
                className="rounded-lg"
              />
            </div>
            {/* Map preserved but hidden. To re-enable, remove `display: "none"` above. */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
