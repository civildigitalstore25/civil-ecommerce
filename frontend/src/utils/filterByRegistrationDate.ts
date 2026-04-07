export type WithCreatedAt = { createdAt: string };

export function filterByRegistrationDate<T extends WithCreatedAt>(
  items: T[],
  dateFilter: string,
  customStartDate: string,
  customEndDate: string,
): T[] {
  if (dateFilter === "all") return items;

  const now = new Date();
  let startDate: Date | null = null;

  if (dateFilter === "last-year") {
    startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  } else if (dateFilter === "last-month") {
    startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  } else if (dateFilter === "last-week") {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (dateFilter === "custom" && customStartDate) {
    startDate = new Date(customStartDate);
  }

  const endDate =
    dateFilter === "custom" && customEndDate ? new Date(customEndDate) : now;

  return items.filter((item) => {
    const itemDate = new Date(item.createdAt);
    if (!startDate) return true;
    return itemDate >= startDate && itemDate <= endDate;
  });
}
