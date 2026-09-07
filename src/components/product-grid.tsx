import { storeNameForShop } from "@/lib/catalog";
import { itemPath, type Store } from "@/lib/shops";
import type { Album } from "@/lib/catalog";

export function ProductGrid({
  albums,
  master = false,
  showCatalog = false,
}: {
  albums: Album[];
  master?: boolean;
  showCatalog?: boolean;
  store?: Store;
}) {
  if (!albums.length) {
    return (
      <p className="text-sm text-muted-foreground">No items to show.</p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {albums.map((album) => (
        <li key={`${album.shopSlug}-${album.id}`}>
          <a
            href={itemPath(master, album.shopSlug, album.id)}
            className="block overflow-hidden rounded-lg border border-border bg-card hover:border-foreground/30"
          >
            <div className="aspect-square bg-muted">
              {album.thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={album.thumb}
                  alt={album.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : null}
            </div>
            <div className="space-y-1 p-2">
              {showCatalog ? (
                <p className="text-xs text-muted-foreground">
                  {storeNameForShop(album.shopSlug)}
                </p>
              ) : null}
              <p className="line-clamp-2 text-sm">{album.title}</p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
