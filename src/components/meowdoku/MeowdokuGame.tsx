"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { CellCoord, CellState, Difficulty } from "@/lib/meowdoku/types";
import {
  DIFFICULTY_LABELS,
  LEVELS,
  cloneBoard,
  createInitialBoard,
  findCats,
  findConflicts,
  getBoardStats,
  isBoardSolved,
  isFixedCat,
  loadSavedProgress,
  saveProgress,
  getSavedDifficulty,
  saveLastDifficulty,
  saveActiveBoard,
  loadActiveBoard,
  clearActiveBoard,
} from "@/lib/meowdoku/game-logic";
import { Board } from "./Board";
import { LevelSelector } from "./LevelSelector";
import { RulesModal } from "./RulesModal";
import { WinModal } from "./WinModal";
import { RegionTracker } from "./RegionTracker";
import { GameOverModal } from "./GameOverModal";
import { QuickRulesVisual } from "./QuickRulesVisual";
import { OnboardingModal } from "./OnboardingModal";

const MAX_LIVES = 3;

export const MeowdokuGame: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const levels = LEVELS[difficulty];
  const [levelIndex, setLevelIndex] = useState(0);

  const currentLevel = levels[levelIndex] ?? levels[0];

  // Lives state
  const [lives, setLives] = useState<number>(MAX_LIVES);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  // Board state
  const [board, setBoard] = useState<CellState[][]>(() => createInitialBoard(currentLevel));
  const [history, setHistory] = useState<CellState[][][]>([]);
  const [hintCell, setHintCell] = useState<CellCoord | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("Start from the locked cat.");

  // Modals & stats
  const [isLevelSelectorOpen, setIsLevelSelectorOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);
  const [dragPreview, setDragPreview] = useState<Set<string>>(new Set());

  // Timing
  const [startTime, setStartTime] = useState<number>(() => Date.now());
  const [elapsedMs, setElapsedMs] = useState<number>(0);

  // Persistence progress: Level 1 is unlocked by default; next level unlocks upon completing previous level
  const [completedLevelIds, setCompletedLevelIds] = useState<Set<number>>(new Set());
  const [unlockedCount, setUnlockedCount] = useState<number>(1);

  // Load progress, last difficulty, and check onboarding on initial mount
  useEffect(() => {
    // Check first-time onboarding
    try {
      const onboarded = window.localStorage.getItem("meowdoku_has_onboarded");
      if (!onboarded) {
        setIsOnboardingOpen(true);
      }
    } catch {}

    const savedDiff = getSavedDifficulty();
    const nextLevels = LEVELS[savedDiff];
    const saved = loadSavedProgress(savedDiff);
    let targetIdx = 0;
    let unlocked = 1;

    if (saved) {
      unlocked = Math.max(1, saved.unlockedLevelCount);
      const target = nextLevels.findIndex((l) => l.id === saved.currentLevelId);
      if (target >= 0 && target < unlocked) {
        targetIdx = target;
      }
      setCompletedLevelIds(new Set(saved.completedLevelIds));
      setUnlockedCount(unlocked);
    } else {
      setCompletedLevelIds(new Set());
      setUnlockedCount(1);
    }

    const targetLevel = nextLevels[targetIdx] ?? nextLevels[0];
    const savedBoard = loadActiveBoard(savedDiff, targetLevel);
    setDifficulty(savedDiff);
    setLevelIndex(targetIdx);
    setBoard(savedBoard ?? createInitialBoard(targetLevel));
    setHistory([]);
    setHintCell(null);
    setStartTime(Date.now());
    setStatusMessage(
      targetLevel.fixedCat
        ? "Start from the locked cat."
        : `${targetLevel.name} loaded. Place 1 cat per row, col & color.`
    );
  }, []);

  // Derived state
  const conflicts = useMemo(() => findConflicts(board, currentLevel), [board, currentLevel]);
  const stats = useMemo(() => getBoardStats(board, currentLevel), [board, currentLevel]);
  const isComplete = useMemo(() => isBoardSolved(board, currentLevel), [board, currentLevel]);

  // Handle Win Condition
  useEffect(() => {
    if (isComplete && !isWinModalOpen) {
      clearActiveBoard(difficulty, currentLevel.id);
      const finishTime = Date.now() - startTime;
      setElapsedMs(finishTime);
      const updated = saveProgress(difficulty, levelIndex, currentLevel.id);
      setCompletedLevelIds(new Set(updated.completedLevelIds));
      setUnlockedCount(updated.unlockedLevelCount);
      setStatusMessage("Level complete! 🎉");
      setIsWinModalOpen(true);
    }
  }, [isComplete]);

  // Switch Level (Strict sequential journey: only allowed if unlocked)
  const loadLevel = useCallback(
    (index: number) => {
      const nextIdx = Math.max(0, Math.min(index, levels.length - 1));
      if (nextIdx >= unlockedCount) return;
      const target = levels[nextIdx];
      const savedBoard = loadActiveBoard(difficulty, target);
      setLevelIndex(nextIdx);
      setBoard(savedBoard ?? createInitialBoard(target));
      setHistory([]);
      setHintCell(null);
      setIsWinModalOpen(false);
      setIsGameOver(false);
      setLives(MAX_LIVES);
      setStartTime(Date.now());
      setStatusMessage(
        target.fixedCat
          ? "Start from the locked cat."
          : `${target.name} loaded. No starter cat this time.`
      );
      saveProgress(difficulty, nextIdx);
    },
    [difficulty, levels, unlockedCount]
  );

  // Switch Difficulty synchronously to avoid mismatched board/level size render
  const handleDifficultyChange = (newDiff: Difficulty) => {
    if (newDiff === difficulty) return;
    saveLastDifficulty(newDiff);
    const nextLevels = LEVELS[newDiff];
    const saved = loadSavedProgress(newDiff);
    let targetIdx = 0;
    let unlocked = 1;

    if (saved) {
      unlocked = Math.max(1, saved.unlockedLevelCount);
      const foundIdx = nextLevels.findIndex((l) => l.id === saved.currentLevelId);
      if (foundIdx >= 0 && foundIdx < unlocked) targetIdx = foundIdx;
      setCompletedLevelIds(new Set(saved.completedLevelIds));
      setUnlockedCount(unlocked);
    } else {
      setCompletedLevelIds(new Set());
      setUnlockedCount(1);
    }

    const targetLevel = nextLevels[targetIdx];
    const savedBoard = loadActiveBoard(newDiff, targetLevel);
    setDifficulty(newDiff);
    setLevelIndex(targetIdx);
    setBoard(savedBoard ?? createInitialBoard(targetLevel));
    setHistory([]);
    setHintCell(null);
    setIsWinModalOpen(false);
    setIsGameOver(false);
    setLives(MAX_LIVES);
    setStartTime(Date.now());
    setStatusMessage(
      targetLevel.fixedCat
        ? "Start from the locked cat."
        : `${targetLevel.name} loaded. Place 1 cat per row, col & color.`
    );
  };

  const handleStartOnboarding = (chosenDiff: Difficulty) => {
    try {
      window.localStorage.setItem("meowdoku_has_onboarded", "true");
    } catch {}
    setIsOnboardingOpen(false);
    if (chosenDiff !== difficulty) {
      handleDifficultyChange(chosenDiff);
    }
  };

  const handleCloseOnboarding = () => {
    try {
      window.localStorage.setItem("meowdoku_has_onboarded", "true");
    } catch {}
    setIsOnboardingOpen(false);
  };

  // Single cell click cycle: Empty -> X -> Cat -> Empty
  const handleCellClick = (row: number, col: number) => {
    if (isComplete) {
      setStatusMessage("This level is complete. Choose next level to continue.");
      return;
    }
    if (isGameOver) {
      return;
    }
    if (isFixedCat(currentLevel, row, col)) {
      setStatusMessage("The starter cat is locked and cannot be moved.");
      return;
    }

    const currentCell = board[row][col];
    let nextCell: CellState = "empty";
    if (currentCell === "empty") nextCell = "x";
    else if (currentCell === "x") nextCell = "cat";
    else nextCell = "empty";

    // Validate placement against solution to enforce lives system
    if (nextCell === "cat") {
      const isSolutionCat = currentLevel.solution.some(
        (s) => s.row === row && s.col === col
      );
      if (!isSolutionCat) {
        const nextLives = Math.max(0, lives - 1);
        setLives(nextLives);
        if (nextLives <= 0) {
          setIsGameOver(true);
          setStatusMessage("Out of lives! That spot cannot have a cat.");
        } else {
          setStatusMessage(
            `Mistake! Cats cannot go there. (${nextLives} ${nextLives === 1 ? "life" : "lives"} remaining ❤️)`
          );
        }
      } else {
        const pos = `row ${row + 1}, column ${col + 1}`;
        setStatusMessage(`Placed a cat at ${pos}.`);
      }
    } else if (nextCell === "x") {
      const pos = `row ${row + 1}, column ${col + 1}`;
      setStatusMessage(`Marked ${pos} with X.`);
    } else {
      const pos = `row ${row + 1}, column ${col + 1}`;
      setStatusMessage(`Cleared ${pos}.`);
    }

    const newBoard = cloneBoard(board);
    newBoard[row][col] = nextCell;

    setHistory((prev) => [...prev, cloneBoard(board)]);
    setBoard(newBoard);
    saveActiveBoard(difficulty, currentLevel.id, newBoard);
    setHintCell(null);
  };

  // Drag bulk-mark empty cells as X using functional state updater
  const handleDragMark = useCallback(
    (path: CellCoord[]) => {
      if (isComplete || isGameOver) return;

      setBoard((prevBoard) => {
        const newBoard = cloneBoard(prevBoard);
        let markedCount = 0;

        for (const { row, col } of path) {
          if (!isFixedCat(currentLevel, row, col) && newBoard[row][col] === "empty") {
            newBoard[row][col] = "x";
            markedCount++;
          }
        }

        if (markedCount > 0) {
          setHistory((prev) => [...prev, cloneBoard(prevBoard)]);
          saveActiveBoard(difficulty, currentLevel.id, newBoard);
          setHintCell(null);
          setStatusMessage(
            markedCount === 1 ? "Marked 1 cell with X." : `Marked ${markedCount} cells with X.`
          );
          return newBoard;
        } else {
          setStatusMessage("Those cells are already marked.");
          return prevBoard;
        }
      });
    },
    [isComplete, isGameOver, currentLevel, difficulty]
  );

  // Action: Hint
  const handleHint = () => {
    if (isComplete) {
      setStatusMessage("The board is already solved!");
      return;
    }
    // Find next solution cat not yet placed
    const unplaced = currentLevel.solution.find(
      (sol) => !isFixedCat(currentLevel, sol.row, sol.col) && board[sol.row][sol.col] !== "cat"
    );

    if (unplaced) {
      setHintCell(unplaced);
      setStatusMessage(`Hint: inspect row ${unplaced.row + 1}, column ${unplaced.col + 1}.`);
    } else {
      setStatusMessage("All solution cats are placed. Check for conflicts or extra cats.");
    }
  };

  // Action: Undo
  const handleUndo = () => {
    if (history.length === 0) {
      setStatusMessage("No moves to undo yet.");
      return;
    }
    const previous = history[history.length - 1];
    setBoard(previous);
    saveActiveBoard(difficulty, currentLevel.id, previous);
    setHistory((prev) => prev.slice(0, -1));
    setHintCell(null);
    setIsWinModalOpen(false);
    setStatusMessage("Last move undone.");
  };

  // Action: Restart
  const handleRestart = () => {
    clearActiveBoard(difficulty, currentLevel.id);
    setBoard(createInitialBoard(currentLevel));
    setHistory([]);
    setHintCell(null);
    setIsWinModalOpen(false);
    setIsGameOver(false);
    setLives(MAX_LIVES);
    setStartTime(Date.now());
    setStatusMessage(
      currentLevel.fixedCat ? "Board reset. Starter cat stays put." : "Board reset."
    );
  };

  const handleSecondChance = () => {
    setLives(1);
    setIsGameOver(false);
    setStatusMessage("Second chance! 1 life remaining. Think carefully! ❤️");
  };

  return (
    <section className="min-h-[calc(100vh-64px)] flex flex-col justify-center bg-[#f8f6ef] px-3 py-2 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* 3-Column Desktop Layout */}
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[250px_minmax(0,1fr)_250px] xl:grid-cols-[280px_minmax(0,1fr)_280px] xl:gap-8">
          {/* LEFT SIDEBAR: Status, Lives, Color Tracker, Difficulty */}
          <aside className="order-2 flex flex-col gap-3 lg:order-1">
            {/* Cats & Lives Stats Card (Shown on desktop lg+, hidden on mobile where it lives above the board) */}
            <div className="hidden lg:block rounded-[1.4rem] bg-white p-3.5 shadow-sm ring-1 ring-[#eaded8]">
              <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.14em] text-[#8b746d]">
                Game Status
              </span>
              <div className="flex items-center justify-between gap-2">
                {/* Cat counter */}
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f8f6ef] px-2.5 py-1 text-sm font-black text-[#559c68] ring-1 ring-[#e7dacf]">
                  <Image
                    src="/assets/cat.webp"
                    alt="Cat"
                    width={24}
                    height={24}
                    priority
                    className="h-5 w-5 object-contain"
                  />
                  <span>
                    {stats.cats}
                    <span className="text-[#8b746d]">/{currentLevel.size}</span>
                  </span>
                </div>

                {/* Lives counter */}
                <div
                  title={`${lives} of ${MAX_LIVES} lives remaining`}
                  className="inline-flex items-center gap-1 rounded-full bg-[#f8f6ef] px-2.5 py-1 ring-1 ring-[#e7dacf]"
                >
                  {Array.from({ length: MAX_LIVES }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm transition-all duration-300 ${
                        i < lives
                          ? "scale-100 opacity-100 drop-shadow-sm"
                          : "scale-75 opacity-25 grayscale"
                      }`}
                    >
                      ❤️
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Color Territory Progress Card */}
            <div className="rounded-[1.4rem] bg-white p-3 sm:p-3.5 shadow-sm ring-1 ring-[#eaded8]">
              <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.14em] text-[#8b746d]">
                Color Territories
              </span>
              <RegionTracker
                level={currentLevel}
                board={board}
                conflicts={conflicts}
                layout="grid"
              />
            </div>

            {/* Difficulty Selector Card */}
            <div className="rounded-[1.4rem] bg-white p-3 shadow-sm ring-1 ring-[#eaded8]">
              <span className="mb-1.5 block text-center text-[10px] font-black uppercase tracking-[0.14em] text-[#8b746d]">
                Difficulty
              </span>
              <div className="grid grid-cols-3 gap-1 rounded-[1.1rem] bg-[#f8f6ef] p-1 ring-1 ring-[#e7dacf]">
                {(["normal", "hard", "ultra"] as Difficulty[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleDifficultyChange(mode)}
                    className={`min-h-8 rounded-xl text-xs font-black uppercase transition ${
                      difficulty === mode
                        ? "bg-[#3d302c] text-white shadow-sm"
                        : "text-[#8b746d] hover:bg-[#fbf1ec] hover:text-[#3d302c]"
                    }`}
                  >
                    {DIFFICULTY_LABELS[mode]}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* CENTER: Level Title + Board + Guidance Banner */}
          <main className="order-1 flex flex-col items-center justify-center lg:order-2">
            {/* Level Title & Navigation Header */}
            <div className="mb-2 flex w-full max-w-[480px] items-center justify-between px-1">
              <button
                type="button"
                disabled={levelIndex === 0}
                onClick={() => loadLevel(levelIndex - 1)}
                title={levelIndex === 0 ? "First level" : `Go to Level ${levelIndex}`}
                className="flex h-8 items-center justify-center rounded-full bg-white px-2.5 sm:px-3 text-[11px] sm:text-xs font-black uppercase text-[#7a635c] shadow-sm ring-1 ring-[#e7dacf] transition hover:bg-[#fbf1ec] disabled:opacity-30"
              >
                ← Prev
              </button>

              <div className="flex flex-col items-center text-center min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <h1 className="text-lg sm:text-2xl font-black leading-tight text-[#705861] truncate">
                    {currentLevel.name}
                  </h1>
                  {completedLevelIds.has(currentLevel.id) && (
                    <span
                      title="Level Completed! ✓"
                      className="inline-flex items-center gap-1 rounded-full bg-[#eef8eb] px-2 py-0.5 text-[9px] sm:text-[10px] font-black text-[#487447] ring-1 ring-[#c5e6be] shrink-0"
                    >
                      Solved ✓
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsLevelSelectorOpen(true)}
                  title="Click to view all levels and campaign journey roadmap"
                  className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-black text-[#559c68] shadow-sm ring-1 ring-[#e7dacf] transition hover:bg-[#fff4f0] hover:scale-105"
                >
                  <span>🗺️ Journey Map</span>
                  <span className="text-[#8b746d]">
                    ({completedLevelIds.size}/{levels.length})
                  </span>
                </button>
              </div>

              <button
                type="button"
                disabled={levelIndex >= levels.length - 1 || levelIndex + 1 >= unlockedCount}
                title={
                  levelIndex >= levels.length - 1
                    ? "Last level of this mode!"
                    : levelIndex + 1 >= unlockedCount
                      ? `Level ${levelIndex + 2} is locked! Complete this level to unlock it. 🔒`
                      : `Go to Level ${levelIndex + 2}`
                }
                onClick={() => loadLevel(levelIndex + 1)}
                className="flex h-8 items-center justify-center rounded-full bg-white px-2.5 sm:px-3 text-[11px] sm:text-xs font-black uppercase text-[#7a635c] shadow-sm ring-1 ring-[#e7dacf] transition hover:bg-[#fbf1ec] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {levelIndex + 1 >= unlockedCount && levelIndex < levels.length - 1 ? "Next 🔒" : "Next →"}
              </button>
            </div>

            {/* Mobile Quick Status & Action Controls (Visible on mobile/tablet, hidden on desktop lg) */}
            <div className="mb-2 flex w-full max-w-[480px] items-center justify-between gap-1 rounded-2xl bg-white px-2.5 py-1.5 shadow-sm ring-1 ring-[#eaded8] lg:hidden">
              {/* Cats placed count */}
              <div className="inline-flex items-center gap-1 rounded-full bg-[#f8f6ef] px-2 py-0.5 text-xs font-black text-[#559c68] ring-1 ring-[#e7dacf]">
                <Image
                  src="/assets/cat.webp"
                  alt="Cat"
                  width={18}
                  height={18}
                  className="h-4 w-4 object-contain"
                />
                <span>
                  {stats.cats}
                  <span className="text-[#8b746d]">/{currentLevel.size}</span>
                </span>
              </div>

              {/* Lives hearts */}
              <div
                className="inline-flex items-center gap-0.5"
                title={`${lives} of ${MAX_LIVES} lives remaining`}
              >
                {Array.from({ length: MAX_LIVES }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-xs transition-all ${
                      i < lives ? "scale-100 opacity-100" : "scale-75 opacity-25 grayscale"
                    }`}
                  >
                    ❤️
                  </span>
                ))}
              </div>

              {/* Quick Actions for Mobile */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleHint}
                  title="Get Hint"
                  aria-label="Get Hint"
                  className="flex h-7 items-center gap-1 rounded-lg bg-[#f8f6ef] px-2 text-xs font-black text-[#3d302c] transition hover:bg-[#fff4f0] ring-1 ring-[#eaded8]/80"
                >
                  <span className="text-xs">💡</span>
                  <span className="text-[11px]">Hint</span>
                </button>

                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={history.length === 0}
                  title="Undo last move"
                  aria-label="Undo Move"
                  className="flex h-7 items-center gap-1 rounded-lg bg-[#f8f6ef] px-2 text-xs font-black text-[#3d302c] transition hover:bg-[#fff4f0] ring-1 ring-[#eaded8]/80 disabled:opacity-40"
                >
                  <span className="text-xs">↩️</span>
                  <span className="text-[11px]">Undo</span>
                </button>

                <button
                  type="button"
                  onClick={handleRestart}
                  title="Restart Level"
                  aria-label="Restart Level"
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f8f6ef] text-xs font-black text-[#3d302c] transition hover:bg-[#fff4f0] ring-1 ring-[#eaded8]/80"
                >
                  🔄
                </button>
              </div>
            </div>

            {/* Board Component */}
            <Board
              level={currentLevel}
              board={board}
              conflicts={conflicts}
              hintCell={hintCell}
              isComplete={isComplete}
              dragPreview={dragPreview}
              onCellClick={handleCellClick}
              onDragMark={handleDragMark}
              onDragPreviewChange={setDragPreview}
            />

            {/* Guidance status message */}
            <p
              role="status"
              className="mt-2.5 w-full max-w-[480px] rounded-full px-4 py-1.5 text-center text-xs font-bold shadow-sm ring-1 bg-white/80 text-[#7a635c] ring-[#efe5dc] sm:text-sm"
            >
              {statusMessage}
            </p>
          </main>

          {/* RIGHT SIDEBAR: Actions & Rules */}
          <aside className="order-3 flex flex-col gap-3">
            {/* Quick Actions Card */}
            <div className="rounded-[1.4rem] bg-white p-3.5 shadow-sm ring-1 ring-[#eaded8]">
              <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.14em] text-[#8b746d]">
                Actions
              </span>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsLevelSelectorOpen(true)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-black text-[#3d302c] transition hover:bg-[#fff4f0] ring-1 ring-[#eaded8]/60"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f8f6ef] text-[#7a635c]">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                      <path d="M5 6h5v5H5V6Zm9 0h5v5h-5V6ZM5 15h5v5H5v-5Zm9 0h5v5h-5v-5Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2.2" />
                    </svg>
                  </span>
                  <span>🗺️ Journey Roadmap</span>
                </button>

                <button
                  type="button"
                  onClick={handleHint}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-black text-[#3d302c] transition hover:bg-[#fff4f0] ring-1 ring-[#eaded8]/60"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f8f6ef] text-[#7a635c]">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                      <path d="M9 18h6M10 22h4M8.4 14.3a6 6 0 1 1 7.2 0c-.9.7-1.2 1.4-1.2 2.2H9.6c0-.8-.3-1.5-1.2-2.2Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
                    </svg>
                  </span>
                  <span>Get Hint</span>
                </button>

                <button
                  type="button"
                  onClick={handleUndo}
                  disabled={history.length === 0}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-black text-[#3d302c] transition hover:bg-[#fff4f0] ring-1 ring-[#eaded8]/60 disabled:opacity-40"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f8f6ef] text-[#7a635c]">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                      <path d="M9 7 5 11l4 4M5 11h9a5 5 0 0 1 0 10h-3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
                    </svg>
                  </span>
                  <span>Undo Move</span>
                </button>

                <button
                  type="button"
                  onClick={handleRestart}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-black text-[#3d302c] transition hover:bg-[#fff4f0] ring-1 ring-[#eaded8]/60"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f8f6ef] text-[#7a635c]">
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                      <path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
                    </svg>
                  </span>
                  <span>Restart Level</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOnboardingOpen(true)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-black text-[#3d302c] transition hover:bg-[#fff4f0] ring-1 ring-[#eaded8]/60"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f8f6ef] text-sm font-black text-[#7a635c]">
                    🐾
                  </span>
                  <span>Guide & Difficulty</span>
                </button>
              </div>
            </div>

            {/* Interactive Visual Rules Card */}
            <QuickRulesVisual onOpenFullRules={() => setIsRulesOpen(true)} />
          </aside>
        </div>

        {/* Creator Credit Badge */}
        <div className="mt-4 flex items-center justify-center gap-2 border-t border-[#eaded8]/60 pt-4 text-xs font-semibold text-[#8b746d]">
          <span>Meowdoku Logic Game</span>
          <span>•</span>
          <span>Created by</span>
          <a
            href="https://github.com/RadheyMugdal"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-[#eb4726] transition hover:text-[#c43618] hover:underline underline-offset-4"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            @RadheyMugdal
          </a>
        </div>
      </div>

      {/* Modals */}
      <LevelSelector
        isOpen={isLevelSelectorOpen}
        difficulty={difficulty}
        levels={levels}
        currentLevelIndex={levelIndex}
        unlockedCount={unlockedCount}
        completedIds={completedLevelIds}
        onSelectLevel={loadLevel}
        onChangeDifficulty={handleDifficultyChange}
        onClose={() => setIsLevelSelectorOpen(false)}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        initialDifficulty={difficulty}
        onStartGame={handleStartOnboarding}
        onClose={handleCloseOnboarding}
      />

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

      <WinModal
        isOpen={isWinModalOpen}
        levelName={currentLevel.name}
        elapsedMs={elapsedMs}
        hasNextLevel={levelIndex < levels.length - 1}
        onNextLevel={() => loadLevel(levelIndex + 1)}
        onRestart={handleRestart}
        onClose={() => setIsWinModalOpen(false)}
      />

      <GameOverModal
        isOpen={isGameOver}
        levelName={currentLevel.name}
        onRestart={handleRestart}
        onSecondChance={handleSecondChance}
      />
    </section>
  );
};
