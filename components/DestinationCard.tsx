import Link from "next/link";
import type { Destination } from "@/lib/types";

type Props = {
  destination: Destination;
};

export function DestinationCard({ destination }: Props) {
  return (
    <Link
      href={`/destination/${destination.id}`}
      className="group rounded-xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 inline-flex items-center rounded-full bg-black/70 text-white text-xs px-3 py-1">
          {destination.is_hidden_gem ? "Hidden Gem" : "Popular"}
        </div>
        <div className="absolute bottom-3 right-3 text-xs bg-emerald-500/80 text-white px-2 py-0.5 rounded-full">
          Eco {destination.eco_score}/100
        </div>
      </div>
      <div className="flex-1 p-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-semibold text-base truncate">
            {destination.name}
          </h4>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {destination.state}
          </span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
          {destination.description}
        </p>
        <p className="text-xs text-amber-700 dark:text-amber-300 line-clamp-1">
          {destination.culture_highlight}
        </p>
      </div>
    </Link>
  );
}

