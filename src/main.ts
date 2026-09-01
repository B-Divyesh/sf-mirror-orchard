import '@fontsource-variable/fraunces/wght.css';
import '@fontsource-variable/manrope/wght.css';
import './styles.css';
import {
  AXIS,
  BOARD_SIZE,
  archiveBoard,
  cellKey,
  createGame,
  parseCell,
  placePiece,
  reflectedCells,
  rotatePiece,
  seededBoard,
  undoMove,
  type Board,
  type Cell,
  type GameState,
  type PieceKind
} from './game/core';
import { playTone } from './audio';
import { discardDemo, loadData, resetDemo, saveData } from './storage';

const appRoot = document.querySelector<HTMLDivElement>('#app');
if (!appRoot) throw new Error('App root is missing.');
const app: HTMLDivElement = appRoot;

interface ActiveGame {
  board: Board;
  state: GameState;
  selectedPieceId: string;
  demo: boolean;
}

let activeGame: ActiveGame | null = null;
let announcement = '';
let storageWarning = '';
function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character] ?? character);
}

function leafMark(): string {
  return `<svg class="leaf-mark" viewBox="0 0 42 42" aria-hidden="true">
    <path d="M21 37V17M21 25C15 25 9 21 8 13c8-1 13 2 13 8M21 19c1-8 6-12 14-11 0 8-6 13-14 13"/>
    <path class="mark-axis" d="M4 37h34"/>
  </svg>`;
}

function routeLink(path: string, label: string, className = ''): string {
  const accessibleName = className.includes('wordmark') ? 'aria-label="Mirror Orchard home"' : '';
  return `<a href="${path}" data-route class="${className}" ${accessibleName}>${label}</a>`;
}

function shell(main: string, demo = false): string {
  const network = navigator.onLine ? '' : '<p class="network-note" role="status">You are offline. Saved boards remain playable.</p>';
  const demoBanner = demo ? `<aside class="demo-banner" aria-label="Demo controls">
      <span><strong>Demo</strong> — sample data, nothing is saved</span>
      <span class="demo-actions"><button type="button" data-action="reset-demo">Reset demo</button>${routeLink('/play/archive/1', 'Start for real', 'text-link')}</span>
    </aside>` : '';
  return `
    <a class="skip-link" href="#main">Skip to game</a>
    <div class="site-shell ${demo ? 'is-demo' : ''}">
      ${demoBanner}
      ${network}
      <header class="site-header">
        ${routeLink(demo ? '/demo' : '/', `${leafMark()}<span>Mirror Orchard</span>`, 'wordmark')}
        <nav aria-label="Primary navigation">
          ${routeLink(demo ? '/archive?demo=1' : '/archive', 'Archive')}
          ${routeLink(demo ? '/daily?demo=1' : '/daily', 'Daily')}
          ${routeLink(demo ? '/seeds?demo=1' : '/seeds', 'Seeds')}
          ${routeLink('/demo', 'Demo')}
        </nav>
      </header>
      ${main}
      <footer class="site-footer">
        <p><strong>Mirror Orchard.</strong> Plant reflected branch puzzles at your pace.</p>
        <nav aria-label="Footer navigation">${routeLink(demo ? '/privacy?demo=1' : '/privacy', 'Privacy')}${routeLink(demo ? '/terms?demo=1' : '/terms', 'Terms')}<a href="https://sociobot.in" rel="external">Built by Param Factory <span class="sr-only">(external site)</span></a></nav>
        <p class="build-note">Version 1.0 · Landscape generated for this game with the factory image model.</p>
      </footer>
    </div>
    <div class="sr-only" aria-live="polite" aria-atomic="true">${escapeHtml(announcement)}</div>`;
}

function setMetadata(title: string, description: string, path = location.pathname): void {
  document.title = title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute('content', title);
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute('content', description);
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')?.setAttribute('content', `https://mirror-orchard.sociobot.in${path}`);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')?.setAttribute('content', title);
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')?.setAttribute('content', description);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', `https://mirror-orchard.sociobot.in${path}`);
}

