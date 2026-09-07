import { CatalogListing } from "@/components/catalog-listing";
import { getStoreCategories, searchStore } from "@/lib/catalog";
import { getStore, searchPath } from "@/lib/shops";
import { notFound } from "next/navigation";

export default async function StoreSearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ store: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { store: storeSlug } = await params;
  const store = getStore(storeSlug);
  if (!store) notFound();
  const query = await searchParams;
  const q = query.q?.trim() ?? "";
  const page = Math.max(1, Number(query.page) || 1);
  const [categories, listing] = await Promise.all([
    getStoreCategories(store, false),
    q
      ? searchStore(store, q, false, page)
      : Promise.resolve({ albums: [], page: 1, pageCount: 1 }),
  ]);

  return (
    <CatalogListing
      store={store}
      title={q ? `Search in ${store.name}: ${q}` : `Search ${store.name}`}
      categories={categories}
      albums={listing.albums}
      page={listing.page}
      pageCount={listing.pageCount}
      query={q}
      searchScope="this"
      listingBase={searchPath(false, store.slug)}
    />
  );
}
