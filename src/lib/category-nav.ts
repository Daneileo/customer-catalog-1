import { categoryKey } from "@/lib/brands";
import {
  categoryPath,
  type CategoryListingMode,
  type Store,
} from "@/lib/shops";

export type NavCategory = {
  id: string;
  yupooId: string;
  name: string;
  shopSlug: string;
  isSubCategory: boolean;
  href: string;
  children: NavCategory[];
};

export function categoryNavId(
  mode: CategoryListingMode,
  name: string,
  yupooId: string
) {
  return mode === "brands" ? categoryKey(name) || yupooId : yupooId;
}

export function flattenCategories(categories: NavCategory[]): NavCategory[] {
  const out: NavCategory[] = [];
  for (const category of categories) {
    out.push(category);
    if (category.children.length) {
      out.push(...flattenCategories(category.children));
    }
  }
  return out;
}

export function findCategory(
  categories: NavCategory[],
  id: string
): NavCategory | undefined {
  const decoded = decodeURIComponent(id);
  for (const category of flattenCategories(categories)) {
    if (category.id === id || category.id === decoded || category.yupooId === decoded) {
      return category;
    }
  }
  return undefined;
}

export function mergeBrandCategories(
  groups: NavCategory[][],
  store: Store,
  master: boolean
) {
  const byKey = new Map<string, NavCategory>();
  for (const group of groups) {
    for (const category of flattenCategories(group)) {
      const id = categoryNavId("brands", category.name, category.yupooId);
      if (!id) continue;
      if (!byKey.has(id)) {
        byKey.set(id, {
          ...category,
          id,
          href: categoryPath(master, store.slug, id),
          children: [],
        });
      }
    }
  }
  return [...byKey.values()].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );
}