function previewBoard(): string {
  const board = archiveBoard(1);
  const targets = new Set(board.target);
  return `<div class="preview-board" role="img" aria-label="Preview of a symmetric planting board">
    ${Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, index) => {
      const key = cellKey({ col: index % BOARD_SIZE, row: Math.floor(index / BOARD_SIZE) });
      return `<span class="preview-plot ${targets.has(key) ? 'is-target' : ''} ${index % BOARD_SIZE === AXIS ? 'is-axis' : ''}"></span>`;
    }).join('')}
  </div>`;
}

function landingPage(): string {
  setMetadata('Mirror Orchard — Learn a symmetry puzzle', 'Learn mirrored planting through 40 teaching boards, a daily challenge, and reproducible personal seeds.', '/');
  const main = `<main id="main" class="landing">
    <section class="hero" aria-labelledby="home-title">
      <picture class="hero-scene">
        <source media="(max-width: 640px)" srcset="/art/orchard-landscape-mobile.webp" />
        <img src="/art/orchard-landscape.webp" width="1440" height="960" alt="Glass trees reflect across a narrow canal, showing the game’s mirror rule." fetchpriority="high" decoding="async" />
      </picture>
      <div class="hero-copy glass-plate">
        <p class="eyebrow">40 teaching boards · one daily puzzle</p>
        <h1 id="home-title">Learn a symmetry puzzle at your pace</h1>
        <p class="hero-lead">For visual puzzle players who want practice boards before the daily challenge.</p>
        <div class="hero-action">
          ${routeLink('/demo', 'Try it with sample data', 'primary-action')}
          <span>Opens teaching board 3 with two boards complete.</span>
        </div>
        <ul class="plain-facts" aria-label="Key facts">
          <li><strong>40</strong> teaching boards</li>
          <li>Works offline after your first visit</li>
          <li>Free. No account.</li>
        </ul>
      </div>
      <div class="hero-board glass-plate">
        <div class="mini-board-head"><span>Teaching board 1</span><span>3 branches</span></div>
        ${previewBoard()}
        <p>Choose a branch. Plant its reflected pair.</p>
      </div>
    </section>
    <section class="landing-section live-preview" aria-labelledby="play-options">
      <div>
        <p class="eyebrow">Choose your pace</p>
        <h2 id="play-options">Every board stays open</h2>
        <p>Start with a short lesson, replay today’s board, or enter a seed. No puzzle expires.</p>
      </div>
      <div class="route-strips">
        ${routeLink('/archive', '<span><b>Teaching archive</b><small>40 ordered boards</small></span><span aria-hidden="true">01—40 →</span>')}
        ${routeLink('/daily', '<span><b>Daily puzzle</b><small>The same seed for everyone today</small></span><span aria-hidden="true">Today →</span>')}
        ${routeLink('/seeds', '<span><b>Personal seeds</b><small>Replay any word or phrase</small></span><span aria-hidden="true">Type one →</span>')}
      </div>
    </section>
    <section class="landing-section how" aria-labelledby="how-title">
      <div class="section-heading"><p class="eyebrow">How it works</p><h2 id="how-title">Fill the glowing soil in three steps</h2></div>
      <ol>
        <li><span>1</span><div><h3>Choose a branch</h3><p>The tray shows each branch you can use once.</p></div></li>
        <li><span>2</span><div><h3>Plant one side</h3><p>Its reflected branch grows across the center channel.</p></div></li>
        <li><span>3</span><div><h3>Fill the pattern</h3><p>Use every branch without crossing the glowing edge.</p></div></li>
      </ol>
    </section>
    <section class="landing-section limits" aria-labelledby="privacy-title">
      <div><p class="eyebrow">Clear limits</p><h2 id="privacy-title">Your play stays on this device</h2></div>
      <div><p>The game stores completed boards, open runs, settings, and recent seeds in your browser.</p><p>There are no accounts, ads, leaderboards, payments, or third-party scripts.</p></div>
    </section>
  </main>`;
  return shell(main);
}

