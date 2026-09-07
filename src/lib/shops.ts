export type CategoryListingMode = "brands" | "all";

export type Shop = {
  slug: string;
  host: string;
  photoUser: string;
};

export type Store = {
  slug: string;
  name: string;
  shopSlugs: string[];
  categoryListingMode: CategoryListingMode;
  pinnedCategoryId?: string;
};

export const shops: Record<string, Shop> = {
  taurus: {
    slug: "taurus",
    host: "deateath.x.yupoo.com",
    photoUser: "deateath",
  },
  scorpio: {
    slug: "scorpio",
    host: "scorpio-reps.x.yupoo.com",
    photoUser: "scorpio-reps",
  },
  pisces: {
    slug: "pisces",
    host: "pisces-reps.x.yupoo.com",
    photoUser: "pisces-reps",
  },
  husky: {
    slug: "husky",
    host: "huskyreps.x.yupoo.com",
    photoUser: "huskyreps",
  },
  chaosmade: {
    slug: "chaosmade",
    host: "chaosmade.x.yupoo.com",
    photoUser: "chaosmade",
  },
  wwfake100: {
    slug: "wwfake100",
    host: "wwfake100.x.yupoo.com",
    photoUser: "wwfake100",
  },
  yolo66: {
    slug: "yolo66",
    host: "yolo66.x.yupoo.com",
    photoUser: "yolo66",
  },
  luxury233: {
    slug: "luxury233",
    host: "2335499519.x.yupoo.com",
    photoUser: "2335499519",
  },
  jimioptical: {
    slug: "jimioptical",
    host: "jimioptical.x.yupoo.com",
    photoUser: "jimioptical",
  },
  niuniu6688: {
    slug: "niuniu6688",
    host: "niuniu6688.x.yupoo.com",
    photoUser: "niuniu6688",
  },
  west42: {
    slug: "west42",
    host: "west42.x.yupoo.com",
    photoUser: "west42",
  },
  dreamremake2: {
    slug: "dreamremake2",
    host: "dreamremake2.x.yupoo.com",
    photoUser: "dreamremake2",
  },
  jieyi168x: {
    slug: "jieyi168x",
    host: "jieyi168x.x.yupoo.com",
    photoUser: "jieyi168x",
  },
  palmmoose: {
    slug: "palmmoose",
    host: "palmmoose.x.yupoo.com",
    photoUser: "palmmoose",
  },
  terryqiuyi: {
    slug: "terryqiuyi",
    host: "terryqiuyi.x.yupoo.com",
    photoUser: "terryqiuyi",
  },
  emmaluxury: {
    slug: "emmaluxury",
    host: "emma-luxury.x.yupoo.com",
    photoUser: "emma-luxury",
  },
  godmall: {
    slug: "godmall",
    host: "godmall.x.yupoo.com",
    photoUser: "godmall",
  },
  hlinjewelry: {
    slug: "hlinjewelry",
    host: "hlinjewelry.x.yupoo.com",
    photoUser: "hlinjewelry",
  },
  pikachushop: {
    slug: "pikachushop",
    host: "pikachushop.x.yupoo.com",
    photoUser: "pikachushop",
  },
};

export const shopSlugList = Object.keys(shops);

