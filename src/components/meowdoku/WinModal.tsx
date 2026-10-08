"use client";

import React from "react";
import Image from "next/image";
import { formatTime } from "@/lib/meowdoku/game-logic";

interface WinModalProps {
  isOpen: boolean;
  levelName: string;
  elapsedMs: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onRestart: () => void;
  onClose: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({
  isOpen,
  levelName,
  elapsedMs,
  hasNextLevel,
  onNextLevel,
  onRestart,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm overflow-hidden rounded-[2.2rem] bg-white p-6 text-center shadow-2xl ring-1 ring-[#eaded8] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-[#fff4f0] shadow-sm">
          <Image
            src="/assets/cat.webp"
            alt="Winner Cat"
            width={88}
            height={88}
            priority
            className="h-20 w-20 object-contain drop-shadow"
          />
        </div>

        <span className="mt-4 inline-block rounded-full bg-[#eef8eb] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#487447]">
          Level Complete!
        </span>

        <h2 className="mt-2 text-2xl font-black text-[#3d302c]">{levelName} Solved</h2>

        <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#3d302c] px-6 py-2.5 text-white shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider opacity-80">Solved in</span>
          <span className="text-xl font-black">{formatTime(elapsedMs)}</span>
        </div>

        <p className="mt-4 text-xs font-bold text-[#8b746d]">
          Every row, column, and color region has one cat with no touching!
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          {hasNextLevel ? (
            <button
              type="button"
              onClick={onNextLevel}
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#559c68] text-sm font-black uppercase tracking-wide text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#478757]"
            >
              Next Level →
            </button>
          ) : (
            <div className="rounded-2xl bg-[#fbf1ec] p-3 text-xs font-black text-[#8b5e55]">
              🎉 You have completed all levels in this mode!
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onRestart}
              className="flex h-11 flex-1 items-center justify-center rounded-2xl bg-[#f8f6ef] text-xs font-black uppercase text-[#6f5651] ring-1 ring-[#eaded8] transition hover:bg-[#f0dfd8]"
            >
              Replay Level
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 flex-1 items-center justify-center rounded-2xl bg-[#f8f6ef] text-xs font-black uppercase text-[#6f5651] ring-1 ring-[#eaded8] transition hover:bg-[#f0dfd8]"
            >
              View Board
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
