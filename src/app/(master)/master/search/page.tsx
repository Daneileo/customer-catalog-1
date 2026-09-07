import { CatalogListing } from "@/components/catalog-listing";
import { searchAllStores } from "@/lib/catalog";

export default async function MasterSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const page = Math.max(1, Number(params.page) || 1);
  const listing = q
    ? await searchAllStores(q, true, page)
    : { albums: [], page: 1, pageCount: 1 };

  return (
    <CatalogListing
      title={q ? `Search: ${q}` : "Search"}
      albums={listing.albums}
      page={listing.page}
      pageCount={listing.pageCount}
      query={q}
      listingBase="/master/search"
      showCatalog
      master
    />
  );
}
