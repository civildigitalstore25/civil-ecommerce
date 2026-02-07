import { EMAIL_BRAND } from "../constants/email";

type BuildEmailArgs = {
  title: string;
  contentHtml: string;
  preheader?: string;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const buildEmailHtml = ({ title, contentHtml, preheader }: BuildEmailArgs) => {
  const year = new Date().getFullYear();
  const brandName = EMAIL_BRAND.brandName;
  const supportEmail = EMAIL_BRAND.supportEmail;
  const websiteUrl = EMAIL_BRAND.websiteUrl;
  const accent = EMAIL_BRAND.accentColor;

  const safeTitle = escapeHtml(title);
  const safePreheader = preheader ? escapeHtml(preheader) : "";

  const websiteLink = websiteUrl
    ? `<a href="${websiteUrl}" style="color:${accent}; text-decoration:none;">${escapeHtml(
        websiteUrl.replace(/^https?:\/\//, ""),
      )}</a>`
    : "";

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${safeTitle}</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #111827; margin: 0; padding: 0; background: #f3f4f6; }
      .container { max-width: 640px; margin: 0 auto; padding: 24px 16px; }
      .card { background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e5e7eb; }
      .header { background: ${accent}; color: #ffffff; padding: 22px 24px; }
      .header h1 { margin: 0; font-size: 20px; }
      .content { padding: 24px; }
      .btn { display: inline-block; padding: 12px 18px; background: ${accent}; color: #ffffff !important; text-decoration: none; border-radius: 10px; font-weight: 700; }
      .muted { color: #6b7280; font-size: 14px; }
      .divider { height: 1px; background: #e5e7eb; margin: 18px 0; }
      .footer { padding: 18px 24px; background: #f9fafb; border-top: 1px solid #e5e7eb; }
      .small { font-size: 12px; color: #6b7280; margin: 6px 0 0; }
      a { color: ${accent}; }
    </style>
  </head>
  <body>
    ${safePreheader ? `<div style="display:none; max-height:0; overflow:hidden; opacity:0;">${safePreheader}</div>` : ""}
    <div class="container">
      <div class="card">
        <div class="header">
          <h1>${safeTitle}</h1>
        </div>
        <div class="content">
          ${contentHtml}
        </div>
        <div class="footer">
          <div class="muted">
            <strong>${escapeHtml(brandName)}</strong><br />
            Need help? <a href="mailto:${supportEmail}">${escapeHtml(supportEmail)}</a>${websiteLink ? ` • ${websiteLink}` : ""}
          </div>
          <p class="small">© ${year} ${escapeHtml(brandName)}. All rights reserved.</p>
          <p class="small">Please do not reply to this automated message.</p>
        </div>
      </div>
    </div>
  </body>
</html>
`;
};

type CommonFooterArgs = {
  topNoteHtml?: string;
};

export const buildCommonEmailFooter = ({ topNoteHtml }: CommonFooterArgs = {}) => {
  const brandName = EMAIL_BRAND.brandName;
  const fromEmail = EMAIL_BRAND.fromEmail;
  const supportEmail = EMAIL_BRAND.supportEmail;

  const privacyUrl = EMAIL_BRAND.footer.privacyPolicyUrl;
  const helpUrl = EMAIL_BRAND.footer.helpCenterUrl;

  type SocialKey =
    | "facebook"
    | "instagram"
    | "linkedin"
    | "youtube"
    | "x"
    | "whatsapp"
    | "pinterest"
    | "email";

  const renderIconSvg = (key: SocialKey) => {
    const common = `width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"`;
    const stroke = `stroke="#0B2A67" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
    const fill = `fill="#0B2A67"`;

    switch (key) {
      case "facebook":
        return `<svg ${common} aria-hidden="true"><path ${fill} d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.1l.9-3H13V9c0-.6.4-1 1-1Z"/></svg>`;
      case "instagram":
        return `<svg ${common} aria-hidden="true"><path ${stroke} d="M7 7h10v10H7z"/><path ${stroke} d="M16.5 7.5h.01"/><path ${stroke} d="M12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"/></svg>`;
      case "linkedin":
        return `<svg ${common} aria-hidden="true"><path ${fill} d="M6.5 9H4v12h2.5V9Zm-1.25-1.1a1.45 1.45 0 1 0 0-2.9 1.45 1.45 0 0 0 0 2.9ZM20 21h-2.5v-6.3c0-1.5-.6-2.5-2-2.5-1.1 0-1.7.7-2 1.4-.1.3-.1.7-.1 1v6.4H11V9h2.4v1.6c.3-.7 1.3-1.8 3.2-1.8 2.3 0 3.9 1.5 3.9 4.7V21Z"/></svg>`;
      case "youtube":
        return `<svg ${common} aria-hidden="true"><path ${fill} d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.8 4.6 12 4.6 12 4.6s-5.8 0-7.5.5A3 3 0 0 0 2.4 7.2 31.4 31.4 0 0 0 2 12a31.4 31.4 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.7.5 7.5.5 7.5.5s5.8 0 7.5-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 22 12a31.4 31.4 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z"/></svg>`;
      case "x":
        return `<svg ${common} aria-hidden="true"><path ${fill} d="M18.9 4H21l-6.7 7.7L22 20h-6.1l-4.8-5.7L6.1 20H4l7.2-8.3L2 4h6.2l4.4 5.2L18.9 4Zm-1.1 14h1.2L6.2 6H5l12.8 12Z"/></svg>`;
      case "whatsapp":
        return `<svg ${common} aria-hidden="true"><path ${fill} d="M20 12a8 8 0 0 1-11.7 7.1L4 20l.9-4.2A8 8 0 1 1 20 12Zm-4.5 2.2c-.2.5-1.2 1-1.6 1-.4.1-.8.1-1.3 0-.3-.1-.7-.2-1.2-.4-2-.8-3.3-2.8-3.4-2.9-.1-.2-.8-1-.8-2s.5-1.5.7-1.7c.2-.2.4-.2.5-.2h.4c.1 0 .3 0 .4.3.2.5.6 1.6.7 1.7.1.1.1.2 0 .4-.1.2-.2.3-.3.4-.1.1-.2.2-.3.4-.1.1-.2.2-.1.4.1.2.6 1.1 1.3 1.7.9.8 1.6 1 1.8 1.1.2.1.3.1.4-.1.1-.1.5-.6.6-.8.1-.2.3-.2.4-.1.2.1 1.3.6 1.5.7.2.1.3.2.3.3 0 .1 0 .5-.2 1Z"/></svg>`;
      case "pinterest":
        return `<svg ${common} aria-hidden="true"><path ${fill} d="M12 2a10 10 0 0 0-3.5 19.4c-.1-.8-.1-2 .1-2.9l1.3-5.6s-.3-.7-.3-1.7c0-1.6.9-2.8 2.1-2.8 1 0 1.5.7 1.5 1.6 0 1-.6 2.5-.9 3.8-.3 1.1.5 2 1.6 2 1.9 0 3.4-2 3.4-4.8 0-2.5-1.8-4.3-4.4-4.3-3 0-4.8 2.2-4.8 4.5 0 .9.3 1.9.8 2.4.1.1.1.2.1.4l-.3 1.3c-.1.4-.3.5-.6.3-1.1-.5-1.8-2.1-1.8-3.4 0-2.8 2-5.4 5.9-5.4 3.1 0 5.5 2.2 5.5 5.1 0 3.1-2 5.7-4.7 5.7-1 0-1.9-.5-2.2-1.1l-.6 2.3c-.2.9-.7 2-1.1 2.7A10 10 0 1 0 12 2Z"/></svg>`;
      case "email":
        return `<svg ${common} aria-hidden="true"><path ${stroke} d="M4 6h16v12H4z"/><path ${stroke} d="m4 7 8 6 8-6"/></svg>`;
      default:
        return "";
    }
  };

  const socials = (
    [
      { key: "facebook", label: "Facebook", url: EMAIL_BRAND.social.facebook },
      { key: "instagram", label: "Instagram", url: EMAIL_BRAND.social.instagram },
      { key: "linkedin", label: "LinkedIn", url: EMAIL_BRAND.social.linkedin },
      { key: "youtube", label: "YouTube", url: EMAIL_BRAND.social.youtube },
      { key: "x", label: "X", url: EMAIL_BRAND.social.x },
      { key: "whatsapp", label: "WhatsApp", url: EMAIL_BRAND.social.whatsapp },
      { key: "pinterest", label: "Pinterest", url: EMAIL_BRAND.social.pinterest },
      // Always include email icon so users can contact you directly
      { key: "email", label: "Email", url: `mailto:${supportEmail}` },
    ] as const
  )
    .filter((s) => !!s.url)
    .map((s) => ({
      key: s.key as SocialKey,
      label: s.label,
      url: s.url,
    }));

  const socialButtons = socials
    .map((s) => {
      const isMailto = s.key === "email";
      const extraRel = isMailto ? "" : 'rel="noopener noreferrer"';
      const extraTarget = isMailto ? "" : 'target="_blank"';
      return `
        <a href="${s.url}" ${extraTarget} ${extraRel} aria-label="${escapeHtml(
        s.label,
      )}" style="display:inline-block; width:36px; height:36px; text-align:center; border-radius:9999px; background:#ffffff; text-decoration:none; margin:0 7px;">
          <span style="display:inline-block; width:36px; height:36px; line-height:36px; vertical-align:middle;">
            ${renderIconSvg(s.key)}
          </span>
        </a>
      `;
    })
    .join("");

  const linksRow = [
    privacyUrl
      ? `<a href="${privacyUrl}" style="color:#ffffff; text-decoration:none;">Privacy Policy</a>`
      : "",
    helpUrl
      ? `<a href="${helpUrl}" style="color:#ffffff; text-decoration:none;">Help Center</a>`
      : "",
  ]
    .filter(Boolean)
    .join(
      `<span style="color: rgba(255,255,255,0.7); padding: 0 10px;">|</span>`,
    );

  return `
    ${topNoteHtml ? `<div style="text-align:center; color:#6b7280; font-size:13px; margin: 10px 0 18px 0;">${topNoteHtml}</div>` : ""}
    <div style="background:#0B2A67; padding: 26px 18px; text-align:center;">
      <div style="color:#ffffff; font-size:22px; font-weight:800; letter-spacing:0.2px; margin-bottom: 14px;">
        Get in Touch
      </div>
      <div style="margin-bottom: 16px;">
        ${socialButtons}
      </div>
      <div style="color: rgba(255,255,255,0.85); font-size: 13px; line-height: 1.7;">
        This email was sent by : <a href="mailto:${fromEmail}" style="color:#ffffff; text-decoration:none;">${escapeHtml(
          fromEmail,
        )}</a><br/>
        For any questions please send an email to <a href="mailto:${supportEmail}" style="color:#ffffff; text-decoration:none;">${escapeHtml(
          supportEmail,
        )}</a>
      </div>
      ${linksRow ? `<div style="margin-top: 16px; font-size: 13px;">${linksRow}</div>` : ""}
      <div style="margin-top: 14px; color: rgba(255,255,255,0.75); font-size: 12px;">
        ${escapeHtml(brandName)}
      </div>
    </div>
  `;
};
