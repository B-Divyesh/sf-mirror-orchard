export const BOARD_SIZE = 7;
export const AXIS = 3;

export type PieceKind = 'bud' | 'twig' | 'corner';
export type Phase = 'playing' | 'paused' | 'won' | 'lost';

export interface Cell {
  col: number;
  row: number;
}

export interface SolutionPlacement {
  kind: PieceKind;
  rotation: number;
  anchor: Cell;
}

export interface Board {
  id: string;
  seed: string;
  title: string;
  instruction: string;
  level: number;
  target: string[];
  stones: string[];
  inventory: PieceKind[];
  solution: SolutionPlacement[];
  fingerprint: string;
}

export interface Piece {
  id: string;
  kind: PieceKind;
  rotation: number;
  used: boolean;
}

export interface Move {
  pieceId: string;
  cells: string[];
}

export interface GameState {
  boardId: string;
  filled: string[];
  pieces: Piece[];
  dew: number;
  moves: number;
  phase: Phase;
  history: Move[];
}

const BOARD_TITLES = [
  'Single reflections', 'Plant the center', 'Build both halves', 'Read the glowing soil',
  'Finish a full row', 'Turn your first twig', 'Stack two twigs', 'Cross the open rows',
  'Use every branch', 'Plan before planting', 'Fit the narrow beds', 'Mix buds and twigs',
  'Meet the corner branch', 'Turn corners inward', 'Turn corners outward', 'Close the small gaps',
  'Plant from either side', 'Build around the channel', 'Save buds for gaps', 'Complete the terrace',
  'Work around glass stones', 'Read the negative space', 'Plant the long edges', 'Fill the inner beds',
  'Pair corners and twigs', 'Choose the first branch', 'Protect the open gap', 'Turn twice before planting',
  'Use the whole tray', 'Complete the lower terrace', 'Balance three branch types', 'Start from the outside',
  'Start beside the channel', 'Leave room for corners', 'Fit the final bud', 'Read the full pattern',
  'Plant a dense orchard', 'Solve the split terrace', 'Complete the glass grove', 'Finish the teaching orchard'
];

const INSTRUCTIONS = [
  'Choose a branch, then plant inside the glowing soil.',
  'A center bud grows once. Other branches grow on both sides.',
  'Your branch and its reflection arrive together.',
  'Fill every marked plot without crossing its edge.',
  'Use each branch once. Undo is always available.',
  'Rotate a twig before planting it.',
  'The pale outline previews every reflected plot.',
  'A branch may start on either side of the channel.',
  'Glass stones cannot hold a branch.',
  'Plan the larger branches before filling small gaps.'
];

export function cellKey(cell: Cell): string {
  return `${cell.col},${cell.row}`;
}

export function parseCell(key: string): Cell {
  const [col, row] = key.split(',').map(Number);
  return { col, row };
}

