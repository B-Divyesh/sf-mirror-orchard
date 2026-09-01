import type { GameState } from './game/core';

export interface Settings {
  sound: boolean;
  calmMotion: boolean;
}

export interface SaveData {
  completed: number[];
  bestMoves: Record<string, number>;
  recentSeeds: string[];
  settings: Settings;
  runs: Record<string, GameState>;
}

const REAL_KEY = 'mirror-orchard:v1';
const DEMO_KEY = 'demo:mirror-orchard:v1';

function freshData(demo: boolean): SaveData {
  return {
    completed: demo ? [1, 2] : [],
    bestMoves: demo ? { 'archive-1': 3, 'archive-2': 4 } : {},
    recentSeeds: demo ? ['mint-window', 'amber-rain'] : [],
    settings: { sound: false, calmMotion: false },
    runs: {}
  };
}

export function storageKey(demo: boolean): string {
  return demo ? DEMO_KEY : REAL_KEY;
}

export function loadData(demo: boolean): SaveData {
  const fallback = freshData(demo);
  try {
    const raw = localStorage.getItem(storageKey(demo));
    if (!raw) {
      if (demo) localStorage.setItem(DEMO_KEY, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed : fallback.completed,
      bestMoves: parsed.bestMoves ?? fallback.bestMoves,
      recentSeeds: Array.isArray(parsed.recentSeeds) ? parsed.recentSeeds : fallback.recentSeeds,
      settings: { ...fallback.settings, ...parsed.settings },
      runs: parsed.runs ?? {}
    };
  } catch {
    return fallback;
  }
}

export function saveData(demo: boolean, data: SaveData): boolean {
  try {
    localStorage.setItem(storageKey(demo), JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function resetDemo(): void {
  try {
    localStorage.removeItem(DEMO_KEY);
  } catch {
    // The in-memory fallback still lets the demo run.
  }
}

export function discardDemo(): void {
  resetDemo();
}
