import type { SubCategory } from "./brandSubcategoriesTypes";

export function groupSubcategoriesBySectionName(
  subcategories: SubCategory[],
): Record<string, SubCategory[]> {
  return subcategories.reduce(
    (acc, sub) => {
      if (!acc[sub.name]) {
        acc[sub.name] = [];
      }
      acc[sub.name].push(sub);
      return acc;
    },
    {} as Record<string, SubCategory[]>,
  );
}
