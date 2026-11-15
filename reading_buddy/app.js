// ===== App State =====
let appState = {
    screen: 'home',
    currentLanguage: 'basque',
    currentSentence: null,
    recentTargetLetters: [],
    companionColor: null,
    lastMinigame: null,
    justLeveledUp: false,
    settings: { fontSize: 40 },
    progress: {
        basque: { level: 1, correctStreak: 0, level2Correct: 0, recentIds: [], masteredLetters: [] },
        spanish: { level: 1, correctStreak: 0, level2Correct: 0, recentIds: [], masteredLetters: [] }
    },
    stars: 0,
    coins: 0
};

let minigameState = null;
let celebrationTimer = null;

// ===== Persistence =====
function saveState() {
    localStorage.setItem('readingBuddyState', JSON.stringify({
        currentLanguage: appState.currentLanguage,
        companionColor: appState.companionColor,
        lastMinigame: appState.lastMinigame,
        settings: appState.settings,
        progress: appState.progress,
        stars: appState.stars,
        coins: appState.coins
    }));
}

function loadState() {
    const stored = localStorage.getItem('readingBuddyState');
    if (!stored) return;
    try {
        const parsed = JSON.parse(stored);
        Object.assign(appState, parsed);
    } catch (e) {
        // corrupted storage, ignore and keep defaults
    }
}

// ===== Helpers =====
function t() {
    return translations[appState.currentLanguage];
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

// Non-overlapping scatter positions (px left/top, relative to fieldEl) for a
// fixed number of same-sized square items: divides the field into a grid of
// slots (one item per slot, sized from the field's real rendered dimensions)
// with a little random jitter clamped to stay inside the slot — guarantees
// items never sit on top of each other regardless of viewport width, unlike
// plain percentage-based placement (a fixed-px item can still overlap under
// percentage math on a narrow screen).
function scatterPositions(fieldEl, count, itemSize) {
    const cols = 3;
    const rows = Math.ceil(count / cols);
    const rect = fieldEl.getBoundingClientRect();
    const cellW = rect.width / cols;
    const cellH = rect.height / rows;
    const jitterX = Math.max(0, cellW - itemSize - 8);
    const jitterY = Math.max(0, cellH - itemSize - 8);
    const slots = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            slots.push({ r, c });
        }
    }
    return shuffle(slots).slice(0, count).map(slot => ({
        left: (slot.c * cellW + 4 + Math.random() * jitterX) + 'px',
        top: (slot.r * cellH + 4 + Math.random() * jitterY) + 'px'
    }));
}

// ===== UI language =====
function updateUILanguage() {
    const strings = t();
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (strings[key]) el.textContent = strings[key];
    });
    document.title = strings.appTitle;
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === appState.currentLanguage);
    });
}

function setLanguage(lang) {
    appState.currentLanguage = lang;
    updateUILanguage();
    saveState();
    if (document.getElementById('settings-modal').classList.contains('active')) {
        updateDebugSentenceOptions();
    }
}

// ===== Screen navigation =====
function goToScreen(name) {
    appState.screen = name;
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('screen-' + name).classList.add('active');
}

// ===== Reading text rendering (mastered letters highlighted) =====
function renderColoredText(text, lang) {
    const map = letterColorMap[lang];
    const mastered = new Set(appState.progress[lang].masteredLetters);
    const digraphs = Object.keys(map).filter(k => k.length > 1).sort((a, b) => b.length - a.length);
    const lower = text.toLowerCase();
    let html = '';
    let i = 0;
    while (i < text.length) {
        let matchedKey = null;
        for (const d of digraphs) {
            if (lower.substr(i, d.length) === d) { matchedKey = d; break; }
        }
        if (matchedKey) {
            const chunk = text.substr(i, matchedKey.length);
            html += mastered.has(matchedKey)
                ? `<span class="mastered-letter" style="--letter-color:${map[matchedKey]}">${escapeHtml(chunk)}</span>`
                : escapeHtml(chunk);
            i += matchedKey.length;
            continue;
        }
        const ch = text[i];
        const chLower = ch.toLowerCase();
        if (map[chLower] && mastered.has(chLower)) {
            html += `<span class="mastered-letter" style="--letter-color:${map[chLower]}">${escapeHtml(ch)}</span>`;
        } else {
            html += escapeHtml(ch);
        }
        i += 1;
    }
    return html;
}

