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

    const emailAssetBaseUrl = (
        process.env.EMAIL_ASSET_BASE_URL ||
        process.env.BACKEND_URL ||
        process.env.FRONTEND_URL ||
        "http://localhost:5000"
    ).replace(/\/$/, "");

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

    const renderIconImg = (key: SocialKey, label: string) => {
        const iconMap: Record<SocialKey, string> = {
            facebook: "facebook-color-svgrepo-com.png",
            instagram: "instagram-1-svgrepo-com.png",
            linkedin: "linkedin-svgrepo-com.png",
            youtube: "youtube-color-svgrepo-com.png",
            x: "twitter-color-svgrepo-com.png",
            whatsapp: "",
            pinterest: "",
            email: "gmail-svgrepo-com.png",
        };

        const fileName = iconMap[key];
        if (!fileName) return "";

        const src = `${emailAssetBaseUrl}/email-images/${fileName}`;
        return `<img src="${src}" width="18" height="18" alt="${escapeHtml(
            label,
        )}" style="display:block; width:18px; height:18px; margin:9px auto;" />`;
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
            ${renderIconImg(s.key, s.label)}
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
