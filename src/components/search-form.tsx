"use client";

import { searchPath } from "@/lib/shops";

export function SearchForm({
  storeSlug,
  master = false,
  defaultScope = "every",
  defaultQuery = "",
}: {
  storeSlug?: string;
  master?: boolean;
  defaultScope?: "every" | "this";
  defaultQuery?: string;
}) {
  const everyAction = searchPath(master);
  const thisAction = storeSlug ? searchPath(master, storeSlug) : everyAction;
  const action = defaultScope === "this" && storeSlug ? thisAction : everyAction;

  return (
    <form
      method="get"
      action={action}
      className="flex w-full max-w-xl flex-wrap items-center gap-2"
      data-search-form
    >
      <input
        type="search"
        name="q"
        defaultValue={defaultQuery}
        placeholder="Search items"
        className="h-9 min-w-48 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        aria-label="Search"
      />
      {storeSlug ? (
        <select
          name="scope"
          defaultValue={defaultScope}
          className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
          aria-label="Search scope"
          onChange={(event) => {
            const form = event.currentTarget.form;
            if (!form) return;
            form.action =
              event.currentTarget.value === "this" ? thisAction : everyAction;
          }}
        >
          <option value="every">Every catalog</option>
          <option value="this">This catalog</option>
        </select>
      ) : null}
      <button
        type="submit"
        className="h-9 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
      >
        Search
      </button>
    </form>
  );
}
