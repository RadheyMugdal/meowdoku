# Meowdoku 🐱

> A cat logic puzzle game inspired by Sudoku deduction and Queens problem placement rules.
> **Created with ❤️ by [@RadheyMugdal](https://github.com/RadheyMugdal)**

---

## 🎮 About Meowdoku

Meowdoku is a standalone Next.js puzzle game. Your goal is to place happy cats on the grid based on simple yet captivating rules:
1. **Row & Column Rule**: Place exactly one cat in each row and column.
2. **Color Region Rule**: Place exactly one cat in each colored zone.
3. **No Touching Rule**: Cats cannot touch each other orthogonally or diagonally in any direction.

---

## ✨ Features

- **271 Unique Levels**: Handcrafted levels across **Normal**, **Hard**, and **Ultra** difficulties.
- **Campaign Journey Roadmap**: Visual progression path where completing each level sequentially unlocks the next.
- **5-Step Interactive Onboarding**: Step-by-step introduction for beginners with custom starting difficulty selection.
- **Hold & Drag Multi-Cell Marking**: Fluid drag interaction to mark empty cells with `✕` without erasing previously marked cells.
- **Intuitive Tap & Deselect Controls**: Click or tap an empty cell to mark with `✕`, or click a checked box again to immediately deselect it. Double-click or right-click to place or remove a Cat `🐱`.
- **Active State & Progress Persistence**: Board state, active marks, unlocked levels, and chosen difficulty are automatically saved to `localStorage`.
- **Intelligent Hint System & Undo**: Step-by-step hints and full move history undo support.
- **Dark Mode Support**: Seamless light/dark theme switching.
- **Pure Standalone Next.js Architecture**: Clean, single-app structure with zero monorepo overhead.

---

## 🚀 Getting Started

Run the development server locally:

```bash
bun install
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **UI & Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)

---

## 👤 Author

Created by **Radhey Mugdal**  
- GitHub: [@RadheyMugdal](https://github.com/RadheyMugdal)