// ===== Sentence selection =====
function getContentPool(lang, level) {
    return level === 3 ? paragraphBank[lang] : sentenceBank[lang][level];
}

function pickNextSentence() {
    const lang = appState.currentLanguage;
    const level = appState.progress[lang].level;
    const pool = getContentPool(lang, level);
    const recentIds = appState.progress[lang].recentIds;
    let candidates = pool.filter(s => !recentIds.includes(s.id));
    if (candidates.length === 0) candidates = pool;
    return candidates[Math.floor(Math.random() * candidates.length)];
}

// ===== Home / reading flow =====
function startReading() {
    appState.currentSentence = pickNextSentence();
    goToScreen('reading');
    document.getElementById('reading-text').innerHTML =
        renderColoredText(appState.currentSentence.text, appState.currentLanguage);
}

function onReady() {
    goToScreen('check');
    renderCheck(appState.currentSentence);
}

// ===== Comprehension check =====
function renderCheck(sentence) {
    const strings = t();
    const titleEl = document.getElementById('check-title');
    const contextEl = document.getElementById('check-context');
    const tilesEl = document.getElementById('check-tiles');
    const messageEl = document.getElementById('check-message');
    messageEl.textContent = '';
    tilesEl.innerHTML = '';

    if (sentence.check.type === 'picture-match') {
        titleEl.textContent = strings.checkPictureTitle;
        contextEl.textContent = sentence.text;
        const options = shuffle([sentence.check.emoji, ...sentence.check.distractorEmojis]);
        options.forEach(emoji => {
            const tile = document.createElement('button');
            tile.className = 'tile';
            tile.textContent = emoji;
            tile.addEventListener('click', () => onCheckAnswer(emoji === sentence.check.emoji, tile));
            tilesEl.appendChild(tile);
        });
    } else if (sentence.check.type === 'missing-word') {
        titleEl.textContent = strings.checkMissingTitle;
        const words = sentence.text.split(' ');
        words[sentence.check.blankIndex] = '____';
        contextEl.textContent = words.join(' ');
        const options = shuffle(sentence.check.options);
        options.forEach(word => {
            const tile = document.createElement('button');
            tile.className = 'tile word-tile';
            tile.textContent = word;
            tile.addEventListener('click', () => onCheckAnswer(word === sentence.check.correctOption, tile));
            tilesEl.appendChild(tile);
        });
    }
}

function onCheckAnswer(isCorrect, tileEl) {
    if (isCorrect) {
        onCorrectAnswer();
    } else {
        tileEl.classList.add('shake');
        document.getElementById('check-message').textContent = t().notYet;
        setTimeout(() => {
            tileEl.classList.remove('shake');
            goToScreen('reading');
            document.getElementById('reading-text').innerHTML =
                renderColoredText(appState.currentSentence.text, appState.currentLanguage);
        }, 900);
    }
}