export const stores: Store[] = [
  {
    slug: "manybrands-1",
    name: "manybrands-1",
    shopSlugs: ["taurus", "scorpio", "pisces"],
    categoryListingMode: "brands",
  },
  {
    slug: "manybrands-2",
    name: "manybrands-2",
    shopSlugs: ["husky"],
    categoryListingMode: "brands",
  },
  {
    slug: "manybrands-3",
    name: "manybrands-3",
    shopSlugs: ["chaosmade"],
    categoryListingMode: "all",
  },
  {
    slug: "many-shoes-1",
    name: "many shoes-1",
    shopSlugs: ["wwfake100"],
    categoryListingMode: "all",
  },
  {
    slug: "many-shoes-2",
    name: "many shoes-2",
    shopSlugs: ["yolo66"],
    categoryListingMode: "all",
  },
  {
    slug: "luxurybrand-shoes1",
    name: "luxurybrand-shoes1",
    shopSlugs: ["luxury233"],
    categoryListingMode: "all",
  },
  {
    slug: "glasses-1",
    name: "glasses-1",
    shopSlugs: ["jimioptical"],
    categoryListingMode: "all",
  },
  {
    slug: "stussy",
    name: "stussy",
    shopSlugs: ["niuniu6688"],
    categoryListingMode: "all",
  },
  {
    slug: "arcteryx",
    name: "Arc'teryx",
    shopSlugs: ["west42"],
    categoryListingMode: "all",
  },
  {
    slug: "stone-island",
    name: "Stone Island",
    shopSlugs: ["dreamremake2"],
    categoryListingMode: "all",
  },
  {
    slug: "best-mooseknuckles",
    name: "BEST MOOSEKNUCKLES",
    shopSlugs: ["jieyi168x"],
    categoryListingMode: "all",
  },
  {
    slug: "good-mooseknuckles",
    name: "good mooseknuckles",
    shopSlugs: ["palmmoose"],
    categoryListingMode: "all",
  },
  {
    slug: "best-jerseys",
    name: "best-jerseys",
    shopSlugs: ["terryqiuyi"],
    categoryListingMode: "all",
  },
  {
    slug: "luxury-bags-items1",
    name: "luxury-bags-items1",
    shopSlugs: ["emmaluxury"],
    categoryListingMode: "all",
  },
  {
    slug: "luxury-bags-items2",
    name: "luxury-bags-items2",
    shopSlugs: ["godmall"],
    categoryListingMode: "all",
    pinnedCategoryId: "4788903",
  },
  {
    slug: "realgold-silverjewlery",
    name: "realgold/silverjewlery",
    shopSlugs: ["hlinjewelry"],
    categoryListingMode: "all",
  },
  {
    slug: "bestsp5der-ee-vale",
    name: "bestsp5der-EE-vale.etc",
    shopSlugs: ["pikachushop"],
    categoryListingMode: "all",
  },
];

export const storeBySlug = Object.fromEntries(
  stores.map((store) => [store.slug, store])
) as Record<string, Store>;

export const storeByShopSlug = new Map<string, Store>();
for (const store of stores) {
  for (const shopSlug of store.shopSlugs) {
    storeByShopSlug.set(shopSlug, store);
  }
}

export function getShop(slug: string): Shop {
  const shop = shops[slug];
  if (!shop) {
    throw new Error(`Unknown shop: ${slug}`);
  }
  return shop;
}

export function getStore(slug: string): Store | undefined {
  return storeBySlug[slug];
}

export function requireStore(slug: string): Store {
  const store = getStore(slug);
  if (!store) {
    throw new Error(`Unknown store: ${slug}`);
  }
  return store;
}

export function storeShops(store: Store): Shop[] {
  return store.shopSlugs.map(getShop);
}

export function storeBase(master: boolean, storeSlug: string) {
  return master ? `/master/${storeSlug}` : `/${storeSlug}`;
}

export function itemPath(master: boolean, shopSlug: string, id: string) {
  return master ? `/master/item/${shopSlug}/${id}` : `/item/${shopSlug}/${id}`;
}

export function categoryPath(
  master: boolean,
  storeSlug: string,
  categoryId: string
) {
  return `${storeBase(master, storeSlug)}/c/${encodeURIComponent(categoryId)}`;
}

export function searchPath(
  master: boolean,
  storeSlug?: string
) {
  if (storeSlug) {
    return `${storeBase(master, storeSlug)}/search`;
  }
  return master ? "/master/search" : "/search";
}

export const WHATSAPP_NUMBER = "14162459504";
export const WHATSAPP_DISPLAY = "+1 (416) 245-9504";

export function whatsappLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
