import { getShop } from "@/lib/shops";

export async function GET(
  _request: Request,
  context: { params: Promise<{ shop: string; path: string[] }> }
) {
  const { shop: shopSlug, path } = await context.params;
  let shop;
  try {
    shop = getShop(shopSlug);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const photoPath = path.join("/");
  if (!photoPath || photoPath.includes("..")) {
    return new Response("Not found", { status: 404 });
  }

  const url = `https://photo.yupoo.com/${shop.photoUser}/${photoPath}`;
  const response = await fetch(url, {
    headers: {
      referer: `https://${shop.host}/`,
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    },
  });

  if (!response.ok || !response.body) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  const contentType = response.headers.get("content-type") || "image/jpeg";
  headers.set("content-type", contentType);
  headers.set("cache-control", "public, max-age=86400, immutable");

  return new Response(response.body, { headers });
}
