import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-16">
        <h1 className="text-2xl font-semibold">Not found</h1>
        <p className="mt-2 text-muted-foreground">
          That catalog, brand, or item does not exist.
        </p>
      </main>
    </div>
  );
}
