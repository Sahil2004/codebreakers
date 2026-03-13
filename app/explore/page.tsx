import { DestinationCard } from "@/components/DestinationCard";
import type { Destination } from "@/lib/types";

async function fetchDestinations(hidden?: boolean): Promise<Destination[]> {
  const url = new URL(
    `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/destinations`,
  );
  if (hidden !== undefined) url.searchParams.set("hidden", String(hidden));

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) return [];
  const data = (await res.json()) as { destinations?: Destination[] };
  return data.destinations ?? [];
}

export default async function ExplorePage() {
  const [popular, hiddenGems] = await Promise.all([
    fetchDestinations(false),
    fetchDestinations(true),
  ]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        <header className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            Explore North India
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold">
            Destinations &amp; Hidden Gems
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
            Browse curated popular hubs and underrated eco-tourism spots across
            North India. Tap into local culture, heritage, and nature.
          </p>
        </header>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl font-semibold">Popular Hubs</h2>
            <p className="text-xs text-zinc-500">
              Jaipur, Agra, Rishikesh, Leh, Varanasi, Spiti Valley
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {popular.length === 0 ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 h-52"
                />
              ))
            ) : (
              popular.map((d) => <DestinationCard key={d.id} destination={d} />)
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl font-semibold">
              Underrated Destinations of North India
            </h2>
            <p className="text-xs text-zinc-500">
              Tirthan Valley, Kalpa, Chitkul, Chopta, Munsiyari
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {hiddenGems.length === 0 ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 h-52"
                />
              ))
            ) : (
              hiddenGems.map((d) => <DestinationCard key={d.id} destination={d} />)
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

