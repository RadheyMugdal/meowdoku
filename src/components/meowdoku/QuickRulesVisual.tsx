"use client";

import React, { useState } from "react";
import Image from "next/image";

type RuleType = "neighbors" | "rowcol" | "region" | "controls";

interface RuleDef {
  id: RuleType;
  shortLabel: string;
  badge: string;
  title: string;
  description: string;
}

const RULES: RuleDef[] = [
  {
    id: "neighbors",
    shortLabel: "No Touch",
    badge: "🚫",
    title: "No Cats Touching",
    description: "Cats cannot touch even diagonally! All 8 surrounding cells are blocked.",
  },
  {
    id: "rowcol",
    shortLabel: "Row & Col",
    badge: "📏",
    title: "1 Per Row & Column",
    description: "Every horizontal row and vertical column can contain only 1 cat.",
  },
  {
    id: "region",
    shortLabel: "Color",
    badge: "🎨",
    title: "1 Per Color Region",
    description: "Each color territory must have exactly 1 cat. No duplicates!",
  },
  {
    id: "controls",
    shortLabel: "Controls",
    badge: "👆",
    title: "Tap Controls",
    description: "Tap once to mark ✕. Tap a marked cell again to deselect. Double-click (or right-click) to place 🐱.",
  },
];

export const QuickRulesVisual: React.FC<{ onOpenFullRules?: () => void }> = ({
  onOpenFullRules,
}) => {
  const [activeRule, setActiveRule] = useState<RuleType>("neighbors");

  const current = RULES.find((r) => r.id === activeRule) ?? RULES[0];

  return (
    <div className="rounded-[1.4rem] bg-[#fffaf8] p-3 shadow-sm ring-1 ring-[#f4dfdc] transition-all">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#342421]">
          Visual Rules
        </span>
        {onOpenFullRules && (
          <button
            type="button"
            onClick={onOpenFullRules}
            className="text-[10px] font-bold text-[#b25e4d] hover:underline"
          >
            Tutorial →
          </button>
        )}
      </div>

      {/* Mini Visual Diagram Stage */}
      <div className="relative flex flex-col items-center justify-center rounded-2xl bg-white p-2.5 shadow-inner ring-1 ring-[#eaded8]/60">
        {activeRule === "neighbors" && (
          <div className="flex flex-col items-center">
            {/* 3x3 Mini Grid showing diagonal block */}
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-[#fdf5f3] p-1.5 ring-1 ring-[#f4dfdc]">
              {/* Row 1 */}
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ffe8e6] text-xs font-black text-[#d64545]">
                ✕
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ffe8e6] text-xs font-black text-[#d64545]">
                ✕
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ffe8e6] text-xs font-black text-[#d64545]">
                ✕
              </div>
              {/* Row 2 */}
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ffe8e6] text-xs font-black text-[#d64545]">
                ✕
              </div>
              <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-[#eef8eb] shadow-sm ring-2 ring-[#559c68]">
                <Image
                  src="/assets/cat.webp"
                  alt="Cat"
                  width={20}
                  height={20}
                  className="h-5 w-5 object-contain"
                />
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ffe8e6] text-xs font-black text-[#d64545]">
                ✕
              </div>
              {/* Row 3 */}
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ffe8e6] text-xs font-black text-[#d64545]">
                ✕
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ffe8e6] text-xs font-black text-[#d64545]">
                ✕
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ffe8e6] text-xs font-black text-[#d64545]">
                ✕
              </div>
            </div>
            <span className="mt-1.5 text-[10px] font-black text-[#d64545]">
              🚫 8 surrounding cells blocked
            </span>
          </div>
        )}

        {activeRule === "rowcol" && (
          <div className="flex flex-col items-center">
            {/* Row & Col demonstration */}
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-[#f8f6ef] p-1.5 ring-1 ring-[#eaded8]">
              {/* Row 1 with 1 cat */}
              <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-[#eef8eb] shadow-sm ring-1 ring-[#559c68]">
                <Image
                  src="/assets/cat.webp"
                  alt="Cat"
                  width={20}
                  height={20}
                  className="h-5 w-5 object-contain"
                />
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-[#8b746d]">
                ✕
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-[#8b746d]">
                ✕
              </div>

              {/* Row 2 */}
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-[#8b746d]">
                ✕
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-[#8b746d]">
                ✕
              </div>
              <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-[#eef8eb] shadow-sm ring-1 ring-[#559c68]">
                <Image
                  src="/assets/cat.webp"
                  alt="Cat"
                  width={20}
                  height={20}
                  className="h-5 w-5 object-contain"
                />
              </div>

              {/* Row 3 */}
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-[#8b746d]">
                ✕
              </div>
              <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-[#eef8eb] shadow-sm ring-1 ring-[#559c68]">
                <Image
                  src="/assets/cat.webp"
                  alt="Cat"
                  width={20}
                  height={20}
                  className="h-5 w-5 object-contain"
                />
              </div>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-[#8b746d]">
                ✕
              </div>
            </div>
            <span className="mt-1.5 text-[10px] font-black text-[#559c68]">
              ✓ Exactly 1 cat per row & col
            </span>
          </div>
        )}

        {activeRule === "region" && (
          <div className="flex flex-col items-center">
            {/* Color Regions demonstration */}
            <div className="flex items-center gap-2">
              {/* Teal territory */}
              <div className="flex flex-col items-center rounded-xl bg-[#67c5bf]/25 p-1.5 ring-1 ring-[#67c5bf]">
                <div className="flex gap-1">
                  <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-[#67c5bf] shadow-sm">
                    <Image
                      src="/assets/cat.webp"
                      alt="Cat"
                      width={20}
                      height={20}
                      className="h-5 w-5 object-contain"
                    />
                  </div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#67c5bf]/40 text-xs font-black text-[#266360]">
                    ✕
                  </div>
                </div>
                <span className="mt-1 text-[9px] font-black text-[#266360]">Teal Region (1)</span>
              </div>

              {/* Pink territory */}
              <div className="flex flex-col items-center rounded-xl bg-[#dd84cb]/25 p-1.5 ring-1 ring-[#dd84cb]">
                <div className="flex gap-1">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#dd84cb]/40 text-xs font-black text-[#753468]">
                    ✕
                  </div>
                  <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-[#dd84cb] shadow-sm">
                    <Image
                      src="/assets/cat.webp"
                      alt="Cat"
                      width={20}
                      height={20}
                      className="h-5 w-5 object-contain"
                    />
                  </div>
                </div>
                <span className="mt-1 text-[9px] font-black text-[#753468]">Pink Region (1)</span>
              </div>
            </div>
            <span className="mt-1.5 text-[10px] font-black text-[#559c68]">
              ✓ 1 cat per colored zone
            </span>
          </div>
        )}

        {activeRule === "controls" && (
          <div className="flex flex-col items-center">
            {/* Tap Sequence: Empty -> X -> Clear */}
            <div className="flex items-center gap-1.5">
              {/* Step 1: Empty */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f8f6ef] ring-1 ring-[#eaded8]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#eaded8]" />
                </div>
                <span className="text-[9px] font-bold text-[#8b746d]">Empty</span>
              </div>

              <span className="text-[10px] font-black text-[#8b746d]">➔</span>

              {/* Step 2: X */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#67c5bf] shadow-sm ring-1 ring-white">
                  <span className="text-xs font-black text-white">✕</span>
                </div>
                <span className="text-[9px] font-bold text-[#8b746d]">Tap 1: ✕</span>
              </div>

              <span className="text-[10px] font-black text-[#8b746d]">➔</span>

              {/* Step 3: Deselect */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f8f6ef] ring-1 ring-[#eaded8]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#eaded8]" />
                </div>
                <span className="text-[9px] font-bold text-[#559c68]">Tap 2: Clear</span>
              </div>
            </div>
            <span className="mt-1.5 text-[10px] font-black text-[#6f5651]">
              Double-tap or right-click to place 🐱
            </span>
          </div>
        )}
      </div>

      {/* Description text */}
      <p className="mt-2 text-[11px] leading-tight text-[#6f5651]">
        <strong className="text-[#342421]">{current.title}:</strong> {current.description}
      </p>

      {/* 4 Interactive Switcher Tabs */}
      <div className="mt-2.5 grid grid-cols-2 gap-1.5">
        {RULES.map((rule) => {
          const isActive = rule.id === activeRule;
          return (
            <button
              key={rule.id}
              type="button"
              onClick={() => setActiveRule(rule.id)}
              className={`flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-left text-[11px] font-black transition-all ${
                isActive
                  ? "bg-[#3d302c] text-white shadow-sm ring-1 ring-[#3d302c] scale-[1.02]"
                  : "bg-white text-[#7a635c] ring-1 ring-[#eaded8]/80 hover:bg-[#fff4f0] hover:text-[#3d302c]"
              }`}
            >
              <span className="text-xs">{rule.badge}</span>
              <span className="truncate">{rule.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
