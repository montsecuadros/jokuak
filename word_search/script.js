// Basque "sopa de letras" (Letra Zopa) for kids
// Word search: find listed words in the grid by selecting straight lines

const levels = [
  // 1. Very Easy - Short words (2-4 letters)
  { size: 8,  words: ["UR","SU","ETA","BAI","EZ","OGI","HAR","ILO","JAN","EDAN","LO","HIRU"] },
  // 2. Easy - Family basics (3-5 letters)
  { size: 9,  words: ["AMA","AITA","ETXE","SEME","ALABA","AHAL","LAGUN","MUTIL","NESKA","GURE","ZURE","NIRE"] },
  // 3. Easy - Simple animals (4-6 letters)
  { size: 10,  words: ["KATU","TXORI","BEHI","ARDI","ZALDI","TXAKUR","ARRAIN","PITXI","OTSO","AZERIA","HARTZ","ASTOA"] },
  // 4. Easy/Medium - Colors & Basic (4-6 letters)
  { size: 10,  words: ["GORRI","URDIN","BERDE","HORI","BELTZ","ZURI","LARANJA","ARROSA","GRISA","MOREA","MARROIA","ORE"] },
  // 5. Medium - Nature (4-7 letters)
  { size: 11,  words: ["MENDI","IBAIA","ITSASO","BASOA","ELUR","EURI","LORE","ZUHAITZ","HARRI","LURRA","AIREAN","LANDA"] },
  // 6. Medium - Weather (4-8 letters)
  { size: 11,  words: ["EGUZKI","ILARGI","HAIZEA","HODEI","LANBRO","IZOTZA","EKAITZ","TRUMOI","TXINGORRA","EURIA","HOTZA","BEROA"] },
  // 7. Medium - Food (4-8 letters)
  { size: 12,  words: ["OGIA","ESNEA","ARROZA","PASTA","FRUTA","GAZTA","HARAGIA","ARRAUTZA","TOMATE","PATATA","PERRETXIKO","BABARRUN"] },
  // 8. Medium - Body parts (4-8 letters)
  { size: 12,  words: ["BURUA","BEGIAK","ESKUA","OINA","SUDUR","AHOA","BELARRI","SORBALDA","BEHATZ","HANKA","BIZKAR","LEPOA"] },
  // 9. Medium/Hard - More animals (5-10 letters)
  { size: 12, words: ["KATUA","TXAKURRA","AHATE","OILOA","UNTXIA","SAGUA","ELEFANTE","LEHOI","TIGRE","MERTXIKA","TXIMINO","EULIAK","ARMIARMA"] },
  // 10. Medium/Hard - School & Learning (5-10 letters)
  { size: 13, words: ["ESKOLA","IKASLE","LIBURU","ARKATZA","GELA","TAULA","IRAKASLEA","KOADERNO","PAPERAK","IRAKURRI","IDATZI","ZENBAKI"] },
  // 11. Hard - Extended family (4-8 letters)
  { size: 13, words: ["AMONA","AITONA","ANAIA","ARREBA","IZEBA","OSABA","LEHENGUSUA","ILOBA","FAMILIA","AURRA","GAZTE","NAGUSIA"] },
  // 12. Hard - Action verbs (4-9 letters)
  { size: 13, words: ["KORRIKA","DANTZA","SALTO","JAUZI","KANTU","JOLASTU","ESERI","ALTXATU","ITZULI","BOTA","HELDU","BIDALI"] },
  // 13. Hard - Transport (4-10 letters)
  { size: 14, words: ["AUTOA","BIZIKLETA","TRENA","HEGAZKINA","ONTZIA","AUTOBUSA","KAMIOIA","MOTOZIKLETA","METRO","TRANBIA","TAXIA","KARABANA","IBILGAILUA"] },
  // 14. Hard - Fruits & Vegetables (5-10 letters)
  { size: 14, words: ["SAGARRA","MADARIA","LIMOIA","PLATANOA","GEREZA","PIKUA","MAHATSA","AZENARIOA","PORRU","AZALOREA","BARATXURI","PEPINOA","PIPERRAK"] },
  // 15. Very Hard - Places (4-10 letters)
  { size: 14, words: ["MERKATUA","HONDARTZA","HIRIA","HERRIA","KALEA","PLAZA","ZUBIA","PARKEA","ELIZA","MUSEOA","ANTZOKIA","PORTUA","GASOLINDEGIA"] },
  // 16. Very Hard - Time & Seasons (3-10 letters)
  { size: 14, words: ["ORDU","ASTEA","HILABETE","URTEA","UDABERRI","UDA","UDAZKEN","NEGUA","EGUN","GAUA","GOIZA","ARRATSALDE","GABON"] },
  // 17. Very Hard - Numbers (2-10 letters)
  { size: 14, words: ["BAT","BI","LAU","BOST","SEI","ZAZPI","ZORTZI","BEDERATZI","HAMAR","EHUN","MILA","MILIOI","HAMABI"] },
  // 18. Expert - House & Objects (4-11 letters)
  { size: 15, words: ["LOGELA","SUKALDEA","KOMUNA","LEIHOA","ATEA","TEILATUA","HORMA","ZORUAK","ARMAIRUA","MAHAIA","AULKIA","OHE","ISPILUA","GILTZA"] },
  // 19. Expert - Activities & Sports (5-12 letters)
  { size: 15, words: ["FUTBOLA","SASKIBALOIA","IGERIKETA","TXIRRINDULA","PILOTA","JOLASA","TENISA","ESKIATZEA","KIROLAK","GIMNASIA","ATLETISMOA","KARATERA","JOKOA"] },
  // 20. Expert - Advanced vocabulary (5-13 letters)
  { size: 15, words: ["ORDENAGAILUA","TELEBISTA","MUSIKA","MARRAZKETA","TXOTXONGILO","ANTZERKIA","ZINEMA","LITERATURA","POESIA","MARGOLANA","ESKULTURA","ARTEA","SORTZAILEA","PINTURA"] },
];
let currentLevelIdx = 0;

