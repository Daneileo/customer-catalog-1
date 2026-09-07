import type { Photo } from "@/lib/catalog";

export function PhotoGallery({ photos }: { photos: Photo[] }) {
  return (
    <div className="grid gap-3">
      {photos.map((photo) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          className="mx-auto w-full max-w-3xl rounded-lg border border-border bg-muted object-contain"
        />
      ))}
    </div>
  );
}