// ===== Reward / progress =====
function onCorrectAnswer() {
    const lang = appState.currentLanguage;
    const sentence = appState.currentSentence;
    const progress = appState.progress[lang];

    appState.stars += 1;
    appState.coins += 3;

    progress.correctStreak += 1;
    if (progress.level === 1 && progress.correctStreak >= 5) {
        progress.level = 2;
        progress.correctStreak = 0;
    }
    if (progress.level === 2) {
        progress.level2Correct = (progress.level2Correct || 0) + 1;
        if (progress.level2Correct >= 10) {
            progress.level = 3;
            appState.justLeveledUp = true;
        }
    }

    progress.recentIds.push(sentence.id);
    if (progress.recentIds.length > 5) progress.recentIds.shift();

    sentence.targetLetters.forEach(letter => {
        if (!progress.masteredLetters.includes(letter)) progress.masteredLetters.push(letter);
    });

    appState.recentTargetLetters = [
        ...new Set([...sentence.targetLetters, ...appState.recentTargetLetters])
    ].slice(0, 6);

    const primaryLetter = sentence.targetLetters[0];
    appState.companionColor = letterColorMap[lang][primaryLetter] || appState.companionColor;

    saveState();
    showCelebration();
}

function showCelebration() {
    goToScreen('celebration');
    renderCompanion('companion-body-celebrate', 'companion-patches-celebrate', 'companion-celebrate');
    const levelupEl = document.getElementById('levelup-msg');
    levelupEl.hidden = !appState.justLeveledUp;
    appState.justLeveledUp = false;
    clearTimeout(celebrationTimer);
    celebrationTimer = setTimeout(() => startMinigame(), 1800);
}

// ===== Companion rendering =====
function getCompanionStage() {
    let stage = companionStages[0];
    for (const s of companionStages) {
        if (appState.stars >= s.minStars) stage = s;
    }
    return stage;
}

function renderCompanion(bodyId, patchesId, wrapperClassTarget) {
    const stage = getCompanionStage();
    const lang = appState.currentLanguage;
    const mastered = appState.progress[lang].masteredLetters;
    const map = letterColorMap[lang];

    const body = document.getElementById(bodyId);
    body.setAttribute('fill', appState.companionColor || '#cfd8dc');

    const patchesGroup = document.getElementById(patchesId);
    patchesGroup.innerHTML = '';
    mastered.forEach((letter, idx) => {
        const angle = (idx / Math.max(mastered.length, 1)) * Math.PI * 2;
        const cx = 100 + Math.cos(angle) * 78;
        const cy = 120 + Math.sin(angle) * 70;
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', cx);
        dot.setAttribute('cy', cy);
        dot.setAttribute('r', 7);
        dot.setAttribute('fill', map[letter] || '#cfd8dc');
        dot.setAttribute('class', 'patch');
        patchesGroup.appendChild(dot);
    });

    const wrapper = wrapperClassTarget
        ? document.getElementById(wrapperClassTarget)
        : document.getElementById('companion');
    wrapper.style.transform = `scale(${stage.scale})`;
    wrapper.classList.toggle('sparkle', !!stage.sparkle);

    const accessoryEl = document.getElementById('companion-accessory');
    if (accessoryEl) accessoryEl.textContent = stage.accessory || '';
}

// ===== Mini-game shared helpers =====
function getMinigameLetterPool(maxCount) {
    const lang = appState.currentLanguage;
    const map = letterColorMap[lang];
    // Union of everything she's ever practiced (not just the last sentence),
    // then shuffled, so mini-games draw a fresh random sample each round
    // instead of always the same handful of most-recent letters.
    let pool = [...new Set([...appState.progress[lang].masteredLetters, ...appState.recentTargetLetters])]
        .filter(l => map[l]);
    if (pool.length === 0) pool = Object.keys(map);
    if (pool.length < maxCount) {
        const fillers = Object.keys(map).filter(l => !pool.includes(l));
        pool = [...pool, ...fillers];
    }
    return shuffle(pool).slice(0, maxCount);
}

function startMinigameTimer() {
    document.getElementById('minigame-timer-fill').style.width = '100%';
    minigameState.timeLeft = minigameState.timeLimit;
    minigameState.timerHandle = setInterval(tickMinigameTimer, 1000);
}

function tickMinigameTimer() {
    if (!minigameState) return;
    minigameState.timeLeft -= 1;
    const pct = Math.max(0, (minigameState.timeLeft / minigameState.timeLimit) * 100);
    document.getElementById('minigame-timer-fill').style.width = pct + '%';
    if (minigameState.timeLeft <= 0) endMinigame();
}

