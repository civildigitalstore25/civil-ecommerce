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
              We'd love to hear from you. Please fill out the form below or visit
              our headquarters.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-10">
            {/* Left side - Info */}
            <div className="space-y-6">
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
                      className="text-lg font-semibold"
                      style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
                    >
                      Call to Us:
                    </h3>
                    <p style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}>
                      We're available 24/7, 7 days a week.
                    </p>
                    <p
                      className="font-semibold"
                      style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
                    >
                      <a href="tel:+919042993986" className="hover:underline" style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}>
                        +91 9042993986
                      </a>
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
                      className="text-lg font-semibold"
                      style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
                    >
                      Write to Us:
                    </h3>
                    <p style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}>
                      Fill out our form and we will contact you within 24 hours.
                    </p>
                    <p
                      className="font-semibold"
                      style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
                    >
                      softzcart@gmail.com
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
                      className="text-lg font-semibold"
                      style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
                    >
                      Business Hours:
                    </h3>
                    <p style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}>Monday - Friday: 9:00-20:00</p>
                    <p style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}>Saturday: 11:00 - 15:00</p>
                    <p style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}>Sunday: Closed</p>
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
                      className="text-lg font-semibold"
                      style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
                    >
                      Headquarters Address:
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
