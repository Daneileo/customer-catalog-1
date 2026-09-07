import { SiteHeader } from "@/components/site-header";
import { WHATSAPP_DISPLAY, whatsappLink } from "@/lib/shops";

export default function HomePage() {
  return (
    <div className="min-h-full">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">HOW TO ORDER</h1>
        <p className="mt-4 text-base leading-7">
          cycle through the catalouges, each cataloige has its own brands and
          items, if you cant find an item contact me directy at 4162459504 on
          whatsapp, i have EVERYTHINGGGGG
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Use the search bar above to look through every catalog at once, or pick
          a catalog tab to browse.
        </p>
        <p className="mt-6">
          <a
            href={whatsappLink("Hi, I want to place an order.")}
            className="text-sm font-medium underline underline-offset-4"
          >
            WhatsApp {WHATSAPP_DISPLAY}
          </a>
        </p>
      </main>
    </div>
  );
}
