"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  seasons: string[];
  activeSeason?: string;
}

export default function ShopFilters({ seasons, activeSeason }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  function setFilter(season: string) {
    const sp = new URLSearchParams(params.toString());
    if (season === "all") {
      sp.delete("season");
    } else {
      sp.set("season", season);
    }
    router.push(`/shop?${sp.toString()}`);
  }

  const filters = ["all", ...seasons];
  const current = activeSeason ?? "all";

  return (
    <div className="flex items-center justify-between border-b border-border pb-8 mb-12">
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => {
          const label = f === "all" ? "All" : f;
          const isActive = f === current;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[10px] tracking-[0.25em] uppercase px-4 py-2 border transition-colors duration-200 cursor-pointer ${
                isActive
                  ? "border-primary text-primary"
                  : "border-border text-foreground/40 hover:border-primary/40 hover:text-foreground/70"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/25 hidden sm:block">
        Fragrances
      </span>
    </div>
  );
}
