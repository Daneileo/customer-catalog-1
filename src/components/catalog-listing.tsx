import { BrandNav } from "@/components/brand-nav";
import { ProductGrid } from "@/components/product-grid";
import { SiteHeader } from "@/components/site-header";
import type { Album } from "@/lib/catalog";
import type { NavCategory } from "@/lib/category-nav";
import type { Store } from "@/lib/shops";

function pageHref(base: string, page: number, q?: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export function CatalogListing({
  store,
  categories,
  albums,
  page,
  pageCount,
  master = false,
  title,
  currentCategoryId,
  searchScope = "every",
  query,
  showCatalog = false,
  listingBase,
}: {
  store?: Store;
  categories?: NavCategory[];
  albums: Album[];
  page: number;
  pageCount: number;
  master?: boolean;
  title: string;
  currentCategoryId?: string;
  searchScope?: "every" | "this";
  query?: string;
  showCatalog?: boolean;
  listingBase: string;
}) {
  return (
    <div className="min-h-full">
      <SiteHeader
        storeSlug={store?.slug}
        master={master}
        searchScope={searchScope}
        query={query}
      />
      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <h1 className="mb-4 text-2xl font-semibold tracking-tight">{title}</h1>
        {categories?.length ? (
          <BrandNav categories={categories} currentId={currentCategoryId} />
        ) : null}
        <div className="mt-6">
          <ProductGrid
            albums={albums}
            master={master}
            showCatalog={showCatalog}
            store={store}
          />
        </div>
        {pageCount > 1 ? (
          <nav className="mt-8 flex items-center justify-center gap-4 text-sm" aria-label="Pagination">
            {page > 1 ? (
              <a
                href={pageHref(listingBase, page - 1, query)}
                className="rounded-lg border border-border px-3 py-1.5 hover:bg-muted"
              >
                Previous
              </a>
            ) : (
              <span className="px-3 py-1.5 text-muted-foreground">Previous</span>
            )}
            <span>
              Page {page} of {pageCount}
            </span>
            {page < pageCount ? (
              <a
                href={pageHref(listingBase, page + 1, query)}
                className="rounded-lg border border-border px-3 py-1.5 hover:bg-muted"
              >
                Next
              </a>
            ) : (
              <span className="px-3 py-1.5 text-muted-foreground">Next</span>
            )}
          </nav>
        ) : null}
      </main>
    </div>
  );
}