function checkMinigameComplete() {
    if (minigameState && minigameState.matches >= minigameState.totalTarget) endMinigame();
}

function registerMinigameMatch(color) {
    minigameState.matches += 1;
    appState.coins += 1;
    if (color) appState.companionColor = color;
    renderCompanion('companion-body', 'companion-patches');
    saveState();
    checkMinigameComplete();
}

// ===== Mini-game dispatcher =====
const MINIGAMES = ['maze', 'letterHunt'];

function pickMinigame() {
    const options = MINIGAMES.filter(g => g !== appState.lastMinigame);
    const choice = options[Math.floor(Math.random() * options.length)];
    appState.lastMinigame = choice;
    return choice;
}

function startMinigame() {
    clearTimeout(celebrationTimer);
    goToScreen('minigame');
    document.getElementById('minigame-result').hidden = true;
    document.getElementById('minigame-content').innerHTML = '';

    const game = pickMinigame();
    saveState();
    if (game === 'maze') startMazeGame();
    else startLetterHuntGame();
}

// ===== Mini-game: letter hunt =====
function startLetterHuntGame() {
    const strings = t();
    const lang = appState.currentLanguage;
    const pool = getMinigameLetterPool(5);
    const targetLetter = pool[Math.floor(Math.random() * pool.length)];
    const distractorPool = pool.filter(l => l !== targetLetter);

    document.getElementById('minigame-title').textContent = strings.minigameTitleLetterHunt;
    document.getElementById('minigame-instructions').textContent =
        strings.minigameInstructionsLetterHunt.replace('{letter}', targetLetter.toUpperCase());

    const totalTargetCount = 4;
    const totalChips = 9;
    const chips = [];
    for (let i = 0; i < totalTargetCount; i++) chips.push(targetLetter);
    while (chips.length < totalChips) {
        chips.push(distractorPool.length
            ? distractorPool[Math.floor(Math.random() * distractorPool.length)]
            : targetLetter);
    }

    minigameState = { type: 'letterHunt', matches: 0, totalTarget: totalTargetCount, timeLimit: 60, targetLetter };

    const field = document.createElement('div');
    field.className = 'minigame-field';
    document.getElementById('minigame-content').appendChild(field);
    const positions = scatterPositions(field, totalChips, 64);
    shuffle(chips).forEach((letter, idx) => {
        const chip = document.createElement('div');
        chip.className = 'letter-chip';
        chip.textContent = letter;
        chip.dataset.letter = letter;
        chip.style.left = positions[idx].left;
        chip.style.top = positions[idx].top;
        chip.style.animationDelay = (Math.random() * 2) + 's';
        chip.addEventListener('click', () => onHuntChipTap(chip));
        field.appendChild(chip);
    });

    startMinigameTimer();
}

function onHuntChipTap(chip) {
    if (!minigameState || chip.classList.contains('matched')) return;
    if (chip.dataset.letter === minigameState.targetLetter) {
        chip.classList.add('matched');
        registerMinigameMatch(letterColorMap[appState.currentLanguage][chip.dataset.letter]);
    } else {
        chip.classList.add('mismatch');
        setTimeout(() => chip.classList.remove('mismatch'), 400);
    }
}

// ===== Mini-game: letter-eating maze =====
function isMazeWall(row, col) {
    return MAZE_WALLS.some(([r, c]) => r === row && c === col);
}

function pickOpenCells(count, exclude) {
    const open = [];
    for (let r = 0; r < MAZE_ROWS; r++) {
        for (let c = 0; c < MAZE_COLS; c++) {
            if (isMazeWall(r, c)) continue;
            if (exclude.some(e => e.row === r && e.col === c)) continue;
            open.push({ row: r, col: c });
        }
    }
    return shuffle(open).slice(0, count);
}

