export type CellCoord = {
  row: number;
  col: number;
};

export type CellState = "empty" | "x" | "cat";

export type Difficulty = "normal" | "hard" | "ultra";

export interface Level {
  id: number;
  name: string;
  size: number;
  intro: string;
  regions: string[][];
  regionColors: Record<string, string>;
  solution: CellCoord[];
  fixedCat: CellCoord | null;
}

export interface BoardStats {
  cats: number;
  conflicts: number;
  solvedRows: number;
  solvedCols: number;
  solvedRegions: number;
}

export interface SavedProgress {
  currentLevelId: number;
  completedLevelIds: number[];
  unlockedLevelCount: number;
  updatedAt: string;
}

export interface RuleSlide {
  title: string;
  body: string;
  pattern: "click-x" | "click-cat" | "click-clear" | "row-column" | "color-region" | "neighbors" | "win";
}
