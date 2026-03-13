"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Itinerary } from "@/lib/types";

const INTEREST_OPTIONS = [
  { id: "culture", label: "Culture & Heritage" },
  { id: "adventure", label: "Adventure" },
  { id: "spiritual", label: "Spiritual" },
  { id: "food", label: "Food & Local Life" },
];

export default function TripPlannerPage() {
  const searchParams = useSearchParams();
  const focusDestination = searchParams.get("focusDestination") ?? "";

  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState("Medium (₹3k–₹6k per day)");
  const [startingCity, setStartingCity] = useState("Delhi");
  const [interests, setInterests] = useState<string[]>(["culture", "food"]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  useEffect(() => {
    if (focusDestination) {
      setInterests((current) =>
        current.includes("adventure") ? current : [...current, "adventure"],
      );
    }
  }, [focusDestination]);

  function toggleInterest(id: string) {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setItinerary(null);
    try {
      const res = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          number_of_days: days,
          budget,
          interests:
            focusDestination && !interests.includes(focusDestination)
              ? [...interests, focusDestination]
              : interests,
          starting_city: startingCity,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Failed to generate itinerary.");
        return;
      }
      setItinerary(data as Itinerary);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 grid md:grid-cols-[minmax(0,2fr),minmax(0,3fr)] gap-8">
        <section className="space-y-6">
          <header className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
              AI Trip Planner
            </p>
            <h1 className="text-3xl font-semibold">
              Plan your North India journey
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Describe your time, budget, and interests. NorthQuest will build a
              realistic, day-by-day route across North India.
            </p>
          </header>

          {focusDestination && (
            <div className="text-xs rounded-xl border border-dashed border-emerald-400/50 bg-emerald-500/5 text-emerald-800 dark:text-emerald-200 px-3 py-2">
              Focusing on{" "}
              <span className="font-semibold">{focusDestination}</span> for this
              plan.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <label className="space-y-1 text-sm">
                <span className="block text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  Number of days
                </span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-200"
                />
              </label>

              <label className="space-y-1 text-sm">
                <span className="block text-xs font-medium text-zinc-600 dark:text-zinc-300">
                  Starting city
                </span>
                <input
                  value={startingCity}
                  onChange={(e) => setStartingCity(e.target.value)}
                  placeholder="e.g. Delhi, Jaipur, Chandigarh"
                  className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-200"
                />
              </label>
            </div>

            <label className="space-y-1 text-sm block">
              <span className="block text-xs font-medium text-zinc-600 dark:text-zinc-300">
                Budget style
              </span>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-200"
              >
                <option>Budget (₹1.5k–₹3k per day)</option>
                <option>Medium (₹3k–₹6k per day)</option>
                <option>Comfort (₹6k–₹10k per day)</option>
                <option>Premium (₹10k+ per day)</option>
              </select>
            </label>

            <fieldset className="space-y-2">
              <legend className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                Interests
              </legend>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((opt) => {
                  const active = interests.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleInterest(opt.id)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                        active
                          ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white"
                          : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-zinc-900 dark:hover:border-zinc-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {error && (
              <p className="text-xs text-red-500 bg-red-500/5 border border-red-500/30 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-black text-white dark:bg-white dark:text-black px-5 py-2.5 text-sm font-medium disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Generating itinerary...
                </>
              ) : (
                "Generate itinerary"
              )}
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/70 p-4 min-h-[220px]">
            {!itinerary && !loading && (
              <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <p className="font-medium text-zinc-800 dark:text-zinc-100">
                  Your itinerary will appear here.
                </p>
                <p>
                  You will get a structured, day-by-day plan with suggested
                  cities, experiences, and travel tips tuned for North India.
                </p>
              </div>
            )}

            {loading && (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 space-y-2"
                    >
                      <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
                      <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                      <div className="h-3 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {itinerary && !loading && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold">Itinerary overview</h2>
                  {itinerary.estimated_budget && (
                    <span className="text-xs rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-3 py-1">
                      {itinerary.estimated_budget}
                    </span>
                  )}
                </div>

                <ol className="space-y-3 text-sm">
                  {itinerary.days.map((day) => (
                    <li
                      key={day.day}
                      className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 space-y-1 bg-zinc-50/80 dark:bg-zinc-900/60"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-zinc-500">
                          Day {day.day}
                        </p>
                        {day.city && (
                          <p className="text-xs font-semibold">{day.city}</p>
                        )}
                      </div>
                      <ul className="mt-1 list-disc list-inside space-y-0.5 text-xs text-zinc-700 dark:text-zinc-300">
                        {day.activities.map((act, idx) => (
                          <li key={idx}>{act}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>

                {itinerary.travel_tips?.length > 0 && (
                  <div className="border-t border-dashed border-zinc-200 dark:border-zinc-800 pt-3 mt-2">
                    <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-1">
                      Travel tips
                    </p>
                    <ul className="list-disc list-inside text-xs text-zinc-600 dark:text-zinc-400 space-y-0.5">
                      {itinerary.travel_tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

