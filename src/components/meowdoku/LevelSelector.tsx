"use client";

import React, { useState } from "react";
import type { Difficulty, Level } from "@/lib/meowdoku/types";
import { DIFFICULTY_LABELS, LEVELS, loadSavedProgress } from "@/lib/meowdoku/game-logic";

interface LevelSelectorProps {
  isOpen: boolean;
  difficulty: Difficulty;
  levels: Level[];
  currentLevelIndex: number;
  unlockedCount: number;
  completedIds: Set<number>;
  onSelectLevel: (index: number) => void;
  onChangeDifficulty?: (diff: Difficulty) => void;
  onClose: () => void;
}

const MODES: { id: Difficulty; label: string; size: string; count: number }[] = [
  { id: "normal", label: "Normal", size: "6x6", count: 50 },
  { id: "hard", label: "Hard", size: "8x8", count: 105 },
  { id: "ultra", label: "Ultra", size: "9x9", count: 116 },
];

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  isOpen,
  difficulty,
  levels,
  currentLevelIndex,
  unlockedCount,
  completedIds,
  onSelectLevel,
  onChangeDifficulty,
  onClose,
}) => {
  const [viewDifficulty, setViewDifficulty] = useState<Difficulty>(difficulty);

  if (!isOpen) return null;

  // Active view data (if viewing another difficulty's roadmap)
  const isViewingCurrent = viewDifficulty === difficulty;
  const activeLevels = isViewingCurrent ? levels : LEVELS[viewDifficulty];
  const activeSaved = isViewingCurrent ? null : loadSavedProgress(viewDifficulty);
  const activeCompletedIds = isViewingCurrent
    ? completedIds
    : new Set<number>(activeSaved?.completedLevelIds ?? []);
  const activeUnlockedCount = isViewingCurrent
    ? unlockedCount
    : (activeSaved?.unlockedLevelCount ?? 1);

  const progressPercent = Math.round(
    (activeCompletedIds.size / activeLevels.length) * 100
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2.5 backdrop-blur-sm transition-opacity sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[1.6rem] bg-white p-4 shadow-2xl ring-1 ring-[#eaded8] sm:rounded-[2.2rem] sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Mode Switcher & Close */}
        <div className="border-b border-[#f4dfdc] pb-3 sm:pb-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-2xl bg-[#fff4f0] text-lg sm:text-xl shadow-sm ring-1 ring-[#f4dfdc]">
                🗺️
              </span>
              <div className="min-w-0">
                <h2 className="text-base font-black text-[#3d302c] sm:text-2xl truncate">
                  Campaign Journey Map
                </h2>
                <p className="text-[11px] sm:text-xs font-bold text-[#8b746d] truncate">
                  Solve each level sequentially!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-[#fbf1ec] text-base sm:text-lg font-bold text-[#7a635c] transition hover:bg-[#f0dfd8] hover:text-[#3d302c]"
            >
              ✕
            </button>
          </div>

          {/* Difficulty Journey Tabs */}
          <div className="mt-2.5 sm:mt-3 flex gap-1.5 sm:gap-2 rounded-2xl bg-[#f8f6ef] p-1 sm:p-1.5 ring-1 ring-[#eaded8]">
            {MODES.map((mode) => {
              const isSelected = viewDifficulty === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => {
                    setViewDifficulty(mode.id);
                    if (onChangeDifficulty && mode.id !== difficulty) {
                      onChangeDifficulty(mode.id);
                    }
                  }}
                  className={`flex flex-1 items-center justify-center gap-1 sm:gap-1.5 rounded-xl py-1.5 sm:py-2 text-[11px] sm:text-xs font-black transition-all ${
                    isSelected
                      ? "bg-[#3d302c] text-white shadow-md ring-1 ring-[#3d302c]"
                      : "text-[#7a635c] hover:bg-white hover:text-[#3d302c]"
                  }`}
                >
                  <span>{mode.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[9px] sm:text-[10px] font-bold ${
                      isSelected ? "bg-white/20 text-white" : "bg-[#eaded8]/60 text-[#8b746d]"
                    }`}
                  >
                    {mode.size}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Progress Bar & Journey Stats */}
          <div className="mt-2.5 sm:mt-3 flex flex-col gap-1 sm:gap-1.5">
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-black">
              <span className="text-[#3d302c] truncate">
                {DIFFICULTY_LABELS[viewDifficulty]}: {activeCompletedIds.size} / {activeLevels.length} Solved
              </span>
              <span className="text-[#559c68] ml-2 shrink-0">{progressPercent}%</span>
            </div>
            <div className="h-2 sm:h-2.5 w-full overflow-hidden rounded-full bg-[#f3edea] ring-1 ring-[#eaded8]/60">
              <div
                className="h-full rounded-full bg-[#559c68] transition-all duration-500 shadow-sm"
                style={{ width: `${Math.max(2, progressPercent)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Level Path Grid */}
        <div className="mt-3 sm:mt-4 grid max-h-[48vh] sm:max-h-[50vh] grid-cols-4 gap-1.5 sm:gap-2.5 overflow-y-auto pr-1 sm:grid-cols-5 md:grid-cols-6">
          {activeLevels.map((lvl, idx) => {
            const isUnlocked = idx < activeUnlockedCount;
            const isCompleted = activeCompletedIds.has(lvl.id);
            const isCurrent = isViewingCurrent && idx === currentLevelIndex;

            return (
              <button
                key={lvl.id}
                type="button"
                disabled={!isUnlocked}
                title={
                  isCompleted
                    ? `Level ${idx + 1}: Completed! ✓`
                    : isCurrent
                      ? `Level ${idx + 1}: Currently Playing 🐱`
                      : isUnlocked
                        ? `Level ${idx + 1}: Unlocked! Click to play.`
                        : `Level ${idx + 1}: Locked. Complete Level ${idx} first!`
                }
                onClick={() => {
                  if (onChangeDifficulty && viewDifficulty !== difficulty) {
                    onChangeDifficulty(viewDifficulty);
                  }
                  onSelectLevel(idx);
                  onClose();
                }}
                className={`relative flex flex-col items-center justify-center rounded-2xl p-2.5 text-center transition-all ${
                  isCurrent
                    ? "bg-[#3d302c] text-white shadow-lg ring-2 ring-[#3d302c] scale-105"
                    : isCompleted
                      ? "bg-[#eef8eb] text-[#3d302c] ring-1 ring-[#c5e6be] hover:bg-[#e1f3dc] hover:scale-105"
                      : isUnlocked
                        ? "bg-[#fdfaf8] text-[#7a635c] ring-1 ring-[#eaded8] hover:bg-[#fff0e6] hover:text-[#3d302c] hover:scale-105"
                        : "cursor-not-allowed bg-[#f5efe9] text-[#b8a7a0] opacity-55"
                }`}
              >
                <span className="text-[11px] font-bold opacity-75">
                  Lvl {idx + 1}
                </span>
                <span className="text-xs font-black">
                  {lvl.size}x{lvl.size}
                </span>

                {isCompleted && (
                  <span className="mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#559c68] text-[9px] font-black text-white shadow">
                    ✓
                  </span>
                )}
                {isCurrent && !isCompleted && (
                  <span className="mt-1 text-[11px] font-black text-amber-300">
                    🐱
                  </span>
                )}
                {!isUnlocked && (
                  <span className="mt-1 text-[11px] opacity-80">
                    🔒
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
