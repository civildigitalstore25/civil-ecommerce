import React from "react";
import { MapPinned, PhoneCall, Mail } from "lucide-react";

type Props = {
  theme: string;
  colors: any;
};

export const ContactInfoCards: React.FC<Props> = ({ theme, colors }) => {
  return (
    <div className="space-y-8 flex flex-col h-full">
      <div>
        <h2
          className="text-2xl font-bold mb-4"
          style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
        >
          How to Reach Us
        </h2>
      </div>

      <div className="space-y-6 flex-1">
        {/* Phone & WhatsApp */}
        <div
          className="flex gap-4 rounded-lg border-l-4 p-5 overflow-hidden"
          style={{
            backgroundColor: theme === "light" ? "#fff" : colors.background.secondary,
            border: theme === "light" ? `1px solid #384354` : `2px solid #384354`,
            color: theme === "light" ? "#0A2A6B" : colors.text.primary,
          }}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm"
            style={{
              background: "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)",
              color: "#fff",
            }}
          >
            <PhoneCall size={15} strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
            >
              Phone & WhatsApp Support
            </h3>
            <p
              className="font-semibold mb-1 break-words"
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

        {/* Email */}
        <div
          className="flex gap-4 rounded-lg border-l-4 p-5 overflow-hidden"
          style={{
            backgroundColor: theme === "light" ? "#fff" : colors.background.secondary,
            border: theme === "light" ? `1px solid #384354` : `2px solid #384354`,
            color: theme === "light" ? "#0A2A6B" : colors.text.primary,
          }}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm"
            style={{
              background: "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)",
              color: "#fff",
            }}
          >
            <Mail size={15} strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
            >
              Email Support
            </h3>
            <p
              className="font-semibold mb-1 break-all"
              style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
            >
              <a
                href="mailto:softzcart@gmail.com"
                className="hover:underline"
                style={{ color: theme === "light" ? "#0A2A6B" : "#fff" }}
              >
                softzcart@gmail.com
              </a>
            </p>
            <p className="text-sm" style={{ color: theme === "light" ? "#475569" : colors.text.secondary }}>
              We typically respond within 1 to 6 hours depending on the query volume.
            </p>
          </div>
        </div>

        {/* Address */}
        <div
          className="flex gap-4 rounded-lg border-l-4 p-5 overflow-hidden"
          style={{
            backgroundColor: theme === "light" ? "#fff" : colors.background.secondary,
            border: theme === "light" ? `1px solid #384354` : `2px solid #384354`,
            color: theme === "light" ? "#0A2A6B" : colors.text.primary,
          }}
        >
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm"
            style={{
              background: "linear-gradient(90deg, #0A2A6B 0%, #00C8FF 100%)",
              color: "#fff",
            }}
          >
            <MapPinned size={15} strokeWidth={2.25} />
          </div>
          <div className="min-w-0">
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
  );
};