const COLOR_PALETTE = [
  { bg: '#fff59d', outline: '#fbc02d' }, // yellow
  { bg: '#bbdefb', outline: '#1e88e5' }, // blue
  { bg: '#c8e6c9', outline: '#43a047' }, // green
  { bg: '#ffcdd2', outline: '#e53935' }, // red
  { bg: '#e1bee7', outline: '#8e24aa' }, // purple
  { bg: '#ffe0b2', outline: '#fb8c00' }  // orange
];

const DIRECTIONS = [
  { dr: 0, dc: 1 },   // →
  { dr: 1, dc: 0 },   // ↓
  { dr: 0, dc: -1 },  // ←
  { dr: -1, dc: 0 },  // ↑
  { dr: 1, dc: 1 },   // ↘
  { dr: 1, dc: -1 },  // ↙
  { dr: -1, dc: 1 },  // ↗
  { dr: -1, dc: -1 }  // ↖
];

function randomLetter() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

function buildPuzzle(p) {
  const n = p.size;
  const grid = Array.from({ length: n }, () => Array.from({ length: n }, () => null));
  const placements = []; // { word, cells: [{r,c}] }

  for (const raw of p.words) {
    const word = raw.toUpperCase();
    tryPlaceWord(grid, word, placements);
  }

  // Fill remaining with random letters, avoiding accidental word formations
  const words = p.words.map(w => w.toUpperCase());
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!grid[r][c]) {
        grid[r][c] = getSafeLetter(grid, r, c, n, words);
      }
    }
  }

  return { grid, placements };
}

// Get a letter that won't accidentally form any target words
function getSafeLetter(grid, r, c, n, words) {
  const maxAttempts = 20;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const letter = randomLetter();
    grid[r][c] = letter;
    
    // Check if this letter completes any unplaced words in any direction
    let formAccidentalWord = false;
    for (const dir of DIRECTIONS) {
      for (const word of words) {
        if (checkWordAt(grid, r, c, word, dir, n)) {
          formAccidentalWord = true;
          break;
        }
      }
      if (formAccidentalWord) break;
    }
    
    if (!formAccidentalWord) {
      return letter;
    }
  }
  // If we can't find a safe letter after many attempts, just return a random one
  return randomLetter();
}

// Check if a word appears at position going in a direction
function checkWordAt(grid, r, c, word, dir, n) {
  // Try all possible starting positions for this word that would include cell (r,c)
  for (let offset = 0; offset < word.length; offset++) {
    const startR = r - offset * dir.dr;
    const startC = c - offset * dir.dc;
    
    // Check if word fits from this start position
    let matches = true;
    for (let i = 0; i < word.length; i++) {
      const checkR = startR + i * dir.dr;
      const checkC = startC + i * dir.dc;
      
      if (checkR < 0 || checkR >= n || checkC < 0 || checkC >= n) {
        matches = false;
        break;
      }
      
      const cellValue = grid[checkR][checkC];
      if (cellValue !== null && cellValue !== word[i]) {
        matches = false;
        break;
      }
    }
    
    if (matches) {
      // Check if all letters of the word are present (not just fitting pattern)
      let allPresent = true;
      for (let i = 0; i < word.length; i++) {
        const checkR = startR + i * dir.dr;
        const checkC = startC + i * dir.dc;
        if (grid[checkR][checkC] !== word[i]) {
          allPresent = false;
          break;
        }
      }
      if (allPresent) return true;
    }
  }
  return false;
}

