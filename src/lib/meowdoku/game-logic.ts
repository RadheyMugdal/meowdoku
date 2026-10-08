import type { BoardStats, CellCoord, CellState, Difficulty, Level, SavedProgress } from "./types";
import normalData from "./data/normal.json";
import hardData from "./data/hard.json";
import ultraData from "./data/ultra.json";

export const LEVELS: Record<Difficulty, Level[]> = {
  normal: normalData as Level[],
  hard: hardData as Level[],
  ultra: ultraData as Level[],
};

export const DEFAULT_THEME_PALETTE: Record<string, string> = {
  A: "#67C5BF",
  B: "#DD84CB",
  C: "#6CB6DC",
  D: "#E8C94F",
  E: "#D896B3",
  F: "#A9D893",
  G: "#9278D9",
  H: "#F09A74",
  I: "#7F9BE6",
  J: "#D6A55F",
  K: "#C06C84",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  normal: "Normal",
  hard: "Hard",
  ultra: "Ultra",
};

export const DIFFICULTY_PREFIX: Record<Difficulty, string> = {
  normal: "Level",
  hard: "Hard Level",
  ultra: "Ultra Hard Level",
};

export function cellKey(row: number, col: number): string {
  return `${row}-${col}`;
}

export function isSameCoord(a: CellCoord, b: CellCoord): boolean {
  return a.row === b.row && a.col === b.col;
}

export function isFixedCat(level: Level, row: number, col: number): boolean {
  return !!(level.fixedCat && isSameCoord(level.fixedCat, { row, col }));
}

export function createInitialBoard(level: Level): CellState[][] {
  return Array.from({ length: level.size }, (_, r) =>
    Array.from({ length: level.size }, (_, c) =>
      level.fixedCat && isSameCoord(level.fixedCat, { row: r, col: c }) ? "cat" : "empty"
    )
  );
}

export function cloneBoard(board: CellState[][]): CellState[][] {
  return board.map((row) => [...row]);
}

export function findCats(board: CellState[][]): CellCoord[] {
  const cats: CellCoord[] = [];
  board.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (cell === "cat") {
        cats.push({ row: r, col: c });
      }
    });
  });
  return cats;
}

/**
 * Finds all cell coordinates that violate the Meowdoku rules:
 * 1. More than 1 cat in the same row
 * 2. More than 1 cat in the same column
 * 3. More than 1 cat in the same color region
 * 4. Any two cats that are diagonally adjacent (touching at corners) or orthogonally adjacent
 */
export function findConflicts(board: CellState[][], level: Level): Set<string> {
  const conflicts = new Set<string>();
  const cats = findCats(board).filter(
    (cat) => cat.row < level.size && cat.col < level.size
  );

  const rowMap = new Map<number, CellCoord[]>();
  const colMap = new Map<number, CellCoord[]>();
  const regionMap = new Map<string, CellCoord[]>();

  for (const cat of cats) {
    const region = level.regions[cat.row]?.[cat.col];
    if (!region) continue;
    rowMap.set(cat.row, [...(rowMap.get(cat.row) ?? []), cat]);
    colMap.set(cat.col, [...(colMap.get(cat.col) ?? []), cat]);
    regionMap.set(region, [...(regionMap.get(region) ?? []), cat]);
  }

  // Row, Col, Region duplicates
  for (const group of [...rowMap.values(), ...colMap.values(), ...regionMap.values()]) {
    if (group.length > 1) {
      group.forEach((cat) => conflicts.add(cellKey(cat.row, cat.col)));
    }
  }

  // Diagonal and adjacent touching (Kings move: Chebyshev distance === 1)
  for (let i = 0; i < cats.length; i++) {
    for (let j = i + 1; j < cats.length; j++) {
      const a = cats[i];
      const b = cats[j];
      const dr = Math.abs(a.row - b.row);
      const dc = Math.abs(a.col - b.col);
      if (dr <= 1 && dc <= 1 && !(dr === 0 && dc === 0)) {
        conflicts.add(cellKey(a.row, a.col));
        conflicts.add(cellKey(b.row, b.col));
      }
    }
  }

  return conflicts;
}

