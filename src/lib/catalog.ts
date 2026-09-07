import "server-only";

import * as cheerio from "cheerio";

import { categoryKey } from "@/lib/brands";
import {
  categoryNavId,
  flattenCategories,
  mergeBrandCategories,
  type NavCategory,
} from "@/lib/category-nav";
import { interleaveByShop, matchesQuery } from "@/lib/search-match";
import { isHiddenAlbum, isHiddenCategory } from "@/lib/shop-sources";
import {
  getShop,
  stores,
  storeShops,
  type Shop,
  type Store,
} from "@/lib/shops";
import { displayTitle } from "@/lib/titles";

export const SEARCH_PAGE_SIZE = 60;
export const POPULATED_CATEGORY_CACHE_MAX = 250;
const GLOBAL_SEARCH_PAGES_PER_SHOP = 2;
const FETCH_REVALIDATE = 300;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export type Album = {
  id: string;
  shopSlug: string;
  title: string;
  rawTitle: string;
  thumb?: string;
  photoCount: number;
  href: string;
};

export type Photo = {
  src: string;
  alt: string;
};

export type ListingResult = {
  albums: Album[];
  page: number;
  pageCount: number;
};

export type StoreIndex = {
  categories: NavCategory[];
  listing: ListingResult;
};

function absUrl(shop: Shop, href: string) {
  try {
    return new URL(href, `https://${shop.host}`).toString();
  } catch {
    return `https://${shop.host}${href.startsWith("/") ? href : `/${href}`}`;
  }
}

export function listingUrl(
  shop: Shop,
  options: {
    categoryId?: string;
    isSubCategory?: boolean;
    page?: number;
    q?: string;
  } = {}
) {
  const page = options.page && options.page > 1 ? options.page : undefined;
  if (options.q) {
    const params = new URLSearchParams({ q: options.q });
    if (page) params.set("page", String(page));
    return `https://${shop.host}/search/album?${params.toString()}`;
  }
  if (options.categoryId) {
    const params = new URLSearchParams();
    if (options.isSubCategory) params.set("isSubCate", "true");
    if (page) params.set("page", String(page));
    const query = params.toString();
    return `https://${shop.host}/categories/${options.categoryId}${query ? `?${query}` : ""}`;
  }
  return `https://${shop.host}/albums${page ? `?page=${page}` : ""}`;
}

async function fetchHtml(url: string) {
  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      accept: "text/html,application/xhtml+xml",
      "accept-language": "en-US,en;q=0.9",
    },
    next: { revalidate: FETCH_REVALIDATE },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
}

async function fetchHtmlSafe(url: string) {
  try {
    return await fetchHtml(url);
  } catch {
    return null;
  }
}

function decodeSrc(value: string | undefined) {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith("data:")) return undefined;
  return trimmed;
}

function proxyImageUrl(shopSlug: string, src: string | undefined) {
  const decoded = decodeSrc(src);
  if (!decoded) return undefined;
  const shop = getShop(shopSlug);
  const prefixes = [
    `https://photo.yupoo.com/${shop.photoUser}/`,
    `http://photo.yupoo.com/${shop.photoUser}/`,
    `//photo.yupoo.com/${shop.photoUser}/`,
  ];
  for (const prefix of prefixes) {
    if (decoded.startsWith(prefix)) {
      return `/api/img/${shopSlug}/${decoded.slice(prefix.length)}`;
    }
  }
  const match = decoded.match(
    /(?:https?:)?\/\/photo\.yupoo\.com\/([^/]+)\/(.+)/
  );
  if (match && match[1] === shop.photoUser) {
    return `/api/img/${shopSlug}/${match[2]}`;
  }
  return undefined;
}

function parseAlbumId(href: string) {
  const match = href.match(/\/albums\/(\d+)/);
  return match?.[1];
}

function parseCategoryId(href: string) {
  const match = href.match(/\/categories\/(\d+)/);
  return match?.[1];
}

function isSubCategoryHref(href: string) {
  return /(?:\?|&)isSubCate=true(?:&|$)/i.test(href) || href.includes("isSubCate=true");
}

function parsePageCount($: cheerio.CheerioAPI) {
  let max = 1;
  $(".pagination__number, .pagination__button").each((_, el) => {
    const href = $(el).attr("href") || "";
    const text = $(el).text().trim();
    const fromHref = href.match(/[?&]page=(\d+)/);
    const n = Number(fromHref?.[1] || text);
    if (Number.isFinite(n) && n > max) max = n;
  });
  return max;
}