function getValidNeighbors(row, col) {
    const deltas = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const neighbors = [];
    deltas.forEach(([dr, dc]) => {
        const nr = row + dr, nc = col + dc;
        if (nr >= 0 && nr < MAZE_ROWS && nc >= 0 && nc < MAZE_COLS && !isMazeWall(nr, nc)) {
            neighbors.push({ row: nr, col: nc });
        }
    });
    return neighbors;
}

function mazeCellPercent(row, col) {
    return { left: (col / MAZE_COLS) * 100 + '%', top: (row / MAZE_ROWS) * 100 + '%' };
}

function startMazeGame() {
    const strings = t();
    const lang = appState.currentLanguage;
    const map = letterColorMap[lang];
    const pool = getMinigameLetterPool(3);
    const targetLetter = pool[0];
    const distractorPool = pool.slice(1);

    document.getElementById('minigame-title').textContent = strings.minigameTitleMaze;
    document.getElementById('minigame-instructions').textContent =
        strings.minigameInstructionsMaze.replace('{letter}', targetLetter.toUpperCase());

    const excluded = [MAZE_PLAYER_START, MAZE_GHOST_START];
    const targetCells = pickOpenCells(4, excluded);
    const distractorCells = pickOpenCells(3, [...excluded, ...targetCells]);
    const tokens = [
        ...targetCells.map(cell => ({ ...cell, letter: targetLetter, isTarget: true })),
        ...distractorCells.map((cell, idx) => ({
            ...cell,
            letter: distractorPool.length ? distractorPool[idx % distractorPool.length] : targetLetter,
            isTarget: false
        }))
    ];

    minigameState = {
        type: 'maze',
        matches: 0,
        totalTarget: targetCells.length,
        timeLimit: 90,
        targetLetter,
        tokens,
        player: { row: MAZE_PLAYER_START.row, col: MAZE_PLAYER_START.col },
        ghost: { row: MAZE_GHOST_START.row, col: MAZE_GHOST_START.col },
        ghostHandle: null
    };

    const field = document.createElement('div');
    field.className = 'maze-field';
    document.getElementById('minigame-content').appendChild(field);

    MAZE_WALLS.forEach(([r, c]) => {
        const wall = document.createElement('div');
        wall.className = 'maze-wall';
        Object.assign(wall.style, mazeCellPercent(r, c));
        field.appendChild(wall);
    });

    tokens.forEach((tok, idx) => {
        const el = document.createElement('div');
        el.className = 'maze-letter';
        el.textContent = tok.letter;
        el.dataset.tokenId = 'token-' + idx;
        Object.assign(el.style, mazeCellPercent(tok.row, tok.col));
        field.appendChild(el);
    });

    const player = document.createElement('div');
    player.id = 'maze-player';
    player.className = 'maze-player';
    player.textContent = '😋';
    Object.assign(player.style, mazeCellPercent(minigameState.player.row, minigameState.player.col));
    field.appendChild(player);

    const ghost = document.createElement('div');
    ghost.id = 'maze-ghost';
    ghost.className = 'maze-ghost';
    ghost.textContent = '👻';
    Object.assign(ghost.style, mazeCellPercent(minigameState.ghost.row, minigameState.ghost.col));
    field.appendChild(ghost);

    const controls = document.createElement('div');
    controls.className = 'maze-controls';
    const arrows = [
        { cls: 'maze-arrow-up', label: '↑', dr: -1, dc: 0 },
        { cls: 'maze-arrow-left', label: '←', dr: 0, dc: -1 },
        { cls: 'maze-arrow-down', label: '↓', dr: 1, dc: 0 },
        { cls: 'maze-arrow-right', label: '→', dr: 0, dc: 1 }
    ];
    arrows.forEach(a => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-secondary maze-arrow-btn ' + a.cls;
        btn.textContent = a.label;
        btn.addEventListener('click', () => movePlayer(a.dr, a.dc));
        controls.appendChild(btn);
    });
    document.getElementById('minigame-content').appendChild(controls);

    startMinigameTimer();
    minigameState.ghostHandle = setInterval(stepGhost, 1100);
}