function archivePage(demo = false): string {
  setMetadata('Teaching archive — Mirror Orchard', 'Open any of 40 ordered symmetry teaching boards.', '/archive');
  const data = loadData(demo);
  const items = Array.from({ length: 40 }, (_, index) => {
    const level = index + 1;
    const board = archiveBoard(level);
    const complete = data.completed.includes(level);
    const href = demo ? `/demo?board=${level}` : `/play/archive/${level}`;
    return `<li>${routeLink(href, `<span class="archive-number">${String(level).padStart(2, '0')}</span><span><b>${escapeHtml(board.title)}</b><small>${complete ? `Complete · best ${data.bestMoves[board.id] ?? board.inventory.length} moves` : board.instruction}</small></span><span class="archive-state">${complete ? '✓ Complete' : 'Play →'}</span>`)}</li>`;
  }).join('');
  return shell(`<main id="main" class="page-wrap archive-page">
    <header class="page-intro"><p class="eyebrow">Always open</p><h1 tabindex="-1">Learn with 40 teaching boards</h1><p>Open any board. The early boards teach one rule at a time.</p></header>
    <div class="archive-summary"><span><b>${data.completed.length}</b> of 40 complete</span><span>Short, turn-based boards</span></div>
    <ol class="archive-list">${items}</ol>
  </main>`, demo);
}

function seedPage(demo = false): string {
  setMetadata('Personal seeds — Mirror Orchard', 'Enter a word or phrase to create a reproducible mirrored orchard.', '/seeds');
  const data = loadData(demo);
  const recent = data.recentSeeds.length
    ? `<ul class="seed-list">${data.recentSeeds.map((seed) => `<li>${routeLink(`/play/seed/${encodeURIComponent(seed)}${demo ? '?demo=1' : ''}`, `<span>${escapeHtml(seed)}</span><span>Replay →</span>`)}</li>`).join('')}</ul>`
    : '<div class="empty-state"><p>Your replayed seeds will appear here.</p><p>Enter a word above to make the first one.</p></div>';
  return shell(`<main id="main" class="page-wrap seed-page">
    <header class="page-intro"><p class="eyebrow">Reproducible boards</p><h1 tabindex="-1">Grow a puzzle from any seed</h1><p>The same letters always make the same board and branch tray.</p></header>
    <form class="seed-form" data-seed-form>
      <label for="seed-input">Seed word or phrase</label>
      <div><input id="seed-input" name="seed" required maxlength="48" autocomplete="off" value="mint-window" /><button class="primary-action" type="submit">Plant this seed</button></div>
      <p id="seed-help">Use 1–48 letters, numbers, spaces, or dashes.</p>
    </form>
    <section aria-labelledby="recent-seeds"><h2 id="recent-seeds">Recent seeds</h2>${recent}</section>
  </main>`, demo);
}

function pieceGlyph(kind: PieceKind): string {
  const cells = kind === 'bud' ? [4] : kind === 'twig' ? [3, 4] : [1, 3, 4];
  return `<span class="piece-glyph" aria-hidden="true">${Array.from({ length: 9 }, (_, i) => `<i class="${cells.includes(i) ? 'on' : ''}"></i>`).join('')}</span>`;
}

function cellLabel(board: Board, state: GameState, col: number, row: number): string {
  const key = cellKey({ col, row });
  const side = col === AXIS ? 'center channel' : col < AXIS ? 'left side' : 'right side';
  const condition = board.stones.includes(key) ? 'glass stone' : state.filled.includes(key) ? 'planted' : board.target.includes(key) ? 'glowing soil, empty' : 'unmarked soil';
  return `Column ${col + 1}, row ${row + 1}, ${side}, ${condition}`;
}

function boardMarkup(board: Board, state: GameState): string {
  const target = new Set(board.target);
  const filled = new Set(state.filled);
  const stones = new Set(board.stones);
  return `<div class="game-board" role="grid" aria-label="Seven by seven mirrored planting board" data-fingerprint="${escapeHtml(board.fingerprint)}">
    ${Array.from({ length: BOARD_SIZE }, (_, row) => `<div class="board-row" role="row">${Array.from({ length: BOARD_SIZE }, (_cell, col) => {
        const key = cellKey({ col, row });
        const classes = ['plot', col === AXIS ? 'axis-plot' : '', target.has(key) ? 'target-plot' : '', filled.has(key) ? 'filled-plot' : '', stones.has(key) ? 'stone-plot' : ''].filter(Boolean).join(' ');
        return `<button type="button" role="gridcell" class="${classes}" data-cell="${key}" aria-label="${cellLabel(board, state, col, row)}" ${state.phase !== 'playing' ? 'disabled' : ''}><span class="soil-mark"></span>${filled.has(key) ? leafMark() : ''}</button>`;
      }).join('')}</div>`).join('')}
  </div>`;
}