export function getBoardStats(board: CellState[][], level: Level): BoardStats {
  const cats = findCats(board).filter(
    (cat) => cat.row < level.size && cat.col < level.size
  );
  const conflicts = findConflicts(board, level);

  const solvedRows = Array.from({ length: level.size }, (_, r) =>
    cats.filter((cat) => cat.row === r).length === 1
  ).filter(Boolean).length;

  const solvedCols = Array.from({ length: level.size }, (_, c) =>
    cats.filter((cat) => cat.col === c).length === 1
  ).filter(Boolean).length;

  const uniqueRegions = Array.from(new Set(level.regions.flat()));
  const solvedRegions = uniqueRegions.filter((reg) =>
    cats.filter((cat) => level.regions[cat.row]?.[cat.col] === reg).length === 1
  ).length;

  return {
    cats: cats.length,
    conflicts: conflicts.size,
    solvedRows,
    solvedCols,
    solvedRegions,
  };
}

export function isBoardSolved(board: CellState[][], level: Level): boolean {
  const stats = getBoardStats(board, level);
  return (
    stats.cats === level.size &&
    stats.conflicts === 0 &&
    stats.solvedRows === level.size &&
    stats.solvedCols === level.size &&
    stats.solvedRegions === level.size
  );
}

const STORAGE_PREFIX = "meowdoku_progress_";
const LAST_DIFFICULTY_KEY = "meowdoku_last_difficulty";

export function getSavedDifficulty(): Difficulty {
  if (typeof window === "undefined") return "normal";
  try {
    const saved = window.localStorage.getItem(LAST_DIFFICULTY_KEY);
    if (saved === "normal" || saved === "hard" || saved === "ultra") return saved;
  } catch {}
  return "normal";
}

export function saveLastDifficulty(diff: Difficulty): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAST_DIFFICULTY_KEY, diff);
  } catch {}
}

export function loadSavedProgress(difficulty: Difficulty): SavedProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${difficulty}`);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const levels = LEVELS[difficulty];
    const completed = new Set<number>(data.completedLevelIds ?? []);

    // Strict Sequential Journey: Contiguous completed levels from index 0 unlock the next level
    let unlocked = 1;
    for (let i = 0; i < levels.length; i++) {
      if (completed.has(levels[i].id)) {
        unlocked = Math.min(levels.length, i + 2);
      } else {
        break;
      }
    }

    return {
      currentLevelId: data.currentLevelId ?? levels[0].id,
      completedLevelIds: Array.from(completed),
      unlockedLevelCount: unlocked,
      updatedAt: data.updatedAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveProgress(
  difficulty: Difficulty,
  levelIndex: number,
  completedLevelId?: number
): SavedProgress {
  const levels = LEVELS[difficulty];
  const targetLevel = levels[levelIndex] ?? levels[0];
  const prev = loadSavedProgress(difficulty);
  const completed = new Set<number>(prev?.completedLevelIds ?? []);

  if (completedLevelId !== undefined) {
    completed.add(completedLevelId);
  }

  const completedList = Array.from(completed).sort((a, b) => a - b);

  // Strict Sequential Journey: Contiguous completed levels from index 0 unlock the next level
  let unlocked = 1;
  for (let i = 0; i < levels.length; i++) {
    if (completed.has(levels[i].id)) {
      unlocked = Math.min(levels.length, i + 2);
    } else {
      break;
    }
  }

  const progress: SavedProgress = {
    currentLevelId: targetLevel.id,
    completedLevelIds: completedList,
    unlockedLevelCount: unlocked,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(`${STORAGE_PREFIX}${difficulty}`, JSON.stringify(progress));
      saveLastDifficulty(difficulty);
    } catch {}
  }

  return progress;
}

const BOARD_STORAGE_PREFIX = "meowdoku_board_";

export function saveActiveBoard(difficulty: Difficulty, levelId: number, board: CellState[][]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      `${BOARD_STORAGE_PREFIX}${difficulty}_${levelId}`,
      JSON.stringify(board)
    );
  } catch {}
}

export function loadActiveBoard(difficulty: Difficulty, level: Level): CellState[][] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(`${BOARD_STORAGE_PREFIX}${difficulty}_${level.id}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      Array.isArray(parsed) &&
      parsed.length === level.size &&
      Array.isArray(parsed[0]) &&
      parsed[0].length === level.size
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearActiveBoard(difficulty: Difficulty, levelId: number): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(`${BOARD_STORAGE_PREFIX}${difficulty}_${levelId}`);
  } catch {}
}

export function formatTime(ms: number): string {
  const totalSeconds = Math.max(1, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes <= 0) return `${seconds}s`;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}