function albumThumb(node: ReturnType<cheerio.CheerioAPI>, shopSlug: string) {
  const img = node.find("img").first();
  return (
    proxyImageUrl(shopSlug, img.attr("data-origin-src")) ||
    proxyImageUrl(shopSlug, img.attr("data-src")) ||
    proxyImageUrl(shopSlug, img.attr("src"))
  );
}

function parseAlbums(
  $: cheerio.CheerioAPI,
  shopSlug: string,
  master: boolean
): Album[] {
  const seen = new Set<string>();
  const albums: Album[] = [];
  $("a.album__main, a.album3__main").each((_, el) => {
    const node = $(el);
    const href = node.attr("href") || "";
    const id = parseAlbumId(href);
    if (!id || seen.has(id)) return;
    const rawTitle = (
      node.attr("title") ||
      node.find(".album__title, .album3__title").first().text() ||
      ""
    )
      .replace(/\s+/g, " ")
      .trim();
    if (!rawTitle) return;
    if (isHiddenAlbum(shopSlug, rawTitle, master)) return;
    const photoCountText = node
      .find(".album__photonumber, .album3__photonumber")
      .first()
      .text()
      .replace(/[^\d]/g, "");
    const photoCount = photoCountText ? Number(photoCountText) : 1;
    if (!Number.isFinite(photoCount) || photoCount < 1) return;
    const thumb = albumThumb(node, shopSlug);
    if (!thumb) return;
    seen.add(id);
    albums.push({
      id,
      shopSlug,
      title: displayTitle(rawTitle, master),
      rawTitle,
      thumb,
      photoCount,
      href: `/albums/${id}`,
    });
  });
  return albums;
}

function parseCategoryTree(
  $: cheerio.CheerioAPI,
  shop: Shop,
  store: Store,
  master: boolean
): NavCategory[] {
  const mode = store.categoryListingMode;
  const makeCategory = (
    name: string,
    href: string,
    children: NavCategory[] = []
  ): NavCategory | null => {
    const yupooId = parseCategoryId(href);
    if (!yupooId || yupooId === "0") return null;
    const cleanName = name.replace(/\s+/g, " ").trim();
    if (!cleanName) return null;
    if (isHiddenCategory(shop.slug, cleanName, master)) return null;
    const id = categoryNavId(mode, cleanName, yupooId);
    if (!id) return null;
    return {
      id,
      yupooId,
      name: cleanName,
      shopSlug: shop.slug,
      isSubCategory: isSubCategoryHref(href),
      href: `/${store.slug}/c/${encodeURIComponent(id)}`,
      children,
    };
  };

  const fromNew = $(".showheader__category_new .showheader__category_item")
    .toArray()
    .flatMap((item) => {
      const link = $(item).find("a.showheader__link").first();
      const href = link.attr("href") || "";
      const name = link.text();
      const children = $(item)
        .find("a.showheader__child_link, .showheader__category_child_item a")
        .toArray()
        .flatMap((child) => {
          const childHref = $(child).attr("href") || "";
          const childName = $(child).text();
          const parsed = makeCategory(childName, childHref);
          return parsed ? [parsed] : [];
        });
      const parsed = makeCategory(name, href, children);
      return parsed ? [parsed] : [];
    });

  if (fromNew.length) return fromNew;

  const fromList = $(".showheader__categoryList a[href*='/categories/']")
    .toArray()
    .flatMap((el) => {
      const href = $(el).attr("href") || "";
      const name = $(el).text();
      const parsed = makeCategory(name, href);
      return parsed ? [parsed] : [];
    });
  if (fromList.length) return fromList;

  const loose = $("a.showheader__link, a.showheader__menuslink")
    .toArray()
    .flatMap((el) => {
      const href = $(el).attr("href") || "";
      if (!href.includes("/categories/")) return [];
      const parsed = makeCategory($(el).text(), href);
      return parsed ? [parsed] : [];
    });
  return loose;
}

function withMasterHrefs(
  categories: NavCategory[],
  store: Store,
  master: boolean
): NavCategory[] {
  return categories.map((category) => ({
    ...category,
    href: master
      ? `/master/${store.slug}/c/${encodeURIComponent(category.id)}`
      : `/${store.slug}/c/${encodeURIComponent(category.id)}`,
    children: withMasterHrefs(category.children, store, master),
  }));
}