function nextAction(board: Board, demo: boolean): string {
  if (board.id.startsWith('archive-')) {
    const next = Math.min(40, board.level + 1);
    if (board.level === 40) return routeLink(demo ? '/demo?board=1' : '/archive', 'View all teaching boards', 'primary-action');
    return routeLink(demo ? `/demo?board=${next}` : `/play/archive/${next}`, `Plant board ${next}`, 'primary-action');
  }
  return '<button type="button" class="primary-action" data-action="restart">Replay this puzzle</button>';
}

function endPanel(game: ActiveGame): string {
  const { board, state, demo } = game;
  if (state.phase === 'playing') return '';
  if (state.phase === 'paused') return `<div class="game-overlay" role="dialog" aria-modal="true" aria-labelledby="pause-title">
    <div><p class="eyebrow">Board paused</p><h2 id="pause-title" tabindex="-1">Your planting is saved</h2><p>Resume when you are ready.</p><button class="primary-action" type="button" data-action="resume">Resume board</button><button type="button" data-action="restart">Restart board</button></div>
  </div>`;
  if (state.phase === 'lost') return `<div class="game-overlay" role="dialog" aria-modal="true" aria-labelledby="lost-title">
    <div><p class="eyebrow">No dew left</p><h2 id="lost-title" tabindex="-1">This orchard withered</h2><p>Restart with a full tray and three dew drops.</p><button class="primary-action" type="button" data-action="restart">Restart board</button></div>
  </div>`;
  return `<div class="game-overlay win-overlay" role="dialog" aria-modal="true" aria-labelledby="win-title">
    <div><p class="eyebrow">Pattern complete</p><h2 id="win-title" tabindex="-1">The orchard is mirrored</h2><dl><div><dt>Moves</dt><dd>${state.moves}</dd></div><div><dt>Dew left</dt><dd>${state.dew} of 3</dd></div><div><dt>Seed</dt><dd>${escapeHtml(board.seed.replace(/:v1$/, ''))}</dd></div></dl>${nextAction(board, demo)}<button type="button" data-action="restart">Replay this board</button></div>
  </div>`;
}

