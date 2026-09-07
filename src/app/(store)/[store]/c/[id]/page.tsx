import { CatalogListing } from "@/components/catalog-listing";
import { getCategoryListing, getStoreCategories } from "@/lib/catalog";
import { findCategory } from "@/lib/category-nav";
import { categoryPath, getStore } from "@/lib/shops";
import { notFound } from "next/navigation";

export default async function StoreCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ store: string; id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { store: storeSlug, id } = await params;
  const store = getStore(storeSlug);
  if (!store) notFound();
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const categories = await getStoreCategories(store, false);
  const category = findCategory(categories, id);
  if (!category) notFound();
  const listing = await getCategoryListing(store, category, false, page);

  return (
    <CatalogListing
      store={store}
      title={category.name}
      categories={categories}
      currentCategoryId={category.id}
      albums={listing.albums}
      page={listing.page}
      pageCount={listing.pageCount}
      listingBase={categoryPath(false, store.slug, category.id)}
    />
  );
}