async function loadListing(
  shop: Shop,
  master: boolean,
  options: {
    categoryId?: string;
    isSubCategory?: boolean;
    page?: number;
    q?: string;
  } = {}
): Promise<ListingResult> {
  const url = listingUrl(shop, options);
  const html = await fetchHtmlSafe(url);
  if (!html) {
    return { albums: [], page: options.page ?? 1, pageCount: 1 };
  }
  const $ = cheerio.load(html);
  return {
    albums: parseAlbums($, shop.slug, master),
    page: options.page ?? 1,
    pageCount: parsePageCount($),
  };
}

async function loadCategories(
  shop: Shop,
  store: Store,
  master: boolean
): Promise<NavCategory[]> {
  const html = await fetchHtmlSafe(`https://${shop.host}/albums`);
  if (!html) return [];
  const $ = cheerio.load(html);
  return withMasterHrefs(parseCategoryTree($, shop, store, master), store, master);
}

async function categoryHasAlbums(
  shop: Shop,
  category: NavCategory,
  master: boolean
) {
  const listing = await loadListing(shop, master, {
    categoryId: category.yupooId,
    isSubCategory: category.isSubCategory,
    page: 1,
  });
  return listing.albums.length > 0;
}

async function filterPopulatedCategories(
  store: Store,
  categories: NavCategory[],
  master: boolean
) {
  const flat = flattenCategories(categories);
  if (flat.length > POPULATED_CATEGORY_CACHE_MAX) {
    return categories;
  }
  if (store.categoryListingMode !== "brands" && flat.length > 80) {
    return categories;
  }
  const populated = new Set<string>();
  const queue = [...flat];
  const concurrency = 8;
  while (queue.length) {
    const batch = queue.splice(0, concurrency);
    const results = await Promise.all(
      batch.map(async (category) => {
        const shop = getShop(category.shopSlug);
        const ok = await categoryHasAlbums(shop, category, master);
        return ok ? category.id : null;
      })
    );
    for (const id of results) {
      if (id) populated.add(id);
    }
  }

  const keep = (nodes: NavCategory[]): NavCategory[] =>
    nodes
      .map((node) => {
        const children = keep(node.children);
        if (populated.has(node.id) || children.length) {
          return { ...node, children };
        }
        return null;
      })
      .filter((node): node is NavCategory => node !== null);

  return keep(categories);
}

function paginate<T>(items: T[], page: number, pageSize = SEARCH_PAGE_SIZE) {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(page, 1), pageCount);
  const start = (current - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page: current,
    pageCount,
  };
}

export async function getStoreCategories(store: Store, master: boolean) {
  const groups = await Promise.all(
    storeShops(store).map((shop) => loadCategories(shop, store, master))
  );
  const merged =
    store.categoryListingMode === "brands"
      ? mergeBrandCategories(groups, store, master)
      : groups.flat();
  return filterPopulatedCategories(store, merged, master);
}

async function defaultListing(
  store: Store,
  categories: NavCategory[],
  master: boolean,
  page: number
): Promise<ListingResult> {
  if (store.pinnedCategoryId) {
    const pinned =
      flattenCategories(categories).find(
        (category) => category.yupooId === store.pinnedCategoryId
      ) ?? flattenCategories(categories).find((category) => category.id === store.pinnedCategoryId);
    if (pinned) {
      return getCategoryListing(store, pinned, master, page);
    }
    const shop = storeShops(store)[0];
    if (shop) {
      return loadListing(shop, master, {
        categoryId: store.pinnedCategoryId,
        page,
      });
    }
  }

  const listings = await Promise.all(
    storeShops(store).map((shop) => loadListing(shop, master, { page }))
  );
  if (listings.length === 1) {
    return listings[0];
  }
  const albums = interleaveByShop(listings.flatMap((listing) => listing.albums));
  const pageCount = Math.max(1, ...listings.map((listing) => listing.pageCount));
  return { albums, page, pageCount };
}

export async function getStoreIndex(
  store: Store,
  master: boolean,
  page = 1
): Promise<StoreIndex> {
  const categories = await getStoreCategories(store, master);
  const listing = await defaultListing(store, categories, master, page);
  return { categories, listing };
}