function gamePage(board: Board, demo: boolean): string {
  const data = loadData(demo);
  let state = data.runs[board.id];
  if (!state || state.boardId !== board.id || state.pieces.length !== board.inventory.length) {
    state = createGame(board);
    if (demo && board.id === 'archive-3') {
      const sample = board.solution[0];
      const piece = state.pieces.find((candidate) => candidate.kind === sample.kind);
      if (piece) {
        for (let turn = 0; turn < sample.rotation; turn += 1) state = rotatePiece(state, piece.id);
        state = placePiece(state, board, piece.id, sample.anchor);
      }
    }
  }
  const selectedPiece = state.pieces.find((piece) => piece.id === activeGame?.selectedPieceId && !piece.used)
    ?? state.pieces.find((piece) => !piece.used)
    ?? state.pieces[0];
  activeGame = { board, state, selectedPieceId: selectedPiece.id, demo };
  const daily = board.id.startsWith('daily-');
  const seed = board.id.startsWith('seed-');
  const title = demo ? 'Demo — Mirror Orchard' : daily ? 'Daily puzzle — Mirror Orchard' : seed ? 'Personal seed — Mirror Orchard' : `${board.title} — Mirror Orchard`;
  setMetadata(title, board.instruction, location.pathname);
  document.documentElement.classList.toggle('calm-motion', data.settings.calmMotion);
  const available = state.pieces.filter((piece) => !piece.used).length;
  const boardName = demo ? `Try teaching board ${board.level}` : daily ? 'Plant today’s mirrored orchard' : seed ? 'Plant your seeded orchard' : `Plant teaching board ${board.level}`;
  const tray = state.pieces.map((piece, index) => `<button type="button" class="piece-card ${piece.id === selectedPiece.id ? 'is-selected' : ''} turn-${piece.rotation}" data-piece-id="${piece.id}" data-piece-kind="${piece.kind}" aria-pressed="${piece.id === selectedPiece.id}" ${piece.used || state.phase !== 'playing' ? 'disabled' : ''}>
    <span class="piece-number">${index + 1}</span>${pieceGlyph(piece.kind)}<span>${piece.kind === 'bud' ? 'Bud' : piece.kind === 'twig' ? 'Twig' : 'Corner'}</span>${piece.used ? '<small>Planted</small>' : ''}
  </button>`).join('');
  const main = `<main id="main" class="game-page">
    <header class="game-heading">
      <div><p class="eyebrow">${daily ? 'Daily seed' : seed ? 'Personal seed' : `Lesson ${board.level} of 40`}</p><h1 tabindex="-1">${escapeHtml(boardName)}</h1><p>${escapeHtml(board.instruction)}</p></div>
      <div class="game-readout"><span><b>${state.dew}</b> dew left</span><span><b>${state.moves}</b> moves</span><span><b>${available}</b> branches</span></div>
    </header>
    ${storageWarning ? `<p class="error-note" role="alert">${escapeHtml(storageWarning)}</p>` : ''}
    <section class="game-stage" aria-label="Current puzzle">
      <div class="board-frame">
        <div class="mirror-labels" aria-hidden="true"><span>Plant</span><span>Mirror channel</span><span>Reflection</span></div>
        ${boardMarkup(board, state)}
        ${endPanel(activeGame)}
      </div>
      <aside class="game-tools" aria-label="Branch tray and controls">
        <div class="tray-heading"><div><p class="eyebrow">Branch tray</p><h2>Choose one branch</h2></div><span>${available} left</span></div>
        <div class="piece-tray">${tray}</div>
        <div class="tool-actions">
          <button type="button" data-action="rotate" ${state.phase !== 'playing' || selectedPiece.used ? 'disabled' : ''}><span aria-hidden="true">↻</span> Rotate <kbd>R</kbd></button>
          <button type="button" data-action="undo" ${state.history.length === 0 || state.phase === 'lost' ? 'disabled' : ''}><span aria-hidden="true">↶</span> Undo <kbd>Z</kbd></button>
          <button type="button" data-action="pause" ${state.phase !== 'playing' ? 'disabled' : ''}><span aria-hidden="true">Ⅱ</span> Pause <kbd>Esc</kbd></button>
        </div>
        <details class="game-help"><summary>Keyboard and rules</summary><p>Use arrows to move between plots. Press 1–9 to choose a branch. Press R to rotate, then Enter to plant.</p><p>A bad placement spends one dew drop. Undo removes your latest branch.</p></details>
        <div class="setting-row"><button type="button" data-action="sound" aria-pressed="${data.settings.sound}">Sound ${data.settings.sound ? 'on' : 'off'}</button><button type="button" data-action="calm-motion" aria-pressed="${data.settings.calmMotion}">Calm motion ${data.settings.calmMotion ? 'on' : 'off'}</button></div>
      </aside>
    </section>
  </main>`;
  return shell(main, demo);
}

