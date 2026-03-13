import type { Destination } from "@/lib/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServerAnon } from "@/lib/supabase";

async function fetchDestination(id: string): Promise<Destination | null> {
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) return null;

  const supabase = supabaseServerAnon();
  const { data, error } = await supabase
    .from("destinations")
    .select(
      "id,name,state,description,image,eco_score,culture_highlight,is_hidden_gem",
    )
    .eq("id", numericId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load destination", error.message);
    return null;
  }

  return (data as Destination | null) ?? null;
}

type Props = {
  params: { id: string };
};

export default async function DestinationPage({ params }: Props) {
  const { id } = params;
  const destination = await fetchDestination(id);
  if (!destination) notFound();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <Link
          href="/explore"
          className="text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Back to all destinations
        </Link>

        <article className="grid md:grid-cols-[2fr,1fr] gap-8 items-start">
          <section className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                  {destination.is_hidden_gem ? "Hidden Gem" : "Popular Hub"}
                </p>
                <h1 className="mt-1 text-3xl font-semibold">
                  {destination.name}
                </h1>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500">State</p>
                <p className="text-sm font-medium">{destination.state}</p>
              </div>
            </div>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
              {destination.description}
            </p>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/70 p-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Eco score</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 px-2 py-0.5 text-xs">
                  {destination.eco_score}/100
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-500">
                  Cultural highlight
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  {destination.culture_highlight}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-4 space-y-3 text-xs text-zinc-600 dark:text-zinc-400">
              <p className="font-medium text-zinc-800 dark:text-zinc-100">
                Trip idea
              </p>
              <p>
                Use the AI Trip Planner to weave {destination.name} into a
                multi-day North India route based on your budget and time.
              </p>
              <Link
                href={{
                  pathname: "/trip-planner",
                  query: { focusDestination: destination.name },
                }}
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
              >
                Plan a trip including this place
              </Link>
            </div>
          </aside>
        </article>
      </main>
    </div>
  );
}

