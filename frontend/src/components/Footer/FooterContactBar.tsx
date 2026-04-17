import {
  FaPhoneAlt,
  FaClock,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { SiX } from "react-icons/si";
import {
  FOOTER_BORDER,
  FOOTER_TEXT_PRIMARY,
  FOOTER_TEXT_SECONDARY,
} from "./footerTokens";

const socialLinks = [
  {
    href: "https://www.facebook.com/SoftzCart/",
    icon: FaFacebookF,
    bgColor: "#1877F2",
    hoverBgColor: "#166FE5",
  },
  {
    href: "https://www.instagram.com/softzcart/",
    icon: FaInstagram,
    bgColor: "#E4405F",
    hoverBgColor: "#D42D6C",
  },
  {
    href: "https://www.linkedin.com/in/softzcart/",
    icon: FaLinkedinIn,
    bgColor: "#0A66C2",
    hoverBgColor: "#0959A8",
  },
  {
    href: "https://www.youtube.com/@SoftZcart",
    icon: FaYoutube,
    bgColor: "#FF0000",
    hoverBgColor: "#E60000",
  },
  {
    href: "https://x.com/SoftZcart",
    icon: SiX,
    bgColor: "#000000",
    hoverBgColor: "#14171A",
  },
];

export function FooterContactBar() {
  return (
    <div
      className="w-full px-6 py-6 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-colors duration-200"
      style={{ borderColor: FOOTER_BORDER }}
    >
      <div
        className="flex flex-col md:flex-row md:items-center md:gap-8 text-base font-lato transition-colors duration-200"
        style={{ color: FOOTER_TEXT_SECONDARY }}
      >
        <p
          className="flex items-center gap-2 border-b md:border-b-0 md:border-r pb-2 md:pb-0 md:pr-6 transition-colors duration-200"
          style={{ borderColor: FOOTER_BORDER }}
        >
          <FaPhoneAlt style={{ color: "rgba(255,255,255,0.95)" }} />
          <a
            href="tel:+919042993986"
            className="mr-4 transition-colors duration-200"
            style={{ color: FOOTER_TEXT_PRIMARY }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(255,255,255,0.90)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = FOOTER_TEXT_PRIMARY;
            }}
          >
            +91 9042993986
          </a>
        </p>
        <p
          className="flex items-center gap-2 border-b md:border-b-0 md:border-r pb-2 md:pb-0 md:pr-6 transition-colors duration-200"
          style={{ borderColor: FOOTER_BORDER }}
        >
          <FaEnvelope style={{ color: "rgba(255,255,255,0.95)" }} />{" "}
          <span style={{ color: FOOTER_TEXT_PRIMARY }}>softzcart@gmail.com</span>
        </p>
        <p className="flex items-center gap-2">
          <FaClock style={{ color: "rgba(255,255,255,0.95)" }} /> 24x7
          <span style={{ color: FOOTER_TEXT_PRIMARY }}>Service Available in India</span>
        </p>
      </div>

      <div className="flex space-x-3">
        {socialLinks.map(({ href, icon: Icon, bgColor, hoverBgColor }, i) => (
          <a
            key={i}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200"
            style={{
              backgroundColor: bgColor,
              color: "#FFFFFF",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = hoverBgColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = bgColor;
            }}
          >
            <Icon className="w-4 h-4" />
          </a>
        ))}
      </div>
    </div>
  );
}