function legalPage(kind: 'privacy' | 'terms', demo = false): string {
  if (kind === 'privacy') {
    setMetadata('Privacy — Mirror Orchard', 'How Mirror Orchard stores game progress in your browser.', '/privacy');
    return shell(`<main id="main" class="page-wrap legal-page"><header class="page-intro"><p class="eyebrow">Last updated 1 September 2026</p><h1 tabindex="-1">Privacy</h1><p>Mirror Orchard keeps your play private by default.</p></header>
      <section><h2>What the game stores</h2><p>Your browser stores completed boards, open runs, settings, and recent seeds. This data stays on your device.</p></section>
      <section><h2>Network requests</h2><p>The game loads its own code, fonts, and images from this site. It uses no accounts, advertising, analytics, or third-party scripts.</p></section>
      <section><h2>Demo data</h2><p>The demo uses a separate browser storage key. Reset demo or start for real to discard it.</p></section>
      <section><h2>Delete your data</h2><p>Clear this site’s storage in your browser settings. This removes all progress and settings.</p></section>
    </main>`, demo);
  }
  setMetadata('Terms — Mirror Orchard', 'Terms for using the free Mirror Orchard browser game.', '/terms');
  return shell(`<main id="main" class="page-wrap legal-page"><header class="page-intro"><p class="eyebrow">Last updated 1 September 2026</p><h1 tabindex="-1">Terms</h1><p>You may play Mirror Orchard for free.</p></header>
    <section><h2>Use</h2><p>Use the game for personal, educational, or recreational play. Do not disrupt the site or misuse its files.</p></section>
    <section><h2>Availability</h2><p>The game is provided as available. Features and teaching boards may change in later versions.</p></section>
    <section><h2>Your progress</h2><p>Progress is stored in your browser. Clearing browser data removes it, so keep any seed words you want to replay.</p></section>
    <section><h2>License</h2><p>The source code is available under the MIT License in the project repository.</p></section>
  </main>`, demo);
}

function notFoundPage(): string {
  setMetadata('Page not found — Mirror Orchard', 'Return to the Mirror Orchard teaching archive.', location.pathname);
  return shell(`<main id="main" class="page-wrap not-found"><div class="lost-mark">${leafMark()}<span>404</span></div><p class="eyebrow">This path has no planting bed</p><h1 tabindex="-1">Page not found</h1><p>The link may be old, or the address may have a typing mistake.</p>${routeLink('/archive', 'Open the teaching archive', 'primary-action')}</main>`);
}

function currentBoardFromRoute(): { board: Board; demo: boolean } | null {
  const path = location.pathname;
  const demo = new URLSearchParams(location.search).get('demo') === '1';
  if (path === '/demo') {
    const requested = Number(new URLSearchParams(location.search).get('board') ?? 3);
    return { board: archiveBoard(Number.isFinite(requested) ? requested : 3), demo: true };
  }
  const archiveMatch = path.match(/^\/play\/archive\/(\d+)$/);
  if (archiveMatch) {
    const level = Number(archiveMatch[1]);
    if (level < 1 || level > 40) return null;
    return { board: archiveBoard(level), demo };
  }
  if (path === '/daily') {
    const date = new Date().toISOString().slice(0, 10);
    return { board: seededBoard(date, 'daily'), demo };
  }
  const seedMatch = path.match(/^\/play\/seed\/(.+)$/);
  if (seedMatch) {
    try {
      return { board: seededBoard(decodeURIComponent(seedMatch[1])), demo };
    } catch {
      return null;
    }
  }
  return null;
}

function render(focusHeading = true): void {
  announcement = '';
  activeGame = null;
  let path = location.pathname;
  const demo = new URLSearchParams(location.search).get('demo') === '1';
  if (path === '/' && demo) {
    history.replaceState({}, '', '/demo');
    path = '/demo';
  }
  const game = currentBoardFromRoute();
  if (game) app.innerHTML = gamePage(game.board, game.demo);
  else if (path === '/') app.innerHTML = landingPage();
  else if (path === '/archive') app.innerHTML = archivePage(demo);
  else if (path === '/seeds') app.innerHTML = seedPage(demo);
  else if (path === '/privacy') app.innerHTML = legalPage('privacy', demo);
  else if (path === '/terms') app.innerHTML = legalPage('terms', demo);
  else app.innerHTML = notFoundPage();
  bindPage();
  if (focusHeading && path !== '/') requestAnimationFrame(() => document.querySelector<HTMLElement>('h1')?.focus());
}

function navigate(path: string): void {
  history.pushState({}, '', path);
  scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  render(true);
}

function persistGame(): void {
  if (!activeGame) return;
  const data = loadData(activeGame.demo);
  data.runs[activeGame.board.id] = activeGame.state;
  if (activeGame.state.phase === 'won' && activeGame.board.id.startsWith('archive-')) {
    if (!data.completed.includes(activeGame.board.level)) data.completed.push(activeGame.board.level);
    const old = data.bestMoves[activeGame.board.id];
    data.bestMoves[activeGame.board.id] = old ? Math.min(old, activeGame.state.moves) : activeGame.state.moves;
  }
  if (!saveData(activeGame.demo, data)) storageWarning = 'Progress could not be saved. Check this browser’s storage settings.';
}