function tryPlaceWord(grid, word, placements) {
  const n = grid.length;
  for (let attempt = 0; attempt < 200; attempt++) {
    const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    const maxR = dir.dr === 1 ? n - word.length : n - 1;
    const minR = dir.dr === -1 ? word.length - 1 : 0;
    const maxC = dir.dc === 1 ? n - word.length : n - 1;
    const minC = dir.dc === -1 ? word.length - 1 : 0;

    const startR = Math.floor(Math.random() * (maxR - minR + 1)) + minR;
    const startC = Math.floor(Math.random() * (maxC - minC + 1)) + minC;

    // Check fit
    let ok = true;
    for (let i = 0; i < word.length && ok; i++) {
      const r = startR + i * dir.dr;
      const c = startC + i * dir.dc;
      const ch = grid[r][c];
      if (ch && ch !== word[i]) ok = false;
    }
    if (!ok) continue;

    // Place
    const cells = [];
    for (let i = 0; i < word.length; i++) {
      const r = startR + i * dir.dr;
      const c = startC + i * dir.dc;
      grid[r][c] = word[i];
      cells.push({ r, c });
    }
    placements.push({ word, cells, found: false });
    return true;
  }
  console.warn('Could not place word:', word);
  return false;
}

let cleanupRender = null;

function render(p) {
  const { grid, placements } = buildPuzzle(p);

  const gridEl = document.getElementById('grid');
  gridEl.style.setProperty('--size', p.size);
  gridEl.innerHTML = '';

  // UI state
  let isSelecting = false;
  let start = null; // {r,c}
  let selectedCells = []; // [{r,c,el}]
  let colorCursor = 0; // cycles through COLOR_PALETTE for each new selection
  let selectionColor = null; // {bg, outline} for current selection

  // Render grid
  const cellEls = Array.from({ length: p.size }, () => Array.from({ length: p.size }, () => null));
  for (let r = 0; r < p.size; r++) {
    for (let c = 0; c < p.size; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.r = String(r);
      cell.dataset.c = String(c);
      const letter = document.createElement('span');
      letter.className = 'letter';
      letter.textContent = grid[r][c];
      cell.appendChild(letter);
      gridEl.appendChild(cell);
      cellEls[r][c] = cell;
    }
  }

  // Overlay layer for selection and found highlights
  const overlayLayer = document.createElement('div');
  overlayLayer.className = 'overlay-layer';
  gridEl.appendChild(overlayLayer);
  let selectionOverlay = null;

  function getCellCenter(el) {
    const gr = gridEl.getBoundingClientRect();
    const cr = el.getBoundingClientRect();
    return {
      x: cr.left + cr.width / 2 - gr.left,
      y: cr.top + cr.height / 2 - gr.top,
      w: cr.width,
      h: cr.height,
    };
  }

  function drawPill(startEl, endEl, color) {
    const a = getCellCenter(startEl);
    const b = getCellCenter(endEl);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const length = Math.hypot(dx, dy) + a.w; // cover both endpoints
    const thickness = a.h * 0.6;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2;

    const pill = document.createElement('div');
    pill.className = 'selection-pill';
    pill.style.width = `${length}px`;
    pill.style.height = `${thickness}px`;
    pill.style.left = `${midX - length / 2}px`;
    pill.style.top = `${midY - thickness / 2}px`;
    pill.style.transform = `rotate(${angle}deg)`;
    if (color) {
      pill.style.background = color.bg;
      pill.style.borderColor = color.outline;
    }
    overlayLayer.appendChild(pill);
    return pill;
  }

  function drawSelectionOverlay(startEl, endEl) {
    if (selectionOverlay) selectionOverlay.remove();
    selectionOverlay = drawPill(startEl, endEl, selectionColor);
  }

  function addFoundOverlay(path) {
    if (!path.length) return;
    drawPill(path[0].el, path[path.length - 1].el, selectionColor);
  }

  // Render word list
  const wordListEl = document.getElementById('wordList');
  wordListEl.innerHTML = '';
  const wordToLi = new Map();
  for (const pl of placements) {
    const li = document.createElement('li');
    li.textContent = pl.word;
    wordListEl.appendChild(li);
    wordToLi.set(pl.word, li);
  }

  function clearSelection() {
    for (const it of selectedCells) {
      it.el.classList.remove('selecting', 'selecting-start', 'wrong');
      it.el.style.removeProperty('--sel-bg');
      it.el.style.removeProperty('--sel-outline');
    }
    if (selectionOverlay) { selectionOverlay.remove(); selectionOverlay = null; }
    selectedCells = [];
  }

  function computePath(from, to) {
    const dr = Math.sign(to.r - from.r);
    const dc = Math.sign(to.c - from.c);
    if (dr === 0 && dc === 0) return [];
    const stepsR = Math.abs(to.r - from.r);
    const stepsC = Math.abs(to.c - from.c);
    // Must be straight line (horizontal/vertical) or perfect diagonal
    if (!(dr === 0 || dc === 0 || stepsR === stepsC)) return [];
    const len = Math.max(stepsR, stepsC) + 1;
    const res = [];
    for (let i = 0; i < len; i++) {
      const r = from.r + i * dr;
      const c = from.c + i * dc;
      if (r < 0 || c < 0 || r >= p.size || c >= p.size) return [];
      res.push({ r, c, el: cellEls[r][c] });
    }
    return res;
  }

  function setSelectionPath(path) {
    // Use a rounded overlay pill instead of per-cell selection styling
    clearSelection();
    selectedCells = path;
    if (!path.length) return;
    const startEl = path[0].el;
    const endEl = path[path.length - 1].el;
    drawSelectionOverlay(startEl, endEl);
  }

  function sameCells(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i].r !== b[i].r || a[i].c !== b[i].c) return false;
    return true;
  }

  function checkSelection() {
    if (!selectedCells.length) return;
    for (const pl of placements) {
      if (pl.found) continue;
      const path1 = pl.cells;
      const path2 = [...pl.cells].reverse();
      if (sameCells(selectedCells, path1) || sameCells(selectedCells, path2)) {
        // Mark found
        pl.found = true;
        // Persist a rounded overlay for the whole word in the same color
        addFoundOverlay(selectedCells);
        // Mark cells as found (for accessibility/keyboard cues), but visual is dominated by overlay
        for (const it of selectedCells) {
          it.el.classList.remove('selecting', 'selecting-start');
          it.el.classList.add('found');
        }
        const li = wordToLi.get(pl.word);
        if (li) {
          li.classList.add('found');
          if (selectionColor) li.style.setProperty('--li-color', selectionColor.outline);
        }
        if (selectionOverlay) { selectionOverlay.remove(); selectionOverlay = null; }
        selectedCells = [];
        maybeDone();
        return true;
      }
    }
    // Not a valid word: briefly flash the selection pill in red
    if (selectionOverlay) {
      selectionOverlay.classList.add('wrong');
      setTimeout(() => {
        if (selectionOverlay) { selectionOverlay.remove(); selectionOverlay = null; }
        selectedCells = [];
      }, 500);
    } else {
      selectedCells = [];
    }
    return false;
  }

  function handleMouseDown(ev) {
    const cell = ev.target.closest('.cell');
    if (!cell) return;
    const r = Number(cell.dataset.r), c = Number(cell.dataset.c);
    isSelecting = true;
    selectionColor = COLOR_PALETTE[colorCursor % COLOR_PALETTE.length];
    colorCursor++;
    start = { r, c };
    setSelectionPath([{ r, c, el: cell }]);
  }

  function handleMouseMove(ev) {
    if (!isSelecting || !start) return;
    const el = document.elementFromPoint(ev.clientX, ev.clientY);
    const cell = el?.closest?.('.cell') || ev.target.closest?.('.cell');
    if (!cell) return;
    const r = Number(cell.dataset.r), c = Number(cell.dataset.c);
    const path = computePath(start, { r, c });
    if (path.length) setSelectionPath(path);
  }

  function handleMouseUp() {
    if (!isSelecting) return;
    isSelecting = false;
    checkSelection();
    start = null;
  }

  gridEl.addEventListener('mousedown', handleMouseDown);
  gridEl.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);

  // Provide cleanup for re-renders (remove listeners)
  if (cleanupRender) cleanupRender();
  cleanupRender = () => {
    gridEl.removeEventListener('mousedown', handleMouseDown);
    gridEl.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    gridEl.removeEventListener('touchstart', handleTouchStart, { passive: false });
    gridEl.removeEventListener('touchmove', handleTouchMove, { passive: false });
    window.removeEventListener('touchend', handleTouchEnd, { passive: false });
  };

  // Touch support
  function getCellFromTouch(ev) {
    const t = ev.touches?.[0] || ev.changedTouches?.[0];
    if (!t) return null;
    const el = document.elementFromPoint(t.clientX, t.clientY);
    return el?.closest?.('.cell') || null;
  }

  function handleTouchStart(ev) {
    ev.preventDefault();
    const cell = getCellFromTouch(ev) || ev.target.closest?.('.cell');
    if (!cell) return;
    const r = Number(cell.dataset.r), c = Number(cell.dataset.c);
    isSelecting = true;
    selectionColor = COLOR_PALETTE[colorCursor % COLOR_PALETTE.length];
    colorCursor++;
    start = { r, c };
    setSelectionPath([{ r, c, el: cell }]);
  }

  function handleTouchMove(ev) {
    if (!isSelecting || !start) return;
    ev.preventDefault();
    const cell = getCellFromTouch(ev);
    if (!cell) return;
    const r = Number(cell.dataset.r), c = Number(cell.dataset.c);
    const path = computePath(start, { r, c });
    if (path.length) setSelectionPath(path);
  }

  function handleTouchEnd(ev) {
    if (!isSelecting) return;
    ev.preventDefault();
    isSelecting = false;
    checkSelection();
    start = null;
  }

  gridEl.addEventListener('touchstart', handleTouchStart, { passive: false });
  gridEl.addEventListener('touchmove', handleTouchMove, { passive: false });
  window.addEventListener('touchend', handleTouchEnd, { passive: false });

  // Hint button only
  document.getElementById('hintBtn').onclick = () => {
    const remaining = placements.filter(p => !p.found);
    if (!remaining.length) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    const first = pick.cells[0];
    const el = cellEls[first.r][first.c];
    el.classList.add('hint');
    setTimeout(() => el.classList.remove('hint'), 1200);
  };

  document.getElementById('hintBtn').onclick = () => {
    const remaining = placements.filter(p => !p.found);
    if (!remaining.length) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    const first = pick.cells[0];
    const el = cellEls[first.r][first.c];
    el.classList.add('hint');
    setTimeout(() => el.classList.remove('hint'), 1200);
  };

  function showWinAndAdvance() {
    // Overlay message
    const msg = document.createElement('div');
    msg.style.position = 'absolute';
    msg.style.left = '50%';
    msg.style.top = '50%';
    msg.style.transform = 'translate(-50%, -50%)';
    msg.style.background = 'rgba(255,255,255,0.9)';
    msg.style.border = '2px solid #46b36b';
    msg.style.borderRadius = '12px';
    msg.style.padding = '12px 16px';
    msg.style.fontWeight = '600';
    msg.style.zIndex = '4';
    msg.textContent = 'Zorionak! Hurrengo jokora...';
    overlayLayer.appendChild(msg);

    setTimeout(() => {
      // Advance level
      currentLevelIdx = (currentLevelIdx + 1) % levels.length;
      renderCurrentLevel();
    }, 1100);
  }

  // After any successful word, check if finished
  function maybeDone() {
    if (placements.every(pl => pl.found)) {
      if (selectionOverlay) { selectionOverlay.remove(); selectionOverlay = null; }
      showWinAndAdvance();
    }
  }

  // Expose check after found
  maybeDone.bind(null);
}

function renderCurrentLevel() {
  const level = levels[currentLevelIdx] || levels[0];
  render(level);
  updateLevelDisplay();
}

function updateLevelDisplay() {
  const display = document.getElementById('levelDisplay');
  if (display) {
    display.textContent = `Maila ${currentLevelIdx + 1}/${levels.length}`;
  }
  
  const prevBtn = document.getElementById('prevLevelBtn');
  const nextBtn = document.getElementById('nextLevelBtn');
  if (prevBtn) prevBtn.disabled = currentLevelIdx === 0;
  if (nextBtn) nextBtn.disabled = currentLevelIdx === levels.length - 1;
}

function goToPreviousLevel() {
  if (currentLevelIdx > 0) {
    currentLevelIdx--;
    renderCurrentLevel();
  }
}

function goToNextLevel() {
  if (currentLevelIdx < levels.length - 1) {
    currentLevelIdx++;
    renderCurrentLevel();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  renderCurrentLevel();
  
  // Set up level navigation
  document.getElementById('prevLevelBtn').addEventListener('click', goToPreviousLevel);
  document.getElementById('nextLevelBtn').addEventListener('click', goToNextLevel);
});
