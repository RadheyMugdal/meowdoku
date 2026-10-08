"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "./mode-toggle";
import { RulesModal } from "./meowdoku/RulesModal";

export default function Header() {
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[#f4dfdc] bg-white/92 backdrop-blur">
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
          {/* Logo & Title */}
          <Link
            href="/"
            aria-label="Meowdoku Guide home"
            className="flex items-center gap-2 sm:gap-3 transition hover:opacity-90 min-w-0"
          >
            <Image
              src="/assets/logo.webp"
              alt="Meowdoku cat puzzle logo"
              width={38}
              height={38}
              priority
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg shadow-sm shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <span className="block text-sm sm:text-base font-black leading-none text-[#342421] truncate">
                Meowdoku
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-[#9b726c] truncate">
                Cat Puzzle
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-2 md:flex">
            <Link
              href="/"
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold text-[#342421] bg-[#fff4f0]"
            >
              Home
            </Link>
            <button
              type="button"
              onClick={() => setIsRulesOpen(true)}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-bold text-[#6f5651] transition hover:bg-[#fff4f0] hover:text-[#342421]"
            >
              How to Play
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Mobile Rules Button */}
            <button
              type="button"
              onClick={() => setIsRulesOpen(true)}
              aria-label="How to play rules"
              title="How to Play"
              className="flex md:hidden h-8 w-8 items-center justify-center rounded-xl border border-[#eaded8] bg-[#fffaf8] text-xs font-black text-[#6f5651] transition hover:bg-[#fff0ec]"
            >
              ?
            </button>
            <ModeToggle />
          </div>
        </div>
      </header>

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </>
  );
}
