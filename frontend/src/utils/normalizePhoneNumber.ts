/**
 * Removes a duplicated India country code (91) after an explicit +91 prefix.
 *
 * This happens when the stored value already included "91" as the start of the
 * national number (e.g. `919842181023` without "+") and `PhoneInput` prepended
 * `+91` again, producing `+91919842181023` instead of `+919842181023`.
 */
export function normalizeDuplicateIndiaCountryInPhone(
  phone: string | null | undefined
): string {
  if (phone == null || typeof phone !== "string") return "";
  const t = phone.trim();
  if (!t.startsWith("+91")) return t;
  const digitsAfterCc = t.slice(3).replace(/\D/g, "");
  if (digitsAfterCc.startsWith("91") && digitsAfterCc.length >= 10) {
    return `+91${digitsAfterCc.slice(2)}`;
  }
  return t;
}
