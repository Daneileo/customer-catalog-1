export function normalizeQuery(q: string) {
  return q.trim().replace(/\s+/g, " ");
}

export function queryTokens(q: string) {
  return normalizeQuery(q)
    .toLowerCase()
    .split(" ")
    .filter(Boolean);
}

export function matchesQuery(text: string, q: string) {
  const tokens = queryTokens(q);
  if (!tokens.length) return true;
  const haystack = text.toLowerCase();
  return tokens.every((token) => haystack.includes(token));
}

export function interleaveByShop<T extends { shopSlug: string }>(items: T[]) {
  const byShop = new Map<string, T[]>();
  const order: string[] = [];
  for (const item of items) {
    if (!byShop.has(item.shopSlug)) {
      byShop.set(item.shopSlug, []);
      order.push(item.shopSlug);
    }
    byShop.get(item.shopSlug)!.push(item);
  }
  const out: T[] = [];
  let added = true;
  while (added) {
    added = false;
    for (const slug of order) {
      const next = byShop.get(slug)?.shift();
      if (next) {
        out.push(next);
        added = true;
      }
    }
  }
  return out;
}