function renderMazeMarkers() {
    const player = document.getElementById('maze-player');
    const ghost = document.getElementById('maze-ghost');
    if (player) Object.assign(player.style, mazeCellPercent(minigameState.player.row, minigameState.player.col));
    if (ghost) Object.assign(ghost.style, mazeCellPercent(minigameState.ghost.row, minigameState.ghost.col));
}

function checkMazeEat() {
    const p = minigameState.player;
    const tokenEl = [...document.querySelectorAll('.maze-letter')].find(el => {
        const tok = minigameState.tokens[parseInt(el.dataset.tokenId.split('-')[1], 10)];
        return tok && !tok.eaten && tok.row === p.row && tok.col === p.col;
    });
    if (!tokenEl) return;
    const tok = minigameState.tokens[parseInt(tokenEl.dataset.tokenId.split('-')[1], 10)];
    if (!tok.isTarget) return;
    tok.eaten = true;
    tokenEl.remove();
    registerMinigameMatch(letterColorMap[appState.currentLanguage][tok.letter]);
}

function checkMazeCollision() {
    if (!minigameState || minigameState.type !== 'maze') return;
    const p = minigameState.player;
    const g = minigameState.ghost;
    if (p.row === g.row && p.col === g.col) {
        const playerEl = document.getElementById('maze-player');
        playerEl.classList.add('bump');
        setTimeout(() => playerEl.classList.remove('bump'), 400);
        minigameState.player.row = MAZE_PLAYER_START.row;
        minigameState.player.col = MAZE_PLAYER_START.col;
        renderMazeMarkers();
    }
}

function movePlayer(dr, dc) {
    if (!minigameState || minigameState.type !== 'maze') return;
    const p = minigameState.player;
    const nr = p.row + dr, nc = p.col + dc;
    if (nr < 0 || nr >= MAZE_ROWS || nc < 0 || nc >= MAZE_COLS) return;
    if (isMazeWall(nr, nc)) return;
    p.row = nr;
    p.col = nc;
    renderMazeMarkers();
    checkMazeEat();
    checkMazeCollision();
}

function stepGhost() {
    if (!minigameState || minigameState.type !== 'maze') return;
    const g = minigameState.ghost;
    const p = minigameState.player;
    const neighbors = getValidNeighbors(g.row, g.col);
    if (neighbors.length === 0) return;
    let choice;
    if (Math.random() < 0.55) {
        const currentDist = Math.abs(g.row - p.row) + Math.abs(g.col - p.col);
        const better = neighbors.filter(n => (Math.abs(n.row - p.row) + Math.abs(n.col - p.col)) < currentDist);
        choice = better.length
            ? better[Math.floor(Math.random() * better.length)]
            : neighbors[Math.floor(Math.random() * neighbors.length)];
    } else {
        choice = neighbors[Math.floor(Math.random() * neighbors.length)];
    }
    g.row = choice.row;
    g.col = choice.col;
    renderMazeMarkers();
    checkMazeCollision();
}

function endMinigame() {
    if (!minigameState) return;
    clearInterval(minigameState.timerHandle);
    if (minigameState.ghostHandle) clearInterval(minigameState.ghostHandle);
    const coinsEarned = minigameState.matches;
    document.getElementById('minigame-result-coins').textContent = coinsEarned;
    document.getElementById('minigame-result').hidden = false;
    saveState();
    minigameState = null;
}

function backToHome() {
    goToScreen('home');
    renderCompanion('companion-body', 'companion-patches');
    updateStatsDisplay();
}

// ===== Stats display =====
function updateStatsDisplay() {
    document.getElementById('stars-count').textContent = appState.stars;
    document.getElementById('coins-count').textContent = appState.coins;
}

