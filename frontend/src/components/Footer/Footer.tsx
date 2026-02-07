import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaPhoneAlt,
  FaClock,
  FaEnvelope,
} from "react-icons/fa";
import { SiX } from "react-icons/si";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

const Footer = () => {
  const { colors, theme } = useAdminTheme();
  const footerBg = "#142952";
  const footerTextPrimary = colors.text.inverse;
  const footerTextSecondary = "rgba(255,255,255,0.82)";
  const footerBorder = "rgba(255,255,255,0.22)";

  return (
    <footer
      className="font-light transition-colors duration-200 relative"
      style={{
        backgroundColor: footerBg,
        color: footerTextPrimary,
      }}
    >
      {/* Main Footer Content */}
      <div
        className="w-full py-12 px-7 border-b transition-colors duration-200"
        style={{ borderColor: footerBorder }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Company Description - Takes 5 columns */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={theme === "dark" ? "/whitelogo.png" : "/softlogo.png"}
                alt="Softzcart Logo"
                className="h-10 w-auto object-contain"
              />

            </div>
            <p
              className="text-base leading-relaxed font-lato transition-colors duration-200"
              style={{ color: footerTextSecondary }}
            >
              Softzcart is a user-friendly website offering a vast
              selection of engineering resources, from software to
              educational materials. A valuable platform for professionals and
              students alike.
            </p>
          </div>

          {/* Our Services & Policies - Takes 7 columns, split into grid */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {/* Our Services */}
            <div>
              <h3
                className="font-poppins font-semibold mb-4 tracking-wide transition-colors duration-200 text-base md:text-lg"
                style={{ color: footerTextPrimary }}
              >
                OUR SERVICES
              </h3>
              <ul className="space-y-2 text-sm md:text-base font-lato">

                <li>
                  <Link
                    to="/shipping-policy"
                    className="transition-colors duration-200 hover:underline"
                    style={{ color: footerTextSecondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = footerTextPrimary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = footerTextSecondary;
                    }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Shipping & Delivery Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy-policy"
                    className="transition-colors duration-200 hover:underline"
                    style={{ color: footerTextSecondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = footerTextPrimary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = footerTextSecondary;
                    }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h3
                className="font-poppins font-semibold mb-4 tracking-wide transition-colors duration-200 text-base md:text-lg"
                style={{ color: footerTextPrimary }}
              >
                CUSTOMER POLICIES
              </h3>
              <ul className="space-y-2 text-sm md:text-base font-lato">
                <li>
                  <Link
                    to="/terms-and-conditions"
                    className="transition-colors duration-200 hover:underline"
                    style={{ color: footerTextSecondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = footerTextPrimary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = footerTextSecondary;
                    }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/return-policy"
                    className="transition-colors duration-200 hover:underline"
                    style={{ color: footerTextSecondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = footerTextPrimary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = footerTextSecondary;
                    }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Return and Refund Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/disclaimer"
                    className="transition-colors duration-200 hover:underline"
                    style={{ color: footerTextSecondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = footerTextPrimary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = footerTextSecondary;
                    }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>

            {/* Software */}
            <div className="col-span-2 md:col-span-1">
              <h3
                className="font-poppins font-semibold mb-4 tracking-wide transition-colors duration-200 text-base md:text-lg"
                style={{ color: footerTextPrimary }}
              >
                SOFTWARE
              </h3>
              <ul className="space-y-2 text-sm md:text-base font-lato grid grid-cols-2 md:grid-cols-1 gap-x-4">
                <li>
                  <Link
                    to="/category?brand=autodesk&category=autocad"
                    className="transition-colors duration-200 hover:underline"
                    style={{ color: footerTextSecondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = footerTextPrimary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = footerTextSecondary;
                    }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    AutoCAD
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category?brand=architectural-softwares&category=lumion"
                    className="transition-colors duration-200 hover:underline"
                    style={{ color: footerTextSecondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = footerTextPrimary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = footerTextSecondary;
                    }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Lumion
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category?brand=microsoft&category=microsoft-365"
                    className="transition-colors duration-200 hover:underline"
                    style={{ color: footerTextSecondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = footerTextPrimary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = footerTextSecondary;
                    }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    MS Office
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category?brand=structural-softwares&category=tekla"
                    className="transition-colors duration-200 hover:underline"
                    style={{ color: footerTextSecondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = footerTextPrimary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = footerTextSecondary;
                    }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Tekla
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category?brand=autodesk&category=revit"
                    className="transition-colors duration-200 hover:underline"
                    style={{ color: footerTextSecondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = footerTextPrimary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = footerTextSecondary;
                    }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Revit
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Contact + Social Icons */}
      <div
        className="w-full px-6 py-6 border-t flex flex-col md:flex-row justify-between items-center gap-6 transition-colors duration-200"
        style={{ borderColor: footerBorder }}
      >
        {/* Contact Info */}
        <div
          className="flex flex-col md:flex-row md:items-center md:gap-8 text-base font-lato transition-colors duration-200"
          style={{ color: footerTextSecondary }}
        >
          <p
            className="flex items-center gap-2 border-b md:border-b-0 md:border-r pb-2 md:pb-0 md:pr-6 transition-colors duration-200"
            style={{ borderColor: footerBorder }}
          >
            <FaPhoneAlt style={{ color: "rgba(255,255,255,0.95)" }} />
            <a
              href="tel:+919042993986"
              className="mr-4 transition-colors duration-200"
              style={{ color: footerTextPrimary }}
              onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.90)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = footerTextPrimary; }}
            >
              +91 9042993986
            </a>
          </p>
          <p
            className="flex items-center gap-2 border-b md:border-b-0 md:border-r pb-2 md:pb-0 md:pr-6 transition-colors duration-200"
            style={{ borderColor: footerBorder }}
          >
            <FaEnvelope style={{ color: "rgba(255,255,255,0.95)" }} />{" "}
            <span style={{ color: footerTextPrimary }}>softzcart@gmail.com</span>
          </p>
          <p className="flex items-center gap-2">
            <FaClock style={{ color: "rgba(255,255,255,0.95)" }} /> 24x7
            <span style={{ color: footerTextPrimary }}>Service Available in India</span>
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-3">
          {[
            {
              href: "https://www.facebook.com/SoftzCart/",
              icon: FaFacebookF,
              bgColor: "#1877F2", // Facebook blue
              hoverBgColor: "#166FE5", // Slightly darker blue on hover
            },
            {
              href: "https://www.instagram.com/softzcart/",
              icon: FaInstagram,
              bgColor: "#E4405F", // Instagram pink
              hoverBgColor: "#D42D6C", // Slightly darker pink on hover
            },
            {
              href: "https://www.linkedin.com/in/softzcart/",
              icon: FaLinkedinIn,
              bgColor: "#0A66C2", // LinkedIn blue
              hoverBgColor: "#0959A8", // Slightly darker blue on hover
            },
            {
              href: "https://www.youtube.com/@SoftZcart",
              icon: FaYoutube,
              bgColor: "#FF0000", // YouTube red
              hoverBgColor: "#E60000", // Slightly darker red on hover
            },
            {
              href: "https://x.com/SoftZcart",
              icon: SiX,
              bgColor: "#000000", // X (Twitter) black
              hoverBgColor: "#14171A", // Slightly lighter black on hover
            },
          ].map(({ href, icon: Icon, bgColor, hoverBgColor }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200"
              style={{
                backgroundColor: bgColor,
                color: "#FFFFFF", // White icon
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


      {/* Copyright */}
      <div
        className="text-center text-sm py-4 border-t font-lato transition-colors duration-200"
        style={{
          color: footerTextSecondary,
          borderColor: footerBorder,
        }}
      >
        ©{" "}
        <span
          className="font-poppins font-semibold transition-colors duration-200"
          style={{ color: footerTextPrimary }}
        >
          softzcart
        </span>
        . All rights reserved 2026.
      </div>

    </footer>
  );
};

export default Footer;