export async function getCategoryListing(
  store: Store,
  category: NavCategory,
  master: boolean,
  page = 1
): Promise<ListingResult> {
  if (store.categoryListingMode === "brands") {
    const listings = await Promise.all(
      storeShops(store).map(async (shop) => {
        const cats = await loadCategories(shop, store, master);
        const match = flattenCategories(cats).find(
          (item) =>
            item.id === category.id ||
            categoryKey(item.name) === category.id ||
            item.yupooId === category.yupooId
        );
        if (!match) {
          return { albums: [] as Album[], page: 1, pageCount: 1 };
        }
        return loadListing(shop, master, {
          categoryId: match.yupooId,
          isSubCategory: match.isSubCategory,
          page,
        });
      })
    );
    const albums = interleaveByShop(listings.flatMap((listing) => listing.albums));
    return {
      albums,
      page,
      pageCount: Math.max(1, ...listings.map((listing) => listing.pageCount)),
    };
  }
  return loadListing(getShop(category.shopSlug), master, {
    categoryId: category.yupooId,
    isSubCategory: category.isSubCategory,
    page,
  });
}

export async function searchStore(
  store: Store,
  q: string,
  master: boolean,
  page = 1
): Promise<ListingResult> {
  const listings = await Promise.all(
    storeShops(store).map(async (shop) => {
      const pages = await Promise.all(
        [1, 2].map((shopPage) =>
          loadListing(shop, master, { q, page: shopPage })
        )
      );
      return pages.flatMap((listing) => listing.albums);
    })
  );
  const albums = interleaveByShop(
    listings.flat().filter((album) => matchesQuery(album.rawTitle, q) || matchesQuery(album.title, q))
  );
  const sliced = paginate(albums, page);
  return {
    albums: sliced.items,
    page: sliced.page,
    pageCount: sliced.pageCount,
  };
}

export async function searchAllStores(
  q: string,
  master: boolean,
  page = 1
): Promise<ListingResult & { albums: Album[] }> {
  const listings = await Promise.all(
    stores.flatMap((store) =>
      storeShops(store).map(async (shop) => {
        const pages = await Promise.all(
          Array.from({ length: GLOBAL_SEARCH_PAGES_PER_SHOP }, (_, i) =>
            loadListing(shop, master, { q, page: i + 1 })
          )
        );
        return pages.flatMap((listing) => listing.albums);
      })
    )
  );
  const albums = interleaveByShop(
    listings
      .flat()
      .filter(
        (album) => matchesQuery(album.rawTitle, q) || matchesQuery(album.title, q)
      )
  );
  const sliced = paginate(albums, page);
  return {
    albums: sliced.items,
    page: sliced.page,
    pageCount: sliced.pageCount,
  };
}

export async function getAlbum(
  shopSlug: string,
  id: string,
  master: boolean
): Promise<{ album: Album; photos: Photo[] }> {
  const shop = getShop(shopSlug);
  const html = await fetchHtml(absUrl(shop, `/albums/${id}?uid=1`));
  const $ = cheerio.load(html);
  const rawTitle = (
    $("title").first().text().split("|")[0] ||
    $(".showalbumheader__gallerytitle, .album__title").first().text() ||
    ""
  )
    .replace(/\s+/g, " ")
    .trim();
  const photos: Photo[] = [];
  const seen = new Set<string>();
  $("img[data-origin-src], .image__main img, .showalbum__child img").each(
    (_, el) => {
      const node = $(el);
      const src = proxyImageUrl(
        shopSlug,
        node.attr("data-origin-src") || node.attr("data-src") || node.attr("src")
      );
      if (!src || seen.has(src)) return;
      seen.add(src);
      photos.push({
        src,
        alt: displayTitle(node.attr("alt") || rawTitle, master),
      });
    }
  );
  if (!photos.length) {
    throw new Error("This item has no photos");
  }
  return {
    album: {
      id,
      shopSlug,
      title: displayTitle(rawTitle, master),
      rawTitle,
      thumb: photos[0]?.src,
      photoCount: photos.length,
      href: `/albums/${id}`,
    },
    photos,
  };
}

export function storeNameForShop(shopSlug: string) {
  return stores.find((store) => store.shopSlugs.includes(shopSlug))?.name;
}

export { categoryKey };