// ===== Settings =====
function openSettings() {
    document.getElementById('settings-modal').classList.add('active');
    updateDebugSentenceOptions();
}

function closeSettings() {
    document.getElementById('settings-modal').classList.remove('active');
}

function applyFontSize(size) {
    appState.settings.fontSize = size;
    document.documentElement.style.setProperty('--reading-font-size', size + 'px');
}

// ===== Debug: jump to a specific level/sentence (for testing) =====
function updateDebugSentenceOptions() {
    const lang = appState.currentLanguage;
    const level = parseInt(document.getElementById('debug-level-select').value, 10);
    const pool = getContentPool(lang, level);
    const select = document.getElementById('debug-sentence-select');
    select.innerHTML = '';
    pool.forEach(entry => {
        const opt = document.createElement('option');
        opt.value = entry.id;
        opt.textContent = entry.text.length > 40 ? entry.text.slice(0, 40) + '…' : entry.text;
        select.appendChild(opt);
    });
}

function jumpToContent() {
    const lang = appState.currentLanguage;
    const level = parseInt(document.getElementById('debug-level-select').value, 10);
    const sentenceId = document.getElementById('debug-sentence-select').value;
    const pool = getContentPool(lang, level);
    const entry = pool.find(s => s.id === sentenceId);
    if (!entry) return;

    appState.progress[lang].level = level;
    appState.progress[lang].correctStreak = 0;
    appState.progress[lang].level2Correct = 0;
    appState.currentSentence = entry;
    saveState();

    closeSettings();
    goToScreen('reading');
    document.getElementById('reading-text').innerHTML = renderColoredText(entry.text, lang);
}

function resetProgress() {
    if (!window.confirm(t().debugResetConfirm)) return;

    localStorage.removeItem('readingBuddyState');
    appState.currentSentence = null;
    appState.recentTargetLetters = [];
    appState.companionColor = null;
    appState.lastMinigame = null;
    appState.justLeveledUp = false;
    appState.progress = {
        basque: { level: 1, correctStreak: 0, level2Correct: 0, recentIds: [], masteredLetters: [] },
        spanish: { level: 1, correctStreak: 0, level2Correct: 0, recentIds: [], masteredLetters: [] }
    };
    appState.stars = 0;
    appState.coins = 0;

    renderCompanion('companion-body', 'companion-patches');
    updateStatsDisplay();
    updateDebugSentenceOptions();
    closeSettings();
    goToScreen('home');
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', function () {
    loadState();
    updateUILanguage();
    applyFontSize(appState.settings.fontSize);
    document.getElementById('font-size-slider').value = appState.settings.fontSize;
    renderCompanion('companion-body', 'companion-patches');
    updateStatsDisplay();
    goToScreen('home');

    document.getElementById('start-btn').addEventListener('click', startReading);
    document.getElementById('ready-btn').addEventListener('click', onReady);
    document.getElementById('celebration-continue-btn').addEventListener('click', () => {
        clearTimeout(celebrationTimer);
        startMinigame();
    });
    document.getElementById('minigame-back-btn').addEventListener('click', backToHome);

    document.getElementById('settings-toggle').addEventListener('click', openSettings);
    document.getElementById('settings-close').addEventListener('click', closeSettings);
    document.getElementById('settings-close-btn').addEventListener('click', closeSettings);
    document.getElementById('settings-modal').addEventListener('click', (e) => {
        if (e.target.id === 'settings-modal') closeSettings();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSettings();
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    document.getElementById('font-size-slider').addEventListener('input', (e) => {
        applyFontSize(parseInt(e.target.value, 10));
        saveState();
    });

    document.getElementById('debug-level-select').addEventListener('change', updateDebugSentenceOptions);
    document.getElementById('debug-jump-btn').addEventListener('click', jumpToContent);
    document.getElementById('debug-reset-btn').addEventListener('click', resetProgress);
});
