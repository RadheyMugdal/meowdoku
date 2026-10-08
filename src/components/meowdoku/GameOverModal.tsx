"use client";

import React from "react";
import Image from "next/image";

interface GameOverModalProps {
  isOpen: boolean;
  levelName: string;
  onRestart: () => void;
  onSecondChance: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  levelName,
  onRestart,
  onSecondChance,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm transition-opacity">
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-[2.2rem] bg-white p-6 text-center shadow-2xl ring-1 ring-[#eaded8] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-[#fff0ed] shadow-sm">
          <Image
            src="/assets/cat.webp"
            alt="Game Over Cat"
            width={88}
            height={88}
            priority
            className="h-20 w-20 object-contain grayscale opacity-80 drop-shadow"
          />
        </div>

        <span className="mt-4 inline-block rounded-full bg-[#fde8e4] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#d94f38]">
          Out of Lives!
        </span>

        <h2 className="mt-2 text-2xl font-black text-[#3d302c]">Game Over</h2>

        <p className="mt-3 text-sm font-semibold text-[#8b746d] leading-relaxed">
          You made 3 mistakes on <span className="font-bold text-[#3d302c]">{levelName}</span>.
          Cats cannot share rows, columns, color regions, or touch diagonally!
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onRestart}
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#3d302c] text-sm font-black uppercase tracking-wide text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#57443e]"
          >
            Restart Level 🔄
          </button>
          <button
            type="button"
            onClick={onSecondChance}
            className="flex h-11 w-full items-center justify-center rounded-2xl bg-[#f8f6ef] text-xs font-black uppercase tracking-wide text-[#6f5651] ring-1 ring-[#eaded8] transition hover:bg-[#f0dfd8]"
          >
            +1 Extra Life & Keep Playing ❤️
          </button>
        </div>
      </div>
    </div>
  );
};
