/** Local YYYY-MM-DD and HH:mm parts for datetime-local style fields (not UTC). */
export function localDateAndTimeFromValue(
  value: Date | string | undefined | null,
): { date: string; time: string } {
  if (value == null) return { date: "", time: "" };
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) return { date: "", time: "" };
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return { date: `${y}-${m}-${day}`, time: `${h}:${min}` };
}
