"use client";

import React from "react";
import Image from "next/image";
import type { CellState, Level } from "@/lib/meowdoku/types";
import { cellKey, DEFAULT_THEME_PALETTE, findCats } from "@/lib/meowdoku/game-logic";

interface RegionTrackerProps {
  level: Level;
  board: CellState[][];
  conflicts: Set<string>;
  layout?: "grid" | "strip";
}

export const RegionTracker: React.FC<RegionTrackerProps> = ({
  level,
  board,
  conflicts,
  layout = "grid",
}) => {
  // Get unique regions preserving appearance order
  const uniqueRegions = Array.from(new Set(level.regions.flat()));
  const cats = findCats(board);

  return (
    <div className="w-full">
      <div
        className={
          layout === "grid"
            ? "grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-3 gap-1.5 sm:gap-2"
            : "flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
        }
      >
        {uniqueRegions.map((region) => {
          const bgColor = DEFAULT_THEME_PALETTE[region] ?? level.regionColors[region] ?? "#f4d6ce";

          // Find cats in this region safely with optional chaining
          const catsInRegion = cats.filter(
            (c) => level.regions[c.row]?.[c.col] === region
          );

          const hasConflictingCat = catsInRegion.some((c) =>
            conflicts.has(cellKey(c.row, c.col))
          );
          const isDone = catsInRegion.length === 1 && !hasConflictingCat;
          const hasError = catsInRegion.length > 1 || (catsInRegion.length === 1 && hasConflictingCat);

          return (
            <div
              key={region}
              title={`Color ${region}: ${isDone ? "Done ✓" : hasError ? "Conflict ✕" : "Remaining"}`}
              className={`relative flex h-9 sm:h-11 w-full items-center justify-center rounded-xl border border-white/90 sm:border-2 shadow-sm transition-all duration-200 ${
                isDone
                  ? "ring-2 ring-[#559c68] shadow-md scale-[1.02]"
                  : hasError
                    ? "ring-2 ring-[#f26a43] animate-pulse"
                    : "opacity-80 hover:opacity-100"
              }`}
              style={{ backgroundColor: bgColor }}
            >
              {/* Region letter indicator */}
              <span className="absolute left-1.5 top-0.5 text-[9px] font-black text-white/90 drop-shadow-sm">
                {region}
              </span>

              {/* Cat status */}
              {isDone ? (
                <div className="relative flex h-full w-full items-center justify-center p-1">
                  <Image
                    src="/assets/cat.webp"
                    alt={`Cat for region ${region}`}
                    width={32}
                    height={32}
                    className="h-7 w-7 object-contain drop-shadow"
                  />
                  {/* Mini check badge */}
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#559c68] text-[8px] font-black text-white ring-1 ring-white shadow">
                    ✓
                  </span>
                </div>
              ) : hasError ? (
                <div className="relative flex h-full w-full items-center justify-center p-1">
                  <Image
                    src="/assets/cat.webp"
                    alt="Conflict"
                    width={32}
                    height={32}
                    className="h-7 w-7 object-contain brightness-75 drop-shadow"
                  />
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#f26a43] text-[8px] font-black text-white ring-1 ring-white shadow">
                    ✕
                  </span>
                </div>
              ) : (
                /* Empty / remaining silhouette */
                <div className="flex h-full w-full items-center justify-center p-1 opacity-30 transition-opacity hover:opacity-50">
                  <Image
                    src="/assets/cat.webp"
                    alt="Pending cat"
                    width={28}
                    height={28}
                    className="h-6 w-6 object-contain grayscale brightness-150"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