function hashSeed(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rngFor(seed: string): () => number {
  let a = hashSeed(seed) || 1;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shapeCells(kind: PieceKind, rotation: number, anchor: Cell): Cell[] {
  const turn = ((rotation % 4) + 4) % 4;
  const offsets: Record<PieceKind, Cell[][]> = {
    bud: [[{ col: 0, row: 0 }], [{ col: 0, row: 0 }], [{ col: 0, row: 0 }], [{ col: 0, row: 0 }]],
    twig: [
      [{ col: 0, row: 0 }, { col: 1, row: 0 }],
      [{ col: 0, row: 0 }, { col: 0, row: 1 }],
      [{ col: 0, row: 0 }, { col: -1, row: 0 }],
      [{ col: 0, row: 0 }, { col: 0, row: -1 }]
    ],
    corner: [
      [{ col: 0, row: 0 }, { col: 1, row: 0 }, { col: 0, row: 1 }],
      [{ col: 0, row: 0 }, { col: 0, row: 1 }, { col: -1, row: 0 }],
      [{ col: 0, row: 0 }, { col: -1, row: 0 }, { col: 0, row: -1 }],
      [{ col: 0, row: 0 }, { col: 0, row: -1 }, { col: 1, row: 0 }]
    ]
  };
  return offsets[kind][turn].map((offset) => ({
    col: anchor.col + offset.col,
    row: anchor.row + offset.row
  }));
}

export function reflectedCells(kind: PieceKind, rotation: number, anchor: Cell): Cell[] | null {
  const base = shapeCells(kind, rotation, anchor);
  const inside = base.every(({ col, row }) => col >= 0 && col < BOARD_SIZE && row >= 0 && row < BOARD_SIZE);
  if (!inside) return null;
  const hasLeft = base.some((cell) => cell.col < AXIS);
  const hasRight = base.some((cell) => cell.col > AXIS);
  const hasCenter = base.some((cell) => cell.col === AXIS);
  if ((hasLeft && hasRight) || (hasCenter && (kind !== 'bud' || base.length !== 1))) return null;
  const expanded = new Map<string, Cell>();
  for (const cell of base) {
    expanded.set(cellKey(cell), cell);
    if (cell.col !== AXIS) {
      const mirror = { col: BOARD_SIZE - 1 - cell.col, row: cell.row };
      expanded.set(cellKey(mirror), mirror);
    }
  }
  return [...expanded.values()];
}

function availableKinds(level: number): PieceKind[] {
  if (level <= 5) return ['bud'];
  if (level <= 12) return ['bud', 'twig'];
  return ['bud', 'twig', 'corner'];
}

function makeBoard(seed: string, level: number, id: string, title: string): Board {
  const random = rngFor(seed);
  const occupied = new Set<string>();
  const solution: SolutionPlacement[] = [];
  const kinds = availableKinds(level);
  const wanted = Math.min(8, 3 + Math.floor((level - 1) / 5));
  let attempts = 0;

  while (solution.length < wanted && attempts < 500) {
    attempts += 1;
    const kind = kinds[Math.floor(random() * kinds.length)];
    const rotation = Math.floor(random() * 4);
    const anchor = { col: Math.floor(random() * AXIS), row: Math.floor(random() * BOARD_SIZE) };
    const base = shapeCells(kind, rotation, anchor);
    if (!base.every(({ col, row }) => col >= 0 && col < AXIS && row >= 0 && row < BOARD_SIZE)) continue;
    if (base.some((cell) => occupied.has(cellKey(cell)))) continue;
    base.forEach((cell) => occupied.add(cellKey(cell)));
    solution.push({ kind, rotation, anchor });
  }

  while (solution.length < wanted) {
    const open = [...Array(BOARD_SIZE * AXIS)].map((_, i) => ({ col: i % AXIS, row: Math.floor(i / AXIS) }))
      .find((cell) => !occupied.has(cellKey(cell)));
    if (!open) break;
    occupied.add(cellKey(open));
    solution.push({ kind: 'bud', rotation: 0, anchor: open });
  }

  const centerCount = level === 1 ? 0 : level % 3 === 0 ? 2 : 1;
  const centerRows = new Set<number>();
  while (centerRows.size < centerCount) centerRows.add(Math.floor(random() * BOARD_SIZE));
  centerRows.forEach((row) => solution.push({ kind: 'bud', rotation: 0, anchor: { col: AXIS, row } }));

  const target = new Set<string>();
  for (const placement of solution) {
    reflectedCells(placement.kind, placement.rotation, placement.anchor)?.forEach((cell) => target.add(cellKey(cell)));
  }

  const stoneCount = level < 21 ? 0 : Math.min(5, 1 + Math.floor((level - 21) / 5));
  const stones = new Set<string>();
  while (stones.size < stoneCount) {
    const col = Math.floor(random() * BOARD_SIZE);
    const row = Math.floor(random() * BOARD_SIZE);
    const key = cellKey({ col, row });
    const mirror = cellKey({ col: BOARD_SIZE - 1 - col, row });
    if (!target.has(key) && !target.has(mirror)) {
      stones.add(key);
      stones.add(mirror);
    }
  }

  const inventory = solution.map((placement) => placement.kind);
  const fingerprint = [...target].sort().join('|') + `::${inventory.join(',')}`;
  return {
    id,
    seed,
    title,
    instruction: INSTRUCTIONS[Math.min(INSTRUCTIONS.length - 1, Math.floor((level - 1) / 4))],
    level,
    target: [...target],
    stones: [...stones],
    inventory,
    solution,
    fingerprint
  };
}

export function archiveBoard(level: number): Board {
  const safeLevel = Math.max(1, Math.min(40, Math.floor(level)));
  return makeBoard(`teaching-orchard-${safeLevel}-v1`, safeLevel, `archive-${safeLevel}`, BOARD_TITLES[safeLevel - 1]);
}

export function seededBoard(seed: string, mode: 'seed' | 'daily' = 'seed'): Board {
  const cleaned = seed.trim().slice(0, 48) || 'green-glass';
  const title = mode === 'daily' ? 'Today’s mirrored orchard' : `Seed: ${cleaned}`;
  return makeBoard(`${mode}:${cleaned}:v1`, 34, `${mode}-${encodeURIComponent(cleaned)}`, title);
}

export function createGame(board: Board): GameState {
  return {
    boardId: board.id,
    filled: [],
    pieces: board.inventory.map((kind, index) => ({ id: `piece-${index}`, kind, rotation: 0, used: false })),
    dew: 3,
    moves: 0,
    phase: 'playing',
    history: []
  };
}

export function placePiece(state: GameState, board: Board, pieceId: string, anchor: Cell): GameState {
  if (state.phase !== 'playing') return state;
  const piece = state.pieces.find((candidate) => candidate.id === pieceId);
  if (!piece || piece.used) return state;
  const cells = reflectedCells(piece.kind, piece.rotation, anchor);
  const target = new Set(board.target);
  const filled = new Set(state.filled);
  const valid = cells && cells.every((cell) => target.has(cellKey(cell)) && !filled.has(cellKey(cell)));
  if (!valid || !cells) {
    const dew = Math.max(0, state.dew - 1);
    return { ...state, dew, phase: dew === 0 ? 'lost' : state.phase };
  }
  cells.forEach((cell) => filled.add(cellKey(cell)));
  const pieces = state.pieces.map((candidate) => candidate.id === pieceId ? { ...candidate, used: true } : candidate);
  const phase = filled.size === target.size ? 'won' : state.phase;
  return {
    ...state,
    filled: [...filled],
    pieces,
    moves: state.moves + 1,
    phase,
    history: [...state.history, { pieceId, cells: cells.map(cellKey) }]
  };
}

export function rotatePiece(state: GameState, pieceId: string): GameState {
  if (state.phase !== 'playing') return state;
  return {
    ...state,
    pieces: state.pieces.map((piece) => piece.id === pieceId && !piece.used
      ? { ...piece, rotation: (piece.rotation + 1) % 4 }
      : piece)
  };
}

export function undoMove(state: GameState): GameState {
  const move = state.history.at(-1);
  if (!move || state.phase === 'lost') return state;
  const removed = new Set(move.cells);
  return {
    ...state,
    phase: 'playing',
    filled: state.filled.filter((cell) => !removed.has(cell)),
    pieces: state.pieces.map((piece) => piece.id === move.pieceId ? { ...piece, used: false } : piece),
    moves: Math.max(0, state.moves - 1),
    history: state.history.slice(0, -1)
  };
}

export function solveBoard(board: Board): GameState {
  let state = createGame(board);
  board.solution.forEach((placement, index) => {
    const piece = state.pieces.find((candidate) => !candidate.used && candidate.kind === placement.kind);
    if (!piece) throw new Error(`Missing ${placement.kind} at solution step ${index}`);
    while (piece.rotation !== placement.rotation) {
      state = rotatePiece(state, piece.id);
      piece.rotation = state.pieces.find((candidate) => candidate.id === piece.id)?.rotation ?? piece.rotation;
    }
    state = placePiece(state, board, piece.id, placement.anchor);
  });
  return state;
}
