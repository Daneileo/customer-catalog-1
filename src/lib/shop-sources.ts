export type ShopBlockRule = {
  categories?: RegExp[];
  albums?: RegExp[];
  customerCategories?: RegExp[];
  customerAlbums?: RegExp[];
};

export const shopBlocks: Record<string, ShopBlockRule> = {
  wwfake100: {
    categories: [/shopping guide/i, /recommended agents/i],
    albums: [
      /order issues/i,
      /social media/i,
      /tiktok/i,
      /collaborative promotion/i,
      /rizzitgo/i,
      /gtbuy/i,
      /rat king logistics/i,
    ],
    customerCategories: [/tik\s*tok/i],
    customerAlbums: [/tik\s*tok/i],
  },
  yolo66: {
    categories: [
      /luxury shoes/i,
      /contact information/i,
      /how to (order|place)/i,
      /telegram/i,
      /wechat/i,
      /taobao catalog guide/i,
      /purchase through agents/i,
      /direct mail shipping/i,
    ],
    albums: [
      /2025 talent cooperation/i,
      /discount for wholesaler/i,
      /view the qc pictures/i,
      /ordering goods through/i,
      /weidian purchases products/i,
      /direct mail transport/i,
      /taobao disguised link/i,
    ],
  },
  luxury233: {
    categories: [/other catalogues/i, /\bnews\b/i],
    customerCategories: [/^👟\s*prad/i, /prad■/i],
    customerAlbums: [
      /cyprus/i,
      /b22.*comparison/i,
      /in october.*recent new batch/i,
      /latest v3 version kl batch/i,
      /new batches under development/i,
      /prad.*a/i,
    ],
  },
  jimioptical: {
    categories: [/contact/i, /\bw2c\b/i],
  },
  niuniu6688: {
    categories: [/uncategorized/i],
  },
  dreamremake2: {
    categories: [/uncategorized/i],
  },
  palmmoose: {
    categories: [/uncategorized/i],
  },
  west42: {
    categories: [/production plan/i],
  },
  terryqiuyi: {
    categories: [/qc photos/i, /\bnotice\b/i],
  },
  emmaluxury: {
    categories: [/^qc$/i],
  },
  godmall: {
    categories: [/warm reminder/i],
  },
  hlinjewelry: {
    categories: [/online store/i],
  },
  pikachushop: {
    categories: [/how to buy/i],
  },
};

function matchesAny(text: string, patterns?: RegExp[]) {
  if (!patterns?.length) return false;
  return patterns.some((pattern) => pattern.test(text));
}

export function isHiddenCategory(
  shopSlug: string,
  name: string,
  master: boolean
) {
  const rule = shopBlocks[shopSlug];
  if (!rule) return false;
  if (matchesAny(name, rule.categories)) return true;
  if (!master && matchesAny(name, rule.customerCategories)) return true;
  return false;
}

export function isHiddenAlbum(
  shopSlug: string,
  name: string,
  master: boolean
) {
  const rule = shopBlocks[shopSlug];
  if (!rule) return false;
  if (matchesAny(name, rule.albums)) return true;
  if (!master && matchesAny(name, rule.customerAlbums)) return true;
  return false;
}
