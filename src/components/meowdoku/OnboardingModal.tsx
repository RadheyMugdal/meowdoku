"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { Difficulty } from "@/lib/meowdoku/types";

interface OnboardingModalProps {
  isOpen: boolean;
  initialDifficulty: Difficulty;
  onStartGame: (chosenDifficulty: Difficulty) => void;
  onClose: () => void;
}

interface DifficultyOption {
  id: Difficulty;
  name: string;
  size: string;
  badge: string;
  levelCount: number;
  description: string;
  hasFixedCat: boolean;
}

const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  {
    id: "normal",
    name: "Normal Mode",
    size: "6x6 Grid",
    badge: "Recommended",
    levelCount: 50,
    description: "Includes a locked starter cat to guide your first deductions.",
    hasFixedCat: true,
  },
  {
    id: "hard",
    name: "Hard Mode",
    size: "8x8 Grid",
    badge: "Popular",
    levelCount: 105,
    description: "Pure deductive challenge. No starter cat provided.",
    hasFixedCat: false,
  },
  {
    id: "ultra",
    name: "Ultra Mode",
    size: "9x9 Grid",
    badge: "Expert",
    levelCount: 116,
    description: "Grand master boards for seasoned logic puzzle pros.",
    hasFixedCat: false,
  },
];

