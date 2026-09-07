import { CatalogTabs } from "@/components/catalog-tabs";
import { SearchForm } from "@/components/search-form";
import { WHATSAPP_DISPLAY, whatsappLink } from "@/lib/shops";

export function SiteHeader({
  storeSlug,
  master = false,
  searchScope = "every",
  query = "",
}: {
  storeSlug?: string;
  master?: boolean;
  searchScope?: "every" | "this";
  query?: string;
}) {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <a href={master ? "/master/manybrands-1" : "/"} className="text-lg font-semibold">
            Catalog
          </a>
          <a
            href={whatsappLink("Hi, I want to place an order.")}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            WhatsApp {WHATSAPP_DISPLAY}
          </a>
        </div>
        <SearchForm
          storeSlug={storeSlug}
          master={master}
          defaultScope={searchScope}
          defaultQuery={query}
        />
        <CatalogTabs current={storeSlug} master={master} />
      </div>
    </header>
  );
}
