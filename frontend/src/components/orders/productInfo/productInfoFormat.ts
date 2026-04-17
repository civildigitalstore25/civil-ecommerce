export function formatProductInfoFileSize(bytes: number | null): string {
  if (bytes === null || Number.isNaN(bytes) || bytes < 0) return "Unknown";
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const power = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1024, power);
  return `${value.toFixed(power === 0 ? 0 : 2)} ${units[power]}`;
}

export function formatProductInfoOrderDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