function rerenderGame(focusCell?: string): void {
  const selected = activeGame?.selectedPieceId;
  const state = activeGame?.state;
  const board = activeGame?.board;
  const demo = activeGame?.demo;
  if (!state || !board || demo === undefined) return;
  const data = loadData(demo);
  data.runs[board.id] = state;
  saveData(demo, data);
  app.innerHTML = gamePage(board, demo);
  if (activeGame) activeGame.selectedPieceId = selected ?? activeGame.selectedPieceId;
  bindPage();
  requestAnimationFrame(() => {
    if (state.phase !== 'playing') document.querySelector<HTMLElement>('.game-overlay h2')?.focus();
    else if (focusCell) document.querySelector<HTMLElement>(`[data-cell="${focusCell}"]`)?.focus();
  });
}

function announce(message: string): void {
  announcement = message;
  const live = document.querySelector<HTMLElement>('[aria-live="polite"]');
  if (live) live.textContent = message;
}

function updatePreview(anchor: Cell): void {
  document.querySelectorAll('.plot.preview, .plot.preview-invalid').forEach((plot) => plot.classList.remove('preview', 'preview-invalid'));
  if (!activeGame || activeGame.state.phase !== 'playing') return;
  const piece = activeGame.state.pieces.find((candidate) => candidate.id === activeGame?.selectedPieceId);
  if (!piece) return;
  const cells = reflectedCells(piece.kind, piece.rotation, anchor);
  if (!cells) return;
  const target = new Set(activeGame.board.target);
  const filled = new Set(activeGame.state.filled);
  const valid = cells.every((cell) => target.has(cellKey(cell)) && !filled.has(cellKey(cell)));
  cells.forEach((cell) => document.querySelector(`[data-cell="${cellKey(cell)}"]`)?.classList.add(valid ? 'preview' : 'preview-invalid'));
}

function placeAt(key: string): void {
  if (!activeGame) return;
  const before = activeGame.state;
  const after = placePiece(before, activeGame.board, activeGame.selectedPieceId, parseCell(key));
  activeGame.state = after;
  const valid = after.moves > before.moves;
  playTone(after.phase === 'won' ? 'win' : valid ? 'plant' : 'error', loadData(activeGame.demo).settings.sound);
  if (after.phase === 'won') announce(`Pattern complete in ${after.moves} moves with ${after.dew} dew left.`);
  else if (after.phase === 'lost') announce('No dew left. The orchard withered. Restart to try again.');
  else if (valid) announce('Branch planted with its reflection.');
  else announce(`That branch does not fit. ${after.dew} dew left.`);
  persistGame();
  rerenderGame(key);
}

function performAction(action: string): void {
  if (action === 'reset-demo') {
    resetDemo();
    announcement = 'Demo reset to its starting sample.';
    render(false);
    return;
  }
  if (!activeGame) return;
  const data = loadData(activeGame.demo);
  if (action === 'rotate') {
    activeGame.state = rotatePiece(activeGame.state, activeGame.selectedPieceId);
    announce('Selected branch rotated.');
  } else if (action === 'undo') {
    activeGame.state = undoMove(activeGame.state);
    announce('Latest branch returned to the tray.');
  } else if (action === 'pause') {
    activeGame.state = { ...activeGame.state, phase: 'paused' };
  } else if (action === 'resume') {
    activeGame.state = { ...activeGame.state, phase: 'playing' };
  } else if (action === 'restart') {
    activeGame.state = createGame(activeGame.board);
    activeGame.selectedPieceId = activeGame.state.pieces[0].id;
    announce('Board restarted with three dew drops.');
  } else if (action === 'sound') {
    data.settings.sound = !data.settings.sound;
    saveData(activeGame.demo, data);
    if (data.settings.sound) playTone('plant', true);
  } else if (action === 'calm-motion') {
    data.settings.calmMotion = !data.settings.calmMotion;
    saveData(activeGame.demo, data);
  }
  persistGame();
  rerenderGame();
}

