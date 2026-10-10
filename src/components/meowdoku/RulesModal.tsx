"use client";

import React, { useState } from "react";
import Image from "next/image";

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Slide {
  title: string;
  body: string;
  pattern: "click-x" | "click-cat" | "click-clear" | "row-column" | "color-region" | "neighbors" | "win";
}

const SLIDES: Slide[] = [
  {
    title: "1st click: mark X",
    body: "Click an empty cell to mark ✕. Click it again to deselect.",
    pattern: "click-x",
  },
  {
    title: "Double click: place cat",
    body: "Double-click (or right-click) any cell to place a cat 🐱.",
    pattern: "click-cat",
  },
  {
    title: "Deselect anytime",
    body: "Click any marked box or placed cat to clear it back to empty.",
    pattern: "click-clear",
  },
  {
    title: "One cat per row and column",
    body: "A row or column can contain only one cat.",
    pattern: "row-column",
  },
  {
    title: "One cat per color",
    body: "Each colored region can contain only one cat.",
    pattern: "color-region",
  },
  {
    title: "No cats around a cat",
    body: "The eight surrounding cells are blocked by that cat.",
    pattern: "neighbors",
  },
  {
    title: "How to win",
    body: "Place all cats so every row, column, and color has one, with no touching.",
    pattern: "win",
  },
];

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  const [slideIndex, setSlideIndex] = useState(0);

  if (!isOpen) return null;

  const currentSlide = SLIDES[slideIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-white p-6 shadow-2xl ring-1 ring-[#eaded8] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fbf1ec] text-sm font-black text-[#559c68]">
              {slideIndex + 1}/{SLIDES.length}
            </span>
            <h2 className="text-lg font-black text-[#3d302c]">Game Rules</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fbf1ec] text-lg font-bold text-[#7a635c] transition hover:bg-[#f0dfd8] hover:text-[#3d302c]"
          >
            ✕
          </button>
        </div>

        {/* Visual Illustration Area */}
        <div className="my-6 flex min-h-[190px] flex-col items-center justify-center rounded-2xl bg-[#f8f6ef] p-6 shadow-inner ring-1 ring-[#eaded8]/60">
          {currentSlide.pattern === "click-x" && (
            <div className="flex flex-col items-center gap-3">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[#67c5bf] shadow-md ring-2 ring-white">
                <span className="absolute inset-[24%] flex items-center justify-center">
                  <span className="absolute h-1.5 w-full rotate-45 rounded-full bg-white" />
                  <span className="absolute h-1.5 w-full -rotate-45 rounded-full bg-white" />
                </span>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#6f5651] shadow-sm">
                Click 1: Mark &apos;X&apos;
              </span>
            </div>
          )}

          {currentSlide.pattern === "click-cat" && (
            <div className="flex flex-col items-center gap-3">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[#67c5bf] shadow-md ring-2 ring-white">
                <Image
                  src="/assets/cat.webp"
                  alt="Cat"
                  width={64}
                  height={64}
                  className="h-16 w-16 object-contain drop-shadow"
                />
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#6f5651] shadow-sm">
                Double-Click / Right-Click: Place Cat 🐱
              </span>
            </div>
          )}

          {currentSlide.pattern === "click-clear" && (
            <div className="flex flex-col items-center gap-3">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-[#67c5bf] shadow-md ring-2 ring-white" />
              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#6f5651] shadow-sm">
                Click Again: Deselect & Clear
              </span>
            </div>
          )}

          {currentSlide.pattern === "row-column" && (
            <div className="grid grid-cols-3 gap-2">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-[#67c5bf]">
                <Image src="/assets/cat.webp" alt="Cat" width={40} height={40} className="h-10 w-10 object-contain" />
              </div>
              <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-[#67c5bf]">
                <span className="h-1 w-6 rounded-full bg-white/70 rotate-45" />
              </div>
              <div className="relative flex h-14 w-14 items-center justify-center rounded-xl bg-[#67c5bf]">
                <span className="h-1 w-6 rounded-full bg-white/70 rotate-45" />
              </div>
            </div>
          )}

          {currentSlide.pattern === "color-region" && (
            <div className="grid grid-cols-3 gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#DD84CB]">
                <Image src="/assets/cat.webp" alt="Cat" width={40} height={40} className="h-10 w-10 object-contain" />
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#DD84CB]">
                <span className="h-1 w-6 rounded-full bg-white/70 rotate-45" />
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#6CB6DC]">
                <Image src="/assets/cat.webp" alt="Cat" width={40} height={40} className="h-10 w-10 object-contain" />
              </div>
            </div>
          )}

          {currentSlide.pattern === "neighbors" && (
            <div className="grid grid-cols-3 gap-1.5">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className={`flex h-11 w-11 items-center justify-center rounded-lg ${
                    i === 4 ? "bg-[#67c5bf]" : "bg-[#f0dfd8]"
                  }`}
                >
                  {i === 4 ? (
                    <Image src="/assets/cat.webp" alt="Cat" width={32} height={32} className="h-8 w-8 object-contain" />
                  ) : (
                    <span className="text-xs font-bold text-[#b97950]">✕</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {currentSlide.pattern === "win" && (
            <div className="flex items-center gap-3">
              <span className="text-4xl">🏆</span>
              <div className="text-left">
                <p className="text-base font-black text-[#559c68]">Perfect Placement!</p>
                <p className="text-xs font-semibold text-[#8b746d]">1 Cat / Row • 1 Cat / Col • 1 Cat / Region</p>
              </div>
            </div>
          )}
        </div>

        {/* Text Area */}
        <div className="text-center">
          <h3 className="text-xl font-black text-[#3d302c]">{currentSlide.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#6f5651]">{currentSlide.body}</p>
        </div>

        {/* Slide navigation controls */}
        <div className="mt-6 flex items-center justify-between border-t border-[#f4dfdc] pt-4">
          <button
            type="button"
            disabled={slideIndex === 0}
            onClick={() => setSlideIndex((i) => i - 1)}
            className="rounded-full px-4 py-2 text-xs font-black uppercase text-[#8b746d] transition hover:bg-[#fbf1ec] disabled:opacity-30"
          >
            Previous
          </button>

          <div className="flex gap-1.5">
            {SLIDES.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === slideIndex ? "w-6 bg-[#3d302c]" : "w-2 bg-[#eaded8]"
                }`}
              />
            ))}
          </div>

          {slideIndex < SLIDES.length - 1 ? (
            <button
              type="button"
              onClick={() => setSlideIndex((i) => i + 1)}
              className="rounded-full bg-[#3d302c] px-5 py-2 text-xs font-black uppercase text-white shadow transition hover:bg-[#57443e]"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-[#559c68] px-5 py-2 text-xs font-black uppercase text-white shadow transition hover:bg-[#468257]"
            >
              Start Playing
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
