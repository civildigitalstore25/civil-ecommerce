import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { FooterContactBar } from "./FooterContactBar";
import {
  darkLogo,
  FOOTER_BG,
  FOOTER_BORDER,
  FOOTER_TEXT_PRIMARY,
  FOOTER_TEXT_SECONDARY,
  lightLogo,
} from "./footerTokens";
import {
  footerPolicyLinks,
  footerServicesLinks,
  footerSoftwareLinks,
  renderFooterLinkList,
} from "./footerLinkGroups";

const Footer = () => {
  const { theme } = useAdminTheme();
  const logoSrc = theme === "light" ? lightLogo : darkLogo;

  return (
    <footer
      className="font-light transition-colors duration-200 relative"
      style={{
        backgroundColor: FOOTER_BG,
        color: FOOTER_TEXT_PRIMARY,
      }}
    >
      <div
        className="w-full py-12 px-7 border-b transition-colors duration-200"
        style={{ borderColor: FOOTER_BORDER }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logoSrc}
                alt="Softzcart Logo"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p
              className="text-base leading-relaxed font-lato transition-colors duration-200"
              style={{ color: FOOTER_TEXT_SECONDARY }}
            >
              Softzcart is a user-friendly website offering a vast selection of engineering
              resources, from software to educational materials. A valuable platform for
              professionals and students alike.
            </p>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <h3
                className="font-poppins font-semibold mb-4 tracking-wide transition-colors duration-200 text-base md:text-lg"
                style={{ color: FOOTER_TEXT_PRIMARY }}
              >
                OUR SERVICES
              </h3>
              <ul className="space-y-2 text-sm md:text-base font-lato">
                {renderFooterLinkList(
                  footerServicesLinks,
                  FOOTER_TEXT_PRIMARY,
                  FOOTER_TEXT_SECONDARY,
                )}
              </ul>
            </div>

            <div>
              <h3
                className="font-poppins font-semibold mb-4 tracking-wide transition-colors duration-200 text-base md:text-lg"
                style={{ color: FOOTER_TEXT_PRIMARY }}
              >
                CUSTOMER POLICIES
              </h3>
              <ul className="space-y-2 text-sm md:text-base font-lato">
                {renderFooterLinkList(
                  footerPolicyLinks,
                  FOOTER_TEXT_PRIMARY,
                  FOOTER_TEXT_SECONDARY,
                )}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h3
                className="font-poppins font-semibold mb-4 tracking-wide transition-colors duration-200 text-base md:text-lg"
                style={{ color: FOOTER_TEXT_PRIMARY }}
              >
                SOFTWARE
              </h3>
              <ul className="space-y-2 text-sm md:text-base font-lato grid grid-cols-2 md:grid-cols-1 gap-x-4">
                {renderFooterLinkList(
                  footerSoftwareLinks,
                  FOOTER_TEXT_PRIMARY,
                  FOOTER_TEXT_SECONDARY,
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <FooterContactBar />

      <div
        className="text-center text-sm py-4 border-t font-lato transition-colors duration-200"
        style={{
          color: FOOTER_TEXT_SECONDARY,
          borderColor: FOOTER_BORDER,
        }}
      >
        ©{" "}
        <span
          className="font-poppins font-semibold transition-colors duration-200"
          style={{ color: FOOTER_TEXT_PRIMARY }}
        >
          softzcart
        </span>
        . All rights reserved 2026.
      </div>
    </footer>
  );
};

export default Footer;
