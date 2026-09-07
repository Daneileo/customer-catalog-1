import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { NavCategory } from "@/lib/category-nav";
import { flattenCategories } from "@/lib/category-nav";

export function BrandNav({
  categories,
  currentId,
}: {
  categories: NavCategory[];
  currentId?: string;
}) {
  const chips = categories;
  const all = flattenCategories(categories);

  if (!all.length) return null;

  return (
    <div className="group/brands mt-4">
      <input
        id="brands-open"
        type="checkbox"
        className="peer/brands sr-only"
      />
      <div className="flex flex-wrap items-center gap-2">
        <label
          htmlFor="brands-open"
          className="cursor-pointer text-sm text-muted-foreground underline-offset-4 hover:underline group-has-[:checked]/brands:hidden"
        >
          Show all brands
        </label>
        <label
          htmlFor="brands-open"
          className="hidden cursor-pointer text-sm text-muted-foreground underline-offset-4 hover:underline group-has-[:checked]/brands:inline"
        >
          Hide brands
        </label>
        <Popover>
          <PopoverTrigger className="inline-flex h-7 items-center rounded-lg border border-border bg-background px-2.5 text-[0.8rem] hover:bg-muted">
            Brands
          </PopoverTrigger>
          <PopoverContent className="max-h-80 w-72 overflow-auto">
            <PopoverHeader>
              <PopoverTitle>Brands</PopoverTitle>
            </PopoverHeader>
            <div className="flex flex-col gap-1">
              {all.map((category) => (
                <a
                  key={`${category.shopSlug}-${category.yupooId}-${category.id}`}
                  href={category.href}
                  className={`rounded px-2 py-1 text-sm hover:bg-muted ${
                    category.id === currentId ? "bg-muted font-medium" : ""
                  }`}
                >
                  {category.name}
                </a>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div
        data-brand-chips
        className="mt-3 hidden flex-wrap gap-1.5 group-has-[:checked]/brands:flex"
      >
        {chips.map((category) => (
          <a
            key={`${category.shopSlug}-${category.id}`}
            href={category.href}
            data-brand-chip={category.id}
            className={`inline-flex rounded-full border px-3 py-1 text-sm hover:bg-muted ${
              category.id === currentId
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background"
            }`}
          >
            {category.name}
          </a>
        ))}
      </div>
    </div>
  );
}