const TOTAL_STEPS = 5;

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  initialDifficulty,
  onStartGame,
  onClose,
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(initialDifficulty);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      onStartGame(selectedDifficulty);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-2.5 backdrop-blur-sm transition-opacity sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-y-auto rounded-[1.6rem] bg-white p-4 shadow-2xl ring-1 ring-[#eaded8] sm:rounded-[2.2rem] sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header: Step Counter & Progress Indicator */}
        <div className="flex items-center justify-between border-b border-[#f4dfdc] pb-2.5 sm:pb-3 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full bg-[#fbf1ec] text-[11px] sm:text-xs font-black text-[#559c68]">
              {step}/{TOTAL_STEPS}
            </span>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#8b746d] truncate">
              {step === 1 && "Welcome"}
              {step === 2 && "Rule 1: Lines & Colors"}
              {step === 3 && "Rule 2: Personal Space"}
              {step === 4 && "Controls & Lives"}
              {step === 5 && "Choose Difficulty"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Skip onboarding"
            className="rounded-full bg-[#fbf1ec] px-2.5 py-1 text-[11px] sm:text-xs font-bold text-[#7a635c] transition hover:bg-[#f0dfd8] hover:text-[#3d302c] shrink-0"
          >
            Skip ✕
          </button>
        </div>

        {/* Animated Step Progress Bar */}
        <div className="mt-3 flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i + 1 <= step ? "bg-[#559c68]" : "bg-[#f0e6e2]"
              }`}
            />
          ))}
        </div>

        {/* Step Body Content */}
        <div className="my-5 min-h-[310px] flex flex-col justify-center">
          {/* STEP 1: Welcome */}
          {step === 1 && (
            <div className="flex flex-col items-center text-center animate-in fade-in duration-300">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-[#fff4f0] shadow-sm ring-1 ring-[#f4dfdc]">
                <Image
                  src="/assets/cat.webp"
                  alt="Meowdoku Cat"
                  width={84}
                  height={84}
                  priority
                  className="h-20 w-20 object-contain drop-shadow"
                />
              </div>

              <h3 className="mt-4 text-2xl font-black text-[#3d302c] sm:text-3xl">
                Welcome to Meowdoku! 🐾
              </h3>
              <p className="mt-2 text-xs font-bold leading-relaxed text-[#8b746d] sm:text-sm">
                A peaceful yet brain-teasing cat puzzle. Your objective is to place happy cats on the grid using pure logic and deduction.
              </p>

              <div className="mt-4 rounded-2xl bg-[#f8f6ef] p-3 text-xs font-semibold text-[#6f5651] ring-1 ring-[#eaded8]/60">
                ✨ <strong>Zero guessing required.</strong> Every puzzle has one unique logical solution. Let&apos;s take a quick 30-second tour!
              </div>

              <a
                href="https://github.com/RadheyMugdal"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#f4dfdc] bg-[#fffaf8] px-3 py-1 text-xs font-bold text-[#8b746d] transition hover:border-[#f3a89e] hover:text-[#3d302c]"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>Created by @RadheyMugdal on GitHub</span>
              </a>
            </div>
          )}

          {/* STEP 2: One Cat Per Line & Color */}
          {step === 2 && (
            <div className="flex flex-col items-center text-center animate-in fade-in duration-300">
              {/* Visual Demo of Row, Col & Color */}
              <div className="flex items-center gap-3">
                {/* Row/Col mini demo */}
                <div className="flex flex-col items-center rounded-2xl bg-[#f8f6ef] p-2 ring-1 ring-[#eaded8]">
                  <span className="mb-1 text-[10px] font-black uppercase text-[#8b746d]">1 Per Line</span>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eef8eb] ring-1 ring-[#559c68]">
                      <Image src="/assets/cat.webp" alt="Cat" width={20} height={20} className="h-5 w-5 object-contain" />
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-[#8b746d]">✕</div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-[#8b746d]">✕</div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-[#8b746d]">✕</div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-[#8b746d]">✕</div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eef8eb] ring-1 ring-[#559c68]">
                      <Image src="/assets/cat.webp" alt="Cat" width={20} height={20} className="h-5 w-5 object-contain" />
                    </div>
                  </div>
                </div>

                {/* Color Zone mini demo */}
                <div className="flex flex-col items-center rounded-2xl bg-[#67c5bf]/20 p-2 ring-1 ring-[#67c5bf]">
                  <span className="mb-1 text-[10px] font-black uppercase text-[#266360]">1 Per Color</span>
                  <div className="flex gap-1">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#67c5bf] shadow-sm">
                      <Image src="/assets/cat.webp" alt="Cat" width={20} height={20} className="h-5 w-5 object-contain" />
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#67c5bf]/40 text-xs font-black text-[#266360]">✕</div>
                  </div>
                  <span className="mt-1 text-[9px] font-black text-[#266360]">Zone Solved ✓</span>
                </div>
              </div>

              <h3 className="mt-4 text-xl font-black text-[#3d302c]">
                One Cat Per Row, Col & Color 📏🎨
              </h3>
              <p className="mt-1.5 text-xs font-bold leading-relaxed text-[#8b746d] sm:text-sm">
                Each horizontal row, vertical column, and colored territory must contain <strong>exactly one cat</strong>. If a row or color already has a cat, no more cats can be placed there!
              </p>
            </div>
          )}

          {/* STEP 3: No Touching (Even Diagonally) */}
          {step === 3 && (
            <div className="flex flex-col items-center text-center animate-in fade-in duration-300">
              {/* 3x3 Mini Grid showing diagonal block */}
              <div className="grid grid-cols-3 gap-1 rounded-2xl bg-[#fdf5f3] p-2 ring-1 ring-[#f4dfdc]">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ffe8e6] text-xs font-black text-[#d64545]">✕</div>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ffe8e6] text-xs font-black text-[#d64545]">✕</div>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ffe8e6] text-xs font-black text-[#d64545]">✕</div>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ffe8e6] text-xs font-black text-[#d64545]">✕</div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-[#eef8eb] shadow-md ring-2 ring-[#559c68]">
                  <Image src="/assets/cat.webp" alt="Cat" width={24} height={24} className="h-6 w-6 object-contain" />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ffe8e6] text-xs font-black text-[#d64545]">✕</div>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ffe8e6] text-xs font-black text-[#d64545]">✕</div>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ffe8e6] text-xs font-black text-[#d64545]">✕</div>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ffe8e6] text-xs font-black text-[#d64545]">✕</div>
              </div>

              <h3 className="mt-4 text-xl font-black text-[#3d302c]">
                Cats Need Personal Space! 🚫
              </h3>
              <p className="mt-1.5 text-xs font-bold leading-relaxed text-[#8b746d] sm:text-sm">
                Cats cannot touch each other horizontally, vertically, or <strong>diagonally</strong>.
              </p>
              <span className="mt-2 inline-block rounded-full bg-[#ffe8e6] px-3 py-1 text-[11px] font-black text-[#d64545]">
                All 8 surrounding squares around a cat are blocked!
              </span>
            </div>
          )}

          {/* STEP 4: Controls & 3 Lives */}
          {step === 4 && (
            <div className="flex flex-col items-center text-center animate-in fade-in duration-300">
              {/* Tap Sequence */}
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f8f6ef] ring-1 ring-[#eaded8]">
                    <span className="h-2 w-2 rounded-full bg-[#eaded8]" />
                  </div>
                  <span className="text-[10px] font-bold text-[#8b746d]">Empty</span>
                </div>
                <span className="font-black text-[#8b746d]">➔</span>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#67c5bf] shadow-sm">
                    <span className="text-sm font-black text-white">✕</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#3d302c]">Tap 1: ✕</span>
                </div>
                <span className="font-black text-[#8b746d]">➔</span>
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f8f6ef] ring-1 ring-[#eaded8]">
                    <span className="h-2 w-2 rounded-full bg-[#eaded8]" />
                  </div>
                  <span className="text-[10px] font-bold text-[#559c68]">Tap 2: Clear</span>
                </div>
              </div>

              <h3 className="mt-4 text-xl font-black text-[#3d302c]">
                Controls & 3 Lives ❤️👆
              </h3>

              <div className="mt-2 w-full rounded-2xl bg-[#f8f6ef] p-3 text-left text-xs text-[#6f5651] ring-1 ring-[#eaded8]/60 space-y-1.5">
                <p>
                  • <strong>Single Tap:</strong> Tap to mark <em>✕</em>, or tap a marked box again to <em>Deselect</em>.
                </p>
                <p>
                  • <strong>Double-Tap / Right-Click:</strong> Place or remove a cat 🐱 on any cell.
                </p>
                <p>
                  • <strong>Hold & Drag:</strong> Click and drag your cursor over multiple squares to quickly mark them with ✕!
                </p>
                <p className="font-black text-[#d64545]">
                  • ❤️ <strong>3 Lives Limit:</strong> Placing an invalid cat deducts 1 life. Avoid placing conflicting cats!
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: Choose Difficulty */}
          {step === 5 && (
            <div className="flex flex-col animate-in fade-in duration-300">
              <div className="text-center">
                <h3 className="text-xl font-black text-[#3d302c] sm:text-2xl">
                  Choose Starting Difficulty 🗺️
                </h3>
                <p className="mt-1 text-xs font-bold text-[#8b746d]">
                  Pick your difficulty level. You can switch modes anytime!
                </p>
              </div>

              <div className="mt-3.5 space-y-2">
                {DIFFICULTY_OPTIONS.map((opt) => {
                  const isSelected = selectedDifficulty === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedDifficulty(opt.id)}
                      className={`flex w-full items-center justify-between rounded-2xl p-3 text-left transition-all ${
                        isSelected
                          ? "bg-[#3d302c] text-white shadow-md ring-2 ring-[#3d302c] scale-[1.01]"
                          : "bg-[#fbf1ec]/70 text-[#3d302c] ring-1 ring-[#eaded8] hover:bg-[#fff0e6]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-black ${
                            isSelected
                              ? "border-white bg-[#559c68] text-white"
                              : "border-[#b8a7a0] bg-white text-transparent"
                          }`}
                        >
                          ✓
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm">{opt.name}</span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                                isSelected
                                  ? "bg-white/20 text-white"
                                  : "bg-[#eef8eb] text-[#487447]"
                              }`}
                            >
                              {opt.badge}
                            </span>
                          </div>
                          <p className={`text-[11px] ${isSelected ? "text-white/80" : "text-[#7a635c]"}`}>
                            {opt.description}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="block font-black text-xs">{opt.size}</span>
                        <span className={`text-[10px] ${isSelected ? "text-white/70" : "text-[#8b746d]"}`}>
                          {opt.levelCount} Levels
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between border-t border-[#f4dfdc] pt-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex h-11 items-center justify-center rounded-2xl bg-[#f8f6ef] px-5 text-xs font-black uppercase text-[#6f5651] ring-1 ring-[#eaded8] transition hover:bg-[#f0dfd8]"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="flex h-11 items-center justify-center rounded-2xl bg-[#559c68] px-6 text-xs font-black uppercase tracking-wider text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#478757]"
          >
            {step < TOTAL_STEPS ? "Next Step →" : "Start Journey! 🐾"}
          </button>
        </div>
      </div>
    </div>
  );
};
