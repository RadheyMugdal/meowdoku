"use client";

import { MeowdokuGame } from "@/components/meowdoku/MeowdokuGame";
import Image from "next/image";

export default function Home() {

  return (
    <div className="flex-1 bg-[#f8f6ef]">
      {/* Main Interactive Game Area */}
      <main className="py-2">
        <MeowdokuGame />

        {/* Informational & Rules Section */}
        <section className="mx-auto max-w-4xl border-t border-[#f4dfdc] px-4 py-12 sm:px-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-[#eaded8] sm:p-8">
            <h2 className="text-2xl font-black text-[#342421]">
              About Meowdoku
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#6f5651]">
              Meowdoku is a relaxing cat puzzle game that blends Sudoku-style deduction with Queens problem placement logic.
              Your goal is simple yet challenging: place exactly one cat in each row, column, and colored region, without allowing any two cats to touch each other, even diagonally!
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-[#fffaf8] p-4 ring-1 ring-[#f4dfdc]">
                <span className="text-xl">🐱</span>
                <h3 className="mt-2 text-sm font-black text-[#342421]">Row & Column Rule</h3>
                <p className="mt-1 text-xs text-[#8b746d]">
                  Each row and column can contain only one cat.
                </p>
              </div>

              <div className="rounded-2xl bg-[#fffaf8] p-4 ring-1 ring-[#f4dfdc]">
                <span className="text-xl">🎨</span>
                <h3 className="mt-2 text-sm font-black text-[#342421]">Color Regions</h3>
                <p className="mt-1 text-xs text-[#8b746d]">
                  Every distinct color territory must have exactly one cat.
                </p>
              </div>

              <div className="rounded-2xl bg-[#fffaf8] p-4 ring-1 ring-[#f4dfdc]">
                <span className="text-xl">🚫</span>
                <h3 className="mt-2 text-sm font-black text-[#342421]">No Touching</h3>
                <p className="mt-1 text-xs text-[#8b746d]">
                  Cats cannot touch orthogonally or diagonally in any direction.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