function bindPage(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[data-route]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const leavingDemo = activeGame?.demo || location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1';
      if (leavingDemo && link.getAttribute('href') === '/play/archive/1') discardDemo();
      navigate(link.getAttribute('href') ?? '/');
    });
  });
  document.querySelectorAll<HTMLButtonElement>('[data-action]').forEach((button) => button.addEventListener('click', () => performAction(button.dataset.action ?? '')));
  document.querySelectorAll<HTMLButtonElement>('[data-piece-id]').forEach((button) => button.addEventListener('click', () => {
    if (!activeGame || !button.dataset.pieceId) return;
    activeGame.selectedPieceId = button.dataset.pieceId;
    document.querySelectorAll('[data-piece-id]').forEach((item) => {
      item.classList.toggle('is-selected', item === button);
      item.setAttribute('aria-pressed', item === button ? 'true' : 'false');
    });
    announce(`${button.textContent?.trim() ?? 'Branch'} selected.`);
  }));
  document.querySelectorAll<HTMLButtonElement>('[data-cell]').forEach((button) => {
    button.addEventListener('click', () => placeAt(button.dataset.cell ?? ''));
    button.addEventListener('pointerenter', () => updatePreview(parseCell(button.dataset.cell ?? '0,0')));
    button.addEventListener('focus', () => updatePreview(parseCell(button.dataset.cell ?? '0,0')));
    button.addEventListener('keydown', (event) => {
      const key = button.dataset.cell ?? '0,0';
      const { col, row } = parseCell(key);
      const delta: Record<string, Cell> = {
        ArrowLeft: { col: -1, row: 0 }, ArrowRight: { col: 1, row: 0 }, ArrowUp: { col: 0, row: -1 }, ArrowDown: { col: 0, row: 1 }
      };
      if (delta[event.key]) {
        event.preventDefault();
        const next = { col: Math.max(0, Math.min(6, col + delta[event.key].col)), row: Math.max(0, Math.min(6, row + delta[event.key].row)) };
        document.querySelector<HTMLElement>(`[data-cell="${cellKey(next)}"]`)?.focus();
      }
    });
  });
  const seedForm = document.querySelector<HTMLFormElement>('[data-seed-form]');
  seedForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = seedForm.elements.namedItem('seed') as HTMLInputElement;
    const seed = input.value.trim();
    if (!seed) {
      input.setCustomValidity('Enter a seed word or phrase.');
      input.reportValidity();
      return;
    }
    input.setCustomValidity('');
    const demo = new URLSearchParams(location.search).get('demo') === '1';
    const data = loadData(demo);
    data.recentSeeds = [seed, ...data.recentSeeds.filter((item) => item !== seed)].slice(0, 8);
    saveData(demo, data);
    navigate(`/play/seed/${encodeURIComponent(seed)}${demo ? '?demo=1' : ''}`);
  });
}

window.addEventListener('popstate', () => render(true));
window.addEventListener('online', () => render(false));
window.addEventListener('offline', () => render(false));
document.addEventListener('keydown', (event) => {
  if (!activeGame || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
  if (/^[1-9]$/.test(event.key)) {
    const piece = activeGame.state.pieces[Number(event.key) - 1];
    if (piece && !piece.used) {
      activeGame.selectedPieceId = piece.id;
      rerenderGame();
      document.querySelector<HTMLElement>(`[data-piece-id="${piece.id}"]`)?.focus();
    }
  } else if (event.key.toLowerCase() === 'r') {
    event.preventDefault();
    performAction('rotate');
  } else if (event.key.toLowerCase() === 'z') {
    event.preventDefault();
    performAction('undo');
  } else if (event.key === 'Escape') {
    event.preventDefault();
    performAction(activeGame.state.phase === 'paused' ? 'resume' : 'pause');
  }
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && activeGame?.state.phase === 'playing') {
    activeGame.state = { ...activeGame.state, phase: 'paused' };
    persistGame();
  }
});

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).catch(() => {
    // The game remains usable online when service workers are unavailable.
  }));
}

render(false);

declare global {
  interface Window {
    __mirrorOrchard?: { getActiveGame: () => ActiveGame | null };
  }
}
window.__mirrorOrchard = { getActiveGame: () => activeGame };
