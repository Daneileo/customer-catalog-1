const YEN_PRICE =
  /(?:¥|￥)\s*\d+(?:\.\d+)?(?:\s*[←<-]\s*(?:¥|￥)?\s*\d+(?:\.\d+)?)?/g;
const NUMBER_Y_PREFIX = /\b\d+Y\b/g;
const TOP_PRICE_CHUNKS =
  /\b(?:TOP|TROUSERS?|TROUSERE)\s*(?:¥|￥)\s*\d+(?:\.\d+)?/gi;

export function stripYenPrices(text: string) {
  return text
    .replace(TOP_PRICE_CHUNKS, "")
    .replace(YEN_PRICE, "")
    .replace(NUMBER_Y_PREFIX, "")
    .replace(/\s*[←<-]\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function displayTitle(text: string, master: boolean) {
  return master ? text.trim() : stripYenPrices(text);
}

export function hasYen(text: string) {
  return /[¥￥]/.test(text) || /\b\d+Y\b/.test(text);
}
