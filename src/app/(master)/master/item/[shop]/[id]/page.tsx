import { PhotoGallery } from "@/components/photo-gallery";
import { SiteHeader } from "@/components/site-header";
import { getAlbum } from "@/lib/catalog";
import { getShop, storeByShopSlug } from "@/lib/shops";
import { notFound } from "next/navigation";

export default async function MasterItemPage({
  params,
}: {
  params: Promise<{ shop: string; id: string }>;
}) {
  const { shop: shopSlug, id } = await params;
  try {
    getShop(shopSlug);
  } catch {
    notFound();
  }
  let data;
  try {
    data = await getAlbum(shopSlug, id, true);
  } catch {
    notFound();
  }
  const store = storeByShopSlug.get(shopSlug);

  return (
    <div className="min-h-full">
      <SiteHeader storeSlug={store?.slug} master />
      <main className="mx-auto w-full max-w-4xl px-4 py-6">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">
          {data.album.title}
        </h1>
        <p className="mb-6 text-sm text-muted-foreground">
          <a
            href={`https://${getShop(shopSlug).host}/albums/${id}`}
            className="underline underline-offset-4"
          >
            Open on Yupoo
          </a>
        </p>
        <PhotoGallery photos={data.photos} />
      </main>
    </div>
  );
}
