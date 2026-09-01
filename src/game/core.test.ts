import { describe, expect, it } from 'vitest';
import { archiveBoard, createGame, placePiece, seededBoard, solveBoard } from './core';

describe('deterministic orchard core', () => {
  it('builds the same personal seed every time', () => {
    expect(seededBoard('mint-window').fingerprint).toBe(seededBoard('mint-window').fingerprint);
    expect(seededBoard('mint-window').fingerprint).not.toBe(seededBoard('amber-rain').fingerprint);
  });

  it('all 40 teaching boards have a valid winning solution', () => {
    for (let level = 1; level <= 40; level += 1) {
      const state = solveBoard(archiveBoard(level));
      expect(state.phase, `board ${level}`).toBe('won');
      expect(state.dew, `board ${level}`).toBe(3);
    }
  });

  it('ends the run after three invalid placements', () => {
    const board = archiveBoard(1);
    let state = createGame(board);
    for (let attempt = 0; attempt < 3; attempt += 1) {
      state = placePiece(state, board, 'piece-0', { col: 6, row: 6 });
    }
    expect(state.phase).toBe('lost');
  });
});
