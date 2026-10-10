"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import type { CellCoord, CellState, Level } from "@/lib/meowdoku/types";
import { cellKey, isFixedCat, DEFAULT_THEME_PALETTE } from "@/lib/meowdoku/game-logic";

interface BoardProps {
  level: Level;
  board: CellState[][];
  conflicts: Set<string>;
  hintCell: CellCoord | null;
  isComplete: boolean;
  dragPreview: Set<string>;
  onCellClick: (row: number, col: number) => void;
  onCellDoubleClick: (row: number, col: number) => void;
  onDragMark: (path: CellCoord[]) => void;
  onDragPreviewChange: (preview: Set<string>) => void;
}

const CONFETTI_COLORS = ["#55bbb8", "#f493dd", "#b4dda1", "#e8ca77", "#9278d9", "#f09a74", "#6cb6dc"];

export const Board: React.FC<BoardProps> = ({
  level,
  board,
  conflicts,
  hintCell,
  isComplete,
  dragPreview,
  onCellClick,
  onCellDoubleClick,
  onDragMark,
  onDragPreviewChange,
}) => {
  const dragRef = useRef<{
    pointerId: number;
    startCell: CellCoord;
    startX: number;
    startY: number;
    hasDragged: boolean;
    path: CellCoord[];
  } | null>(null);
  const didDragRef = useRef(false);
  const lastClickRef = useRef<{
    row: number;
    col: number;
    time: number;
    initialState: CellState;
  } | null>(null);

  function getCellFromElement(el: Element | null): CellCoord | null {
    const target = el?.closest("[data-meowdoku-cell]");
    if (!(target instanceof HTMLElement)) return null;
    const r = Number(target.dataset.row);
    const c = Number(target.dataset.col);
    if (Number.isInteger(r) && Number.isInteger(c)) {
      return { row: r, col: c };
    }
    return null;
  }

  function canMarkCell(row: number, col: number): boolean {
    return !isFixedCat(level, row, col) && board[row][col] !== "cat";
  }

  const finishPointer = (pointerId: number) => {
    const current = dragRef.current;
    if (!current || current.pointerId !== pointerId) return;

    const { hasDragged, path, startCell } = current;
    dragRef.current = null;
    onDragPreviewChange(new Set());

    if (hasDragged && path.length > 1) {
      lastClickRef.current = null;
      didDragRef.current = true;
      setTimeout(() => {
        didDragRef.current = false;
      }, 80);
      onDragMark(path);
    } else if (!hasDragged) {
      if (!isFixedCat(level, startCell.row, startCell.col)) {
        const now = Date.now();
        const last = lastClickRef.current;
        const isDouble =
          last !== null &&
          last.row === startCell.row &&
          last.col === startCell.col &&
          now - last.time < 350;

        if (isDouble) {
          lastClickRef.current = null;
          if (last.initialState === "cat") {
            // Already had a cat and double-clicked: it was deselected by click 1, keep it deselected
          } else {
            // Double-click places cat!
            onCellDoubleClick(startCell.row, startCell.col);
          }
        } else {
          lastClickRef.current = {
            row: startCell.row,
            col: startCell.col,
            time: now,
            initialState: board[startCell.row][startCell.col],
          };
          onCellClick(startCell.row, startCell.col);
        }
      }
    }
  };

  function handlePointerDown(e: React.PointerEvent) {
    if ((e.pointerType === "mouse" && e.button !== 0) || isComplete) return;
    const cell = getCellFromElement(e.target as Element);
    if (!cell) return;
    if (isFixedCat(level, cell.row, cell.col)) return;

    dragRef.current = {
      pointerId: e.pointerId,
      startCell: cell,
      startX: e.clientX,
      startY: e.clientY,
      hasDragged: false,
      path: [cell],
    };
  }

  function handlePointerMove(e: React.PointerEvent) {
    const current = dragRef.current;
    if (!current || current.pointerId !== e.pointerId) return;

    // Safety check: if mouse button was released outside, buttons is 0
    if (e.pointerType === "mouse" && e.buttons === 0) {
      finishPointer(e.pointerId);
      return;
    }

    const dist = Math.hypot(e.clientX - current.startX, e.clientY - current.startY);
    const element = document.elementFromPoint(e.clientX, e.clientY);
    const cell = getCellFromElement(element);

    // If moved more than 6px or entered a different cell -> this is a drag!
    if (
      !current.hasDragged &&
      (dist > 6 || (cell && (cell.row !== current.startCell.row || cell.col !== current.startCell.col)))
    ) {
      current.hasDragged = true;
      if (canMarkCell(current.startCell.row, current.startCell.col)) {
        onDragPreviewChange(new Set([cellKey(current.startCell.row, current.startCell.col)]));
      }
    }

    if (!current.hasDragged) return;

    // We are actively dragging
    if (!cell) return; // Cursor moved outside cell bounds
    if (!canMarkCell(cell.row, cell.col)) return;

    const key = cellKey(cell.row, cell.col);
    if (!current.path.some((p) => cellKey(p.row, p.col) === key)) {
      current.path.push(cell);
      onDragPreviewChange(new Set(current.path.map((p) => cellKey(p.row, p.col))));
    }
  }

  function handlePointerUp(e: React.PointerEvent) {
    finishPointer(e.pointerId);
  }

  function handlePointerCancel(e: React.PointerEvent) {
    if (dragRef.current?.pointerId === e.pointerId) {
      dragRef.current = null;
      onDragPreviewChange(new Set());
    }
  }

  const finishPointerRef = useRef(finishPointer);
  finishPointerRef.current = finishPointer;

  // Global window safety listeners: ensure releasing hold outside or window blur never leaves drag active
  useEffect(() => {
    function handleGlobalPointerUp(e: PointerEvent) {
      if (dragRef.current && dragRef.current.pointerId === e.pointerId) {
        finishPointerRef.current(e.pointerId);
      }
    }
    function handleGlobalPointerCancel(e: PointerEvent) {
      if (dragRef.current && dragRef.current.pointerId === e.pointerId) {
        dragRef.current = null;
        onDragPreviewChange(new Set());
      }
    }

    window.addEventListener("pointerup", handleGlobalPointerUp);
    window.addEventListener("pointercancel", handleGlobalPointerCancel);
    return () => {
      window.removeEventListener("pointerup", handleGlobalPointerUp);
      window.removeEventListener("pointercancel", handleGlobalPointerCancel);
    };
  }, []);

  return (
    <div
      className="relative mx-auto w-fit select-none overflow-hidden rounded-[1.4rem] bg-white p-2.5 shadow-[0_8px_20px_rgba(78,64,55,0.08)] ring-1 ring-[#eaded8] sm:rounded-[1.6rem] sm:p-4"
    >
      <div
        className="mx-auto grid w-full touch-none select-none"
        style={{
          gridTemplateColumns: `repeat(${level.size}, minmax(0, 1fr))`,
          gap: level.size >= 9 ? "clamp(0.18rem, 0.45vw, 0.35rem)" : "clamp(0.24rem, 0.7vw, 0.48rem)",
          width: "min(calc(100vw - 2.5rem), 460px, calc(100svh - 16.5rem))",
          height: "min(calc(100vw - 2.5rem), 460px, calc(100svh - 16.5rem))",
        }}
        data-testid="meowdoku-board"
        onContextMenu={(e) => e.preventDefault()}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {board.map((row, r) => {
          if (r >= level.size) return null;
          return row.map((cellState, c) => {
            if (c >= level.size) return null;
            const key = cellKey(r, c);
            const isLocked = isFixedCat(level, r, c);
            const hasConflict = conflicts.has(key);
            const isHint = hintCell?.row === r && hintCell?.col === c;
            const regionLetter = level.regions[r]?.[c] ?? "A";
            const bgColor = DEFAULT_THEME_PALETTE[regionLetter] ?? level.regionColors[regionLetter] ?? "#f4d6ce";

            // If drag is previewing over this cell and it's not a cat, preview "x"
            const effectiveState = dragPreview.has(key) && cellState !== "cat" ? "x" : cellState;

            return (
              <button
                key={key}
                type="button"
                data-meowdoku-cell="true"
                data-row={r}
                data-col={c}
                aria-label={`row ${r + 1}, column ${c + 1}, region ${regionLetter}, ${effectiveState}`}
                onContextMenu={(e) => {
                  e.preventDefault();
                  if (!isLocked && !isComplete) onCellDoubleClick(r, c);
                }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (!isLocked) onCellClick(r, c);
                  } else if (e.key === "c" || e.key === "C") {
                    e.preventDefault();
                    if (!isLocked && !isComplete) onCellDoubleClick(r, c);
                  } else if (e.key === "Backspace" || e.key === "Delete") {
                    e.preventDefault();
                    if (!isLocked && board[r][c] !== "empty") onCellClick(r, c);
                  }
                }}
                className={`relative aspect-square min-h-0 overflow-hidden border border-white/90 text-[#3d302c] shadow-[0_1px_2px_rgba(87,67,58,0.14)] transition duration-150 sm:border-2 ${
                  isLocked ? "cursor-not-allowed" : "hover:-translate-y-0.5 hover:brightness-[1.04] active:scale-95"
                } ${isHint ? "z-10 ring-[3px] ring-[#f5dc4d] ring-inset" : ""}`}
                style={{
                  backgroundColor: bgColor,
                  borderRadius: level.size >= 9 ? "clamp(0.45rem, 1vw, 0.65rem)" : "clamp(0.6rem, 1.35vw, 0.95rem)",
                  touchAction: "none",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {/* Cat piece */}
                {effectiveState === "cat" && (
                  <span
                    className={`absolute inset-[7%] flex items-center justify-center rounded-[inherit] ${
                      isLocked ? "bg-white/22 ring-2 ring-white/65" : ""
                    }`}
                  >
                    <Image
                      src="/assets/cat.webp"
                      alt=""
                      width={160}
                      height={160}
                      priority
                      className="h-full w-full object-contain drop-shadow-[0_8px_8px_rgba(67,49,44,0.18)]"
                    />

                    {/* Conflict Indicator: Red ring with slash */}
                    {hasConflict && (
                      <span
                        aria-hidden="true"
                        className="absolute inset-[3%] rounded-full border-[clamp(0.22rem,0.7vw,0.44rem)] border-[#f26a43] bg-[#ffb18f]/10 shadow-[0_3px_8px_rgba(133,55,37,0.22)]"
                      >
                        <span className="absolute left-1/2 top-1/2 h-[clamp(0.28rem,0.8vw,0.48rem)] w-[112%] -translate-x-1/2 -translate-y-1/2 -rotate-45 rounded-full bg-[#f26a43] shadow-[0_1px_3px_rgba(90,38,29,0.32)] ring-1 ring-[#a93e27]/20" />
                      </span>
                    )}
                  </span>
                )}

                {/* X marker */}
                {effectiveState === "x" && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-[29%] flex items-center justify-center drop-shadow-[0_2px_3px_rgba(92,61,44,0.18)]"
                  >
                    <span className="absolute h-[clamp(0.22rem,0.8vw,0.42rem)] w-full rotate-45 rounded-full bg-white" />
                    <span className="absolute h-[clamp(0.22rem,0.8vw,0.42rem)] w-full -rotate-45 rounded-full bg-white" />
                  </span>
                )}
              </button>
            );
          });
        })}
      </div>

      {/* Confetti celebration particles */}
      {isComplete && (
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
          {Array.from({ length: 28 }).map((_, idx) => (
            <span
              key={idx}
              className="meowdoku-confetti absolute top-[-1rem] h-3 w-2 rounded-full"
              style={{
                left: `${6 + (idx * 17) % 88}%`,
                animationDelay: `${(idx % 7) * 0.15}s`,
                backgroundColor: CONFETTI_COLORS[idx % CONFETTI_COLORS.length],
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
