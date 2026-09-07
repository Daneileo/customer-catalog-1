import { CatalogListing } from "@/components/catalog-listing";
import { getStoreIndex } from "@/lib/catalog";
import { getStore, storeBase } from "@/lib/shops";
import { notFound } from "next/navigation";

export default async function MasterStorePage({
  params,
  searchParams,
}: {
  params: Promise<{ store: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { store: storeSlug } = await params;
  const store = getStore(storeSlug);
  if (!store) notFound();
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const index = await getStoreIndex(store, true, page);

  return (
    <CatalogListing
      store={store}
      title={store.name}
      categories={index.categories}
      albums={index.listing.albums}
      page={index.listing.page}
      pageCount={index.listing.pageCount}
      listingBase={storeBase(true, store.slug)}
      master
    />
  );
}
