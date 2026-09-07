import { stores, storeBase } from "@/lib/shops";

const TOGGLE_SCRIPT = `
(function(){
  var el = document.getElementById("catalog-tabs-open");
  if (!el) return;
  try {
    el.checked = localStorage.getItem("catalog-tabs-open") === "1";
  } catch (e) {}
  el.addEventListener("change", function(){
    try {
      localStorage.setItem("catalog-tabs-open", el.checked ? "1" : "0");
    } catch (e) {}
  });
})();
`;

export function CatalogTabs({
  current,
  master = false,
}: {
  current?: string;
  master?: boolean;
}) {
  return (
    <div className="group/catalogs">
      <input
        id="catalog-tabs-open"
        type="checkbox"
        className="peer/catalogs sr-only"
      />
      <nav
        data-catalog-tabs
        className="flex flex-wrap items-center gap-1.5"
        aria-label="Catalogs"
      >
        <a
          href={master ? "/master/manybrands-1" : "/"}
          className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-sm hover:bg-muted"
        >
          Home
        </a>
        {stores.map((store) => {
          const active = store.slug === current;
          return (
            <a
              key={store.slug}
              href={storeBase(master, store.slug)}
              data-catalog-link={store.slug}
              className={[
                "rounded-full border px-3 py-1 text-sm hover:bg-muted",
                active
                  ? "inline-flex border-foreground bg-foreground text-background hover:bg-foreground/90"
                  : "hidden border-border bg-background group-has-[:checked]/catalogs:inline-flex",
              ].join(" ")}
            >
              {store.name}
            </a>
          );
        })}
      </nav>
      <div className="mt-2 flex gap-2">
        <label
          htmlFor="catalog-tabs-open"
          className="cursor-pointer text-sm text-muted-foreground underline-offset-4 hover:underline group-has-[:checked]/catalogs:hidden"
        >
          Show all catalogs
        </label>
        <label
          htmlFor="catalog-tabs-open"
          className="hidden cursor-pointer text-sm text-muted-foreground underline-offset-4 hover:underline group-has-[:checked]/catalogs:inline"
        >
          Hide catalogs
        </label>
      </div>
      <script dangerouslySetInnerHTML={{ __html: TOGGLE_SCRIPT }} />
    </div>
  );
}
