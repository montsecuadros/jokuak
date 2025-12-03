// ===== Translations / Itzulpenak =====
const translations = {
    spanish: {
        // Header
        appTitle: "Lector Rápido",
        subtitle: "Mejora tu velocidad de lectura manteniendo la comprensión",
        
        // Settings Bar
        language: "Idioma",
        speed: "Velocidad",
        size: "Tamaño",
        manageSentences: "Gestionar Frases",
        close: "Cerrar",
        
        // Language Options
        langSpanish: "Español",
        langBasque: "Euskera",
        
        // Sentences Panel
        tabSpanish: "Español",
        tabBasque: "Euskera",
        emptyState: "No hay frases todavía. ¡Añade tu primera frase!",
        addSentencePlaceholder: "Escribe una nueva frase...",
        addSentenceBtn: "Añadir Frase",
        deleteSentence: "Eliminar",
        deleteConfirm: "¿Estás seguro de que quieres eliminar esta frase?",
        enterSentence: "Por favor, escribe una frase",
        
        // Reading Area
        readyToStart: "¿Listo para empezar?",
        progress: "Progreso",
        words: "Palabras",
        time: "Tiempo",
        
        // Buttons
        startBtn: "Comenzar",
        pauseBtn: "Pausar",
        resumeBtn: "Reanudar",
        stopBtn: "Detener",
        
        // Results
        completedTitle: "¡Lectura Completada!",
        completedText: "Has terminado de leer todas las frases del idioma seleccionado.",
        readingSpeed: "Velocidad de Lectura",
        readingTime: "Tiempo de Lectura",
        wordsRead: "Palabras Leídas",
        newReading: "Nueva Lectura",
        minutes: "minutos",
        
        // Alerts
        noSentences: "No hay frases disponibles para este idioma. Por favor, añade frases primero.",
        
        // Footer
        footerTip: "Consejo: Ajusta la configuración según tus necesidades para una mejor experiencia de lectura.",
        footerCopyright: "© 2024 Lector Rápido"
    },
    basque: {
        // Header
        appTitle: "Irakurgailu Bizkorra",
        subtitle: "Hobetu zure irakurketaren abiadura ulermena mantenduz",
        
        // Settings Bar
        language: "Hizkuntza",
        speed: "Abiadura",
        size: "Tamaina",
        manageSentences: "Esaldiak Kudeatu",
        close: "Itxi",
        
        // Language Options
        langSpanish: "Gaztelania",
        langBasque: "Euskara",
        
        // Sentences Panel
        tabSpanish: "Gaztelania",
        tabBasque: "Euskara",
        emptyState: "Oraindik ez dago esaldirik. Gehitu zure lehen esaldia!",
        addSentencePlaceholder: "Idatzi esaldi berri bat...",
        addSentenceBtn: "Esaldia Gehitu",
        deleteSentence: "Ezabatu",
        deleteConfirm: "Ziur zaude esaldi hau ezabatu nahi duzula?",
        enterSentence: "Mesedez, idatzi esaldi bat",
        
        // Reading Area
        readyToStart: "Prest hasteko?",
        progress: "Aurrerapena",
        words: "Hitzak",
        time: "Denbora",
        
        // Buttons
        startBtn: "Hasi",
        pauseBtn: "Pausatu",
        resumeBtn: "Jarraitu",
        stopBtn: "Gelditu",
        
        // Results
        completedTitle: "Irakurketa Amaituta!",
        completedText: "Hautatutako hizkuntzako esaldi guztiak irakurri dituzu.",
        readingSpeed: "Irakurketaren Abiadura",
        readingTime: "Irakurketaren Denbora",
        wordsRead: "Irakurritako Hitzak",
        newReading: "Irakurketa Berria",
        minutes: "minutu",
        
        // Alerts
        noSentences: "Ez dago esaldirik hizkuntza honetarako. Mesedez, gehitu esaldiak lehenik.",
        
        // Footer
        footerTip: "Aholkua: Doitu konfigurazioa zure beharren arabera irakurketa esperientzia hobea izateko.",
        footerCopyright: "© 2024 Irakurgailu Bizkorra"
    }
};

// ===== Reading Texts (Sentences Lists) =====
const sentences = {
    spanish: [
        "La lectura rápida es una habilidad que permite a las personas leer más rápidamente sin perder la comprensión del texto.",
        "A través de técnicas específicas, los lectores pueden mejorar su velocidad de lectura y retención de información.",
        "Practicar la lectura rápida puede ser beneficioso en muchos aspectos de la vida, desde el estudio hasta el trabajo.",
        "Al aprender a identificar palabras clave y frases importantes, los lectores pueden absorber información de manera más eficiente.",
        "La práctica constante es clave para dominar esta habilidad y aplicarla en diversas situaciones."
    ],
    basque: [
        "Euskaraz irakurtzea praktikatzea garrantzitsua da, hizkuntza hau hobeto ulertzeko eta erabiltzeko.",
        "Testu hau irakurtzean, zure irakurketaren abiadura eta ulermena hobetzen lagunduko dizu.",
        "Irakurketa bizkorrak enpresa eta etxean laguntzen du.",
        "Gako-hitzak eta esaldi garrantzitsuak identifikatuz, irakurleek informazioa modu eragintsuan barneratzea lortzen dute.",
        "Praktika etengabea da gakoa trebetasun hau menperatzeko eta egoera ezberdinetan aplikatzeko."
    ]
};

// ===== Application State =====
let appState = {
    currentLanguage: 'spanish',
    currentTab: 'spanish',
    isReading: false,
    isPaused: false,
    wordIndex: 0,
    words: [],
    startTime: 0,
    pausedTime: 0,
    currentSentenceIndex: 0,
    settings: {
        wpm: 300,
        fontSize: 40,
        lineHeight: 1.8,
        letterSpacing: 0.15,
        bgColor: '#E3F2FD',
        textColor: '#0D47A1'
    }
};

// ===== Local Storage Functions =====
function saveSentencesToStorage() {
    localStorage.setItem('sentences', JSON.stringify(sentences));
}

function loadSentencesFromStorage() {
    const stored = localStorage.getItem('sentences');
    if (stored) {
        const loadedSentences = JSON.parse(stored);
        sentences.spanish = loadedSentences.spanish || sentences.spanish;
        sentences.basque = loadedSentences.basque || sentences.basque;
    }
}

// ===== Timer Functions =====
let timerInterval = null;

function startTimer() {
    appState.startTime = Date.now() - appState.pausedTime;
    timerInterval = setInterval(updateTimer, 100);
}

function updateTimer() {
    if (appState.isReading && !appState.isPaused) {
        const elapsed = Math.floor((Date.now() - appState.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('time-display').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

// ===== Text Parsing =====
function parseText(text) {
    return text
        .split(/\s+/)
        .filter(word => word.length > 0)
        .map(word => word.replace(/[.,!?;:—\-"'"]/g, (match) => match));
}

// ===== Sentence Management =====
function updateUILanguage(lang) {
    const t = translations[lang];
    
    // Header
    document.querySelector('.app-header h1').textContent = t.appTitle;
    document.querySelector('.app-header .subtitle').textContent = t.subtitle;
    
    // Settings Bar Labels
    document.querySelector('label[for="language-select"]').textContent = `${t.language}:`;
    document.querySelector('label[for="wpm-slider"]').textContent = `${t.speed}:`;
    document.querySelector('label[for="font-size-slider"]').textContent = `${t.size}:`;
    
    // Settings Button
    const settingsBtn = document.getElementById('settings-toggle');
    const isActive = document.getElementById('sentences-panel').classList.contains('active');
    settingsBtn.textContent = isActive ? t.close : t.manageSentences;
    
    // Language selector options
    const langSelect = document.getElementById('language-select');
    langSelect.options[0].textContent = t.langSpanish;
    langSelect.options[1].textContent = t.langBasque;
    
    // Tab buttons
    document.querySelector('.tab-btn[data-lang="spanish"]').textContent = t.tabSpanish;
    document.querySelector('.tab-btn[data-lang="basque"]').textContent = t.tabBasque;
    
    // Add sentence form
    document.getElementById('new-sentence-input').placeholder = t.addSentencePlaceholder;
    document.getElementById('add-sentence-btn').textContent = t.addSentenceBtn;
    
    // Reading area
    const wordDisplay = document.getElementById('word-display');
    if (wordDisplay.textContent === '¿Listo para empezar?' || wordDisplay.textContent === 'Prest hasteko?') {
        wordDisplay.textContent = t.readyToStart;
    }
    
    document.querySelector('.stat-label:nth-of-type(1)').textContent = `${t.progress}:`;
    document.querySelector('.stat-label:nth-of-type(2)').textContent = `${t.words}:`;
    document.querySelector('.stat-label:nth-of-type(3)').textContent = `${t.time}:`;
    
    // Buttons
    document.getElementById('start-button').innerHTML = t.startBtn;
    document.getElementById('pause-button').innerHTML = t.pauseBtn;
    document.getElementById('resume-button').innerHTML = t.resumeBtn;
    document.getElementById('stop-button').innerHTML = t.stopBtn;
    
    // Footer
    const footerParagraphs = document.querySelectorAll('.app-footer p');
    if (footerParagraphs.length >= 2) {
        footerParagraphs[0].textContent = t.footerTip;
        footerParagraphs[1].textContent = t.footerCopyright;
    }
    
    // Re-render sentences with new empty state text if needed
    renderSentences(appState.currentTab);
}

function renderSentences(language) {
    const container = document.getElementById(`sentences-list-${language}`);
    const sentencesList = sentences[language];
    const t = translations[appState.currentLanguage];
    
    if (sentencesList.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-text">${t.emptyState}</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = sentencesList.map((sentence, index) => `
        <div class="sentence-item">
            <div class="sentence-text">${sentence}</div>
            <div class="sentence-actions">
                <button class="btn-delete" onclick="deleteSentence('${language}', ${index})">${t.deleteSentence}</button>
            </div>
        </div>
    `).join('');
}

function addSentence() {
    const input = document.getElementById('new-sentence-input');
    const sentence = input.value.trim();
    const language = appState.currentTab;
    const t = translations[appState.currentLanguage];
    
    if (!sentence) {
        alert(t.enterSentence);
        return;
    }
    
    sentences[language].push(sentence);
    renderSentences(language);
    saveSentencesToStorage();
    input.value = '';
    input.focus();
}

function deleteSentence(language, index) {
    const t = translations[appState.currentLanguage];
    if (confirm(t.deleteConfirm)) {
        sentences[language].splice(index, 1);
        renderSentences(language);
        saveSentencesToStorage();
    }
}

function switchTab(language) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === language) {
            btn.classList.add('active');
        }
    });
    
    // Update sentence lists
    document.querySelectorAll('.sentences-list').forEach(list => {
        list.classList.remove('active');
    });
    document.getElementById(`sentences-list-${language}`).classList.add('active');
    
    appState.currentTab = language;
}

// ===== Bionic Reading =====
function applyBionicReading(word) {
    const midpoint = Math.ceil(word.length / 2);
    const bold = word.substring(0, midpoint);
    const normal = word.substring(midpoint);
    return `<strong>${bold}</strong>${normal}`;
}

// ===== Display Word =====
function displayWord() {
    if (!appState.isReading || appState.isPaused) return;

    if (appState.wordIndex < appState.words.length) {
        const word = appState.words[appState.wordIndex];
        const wordDisplay = document.getElementById('word-display');
        wordDisplay.innerHTML = applyBionicReading(word);

        // Update progress
        const percentage = Math.round((appState.wordIndex / appState.words.length) * 100);
        document.getElementById('progress-display').textContent = `${percentage}%`;
        document.getElementById('word-counter-display').textContent = 
            `${appState.wordIndex}/${appState.words.length}`;

        appState.wordIndex++;
        
        // Calculate delay based on WPM
        const delayMs = (60000 / appState.settings.wpm);
        setTimeout(displayWord, delayMs);
    } else {
        // Reading complete - show completion message
        completeReading();
    }
}

// ===== Start Reading =====
function startReading() {
    const language = appState.currentLanguage;
    const sentencesList = sentences[language];
    const t = translations[language];
    
    if (!sentencesList || sentencesList.length === 0) {
        alert(t.noSentences);
        return;
    }
    
    // Combine all sentences into one text
    const fullText = sentencesList.join(' ');
    appState.words = parseText(fullText);
    appState.wordIndex = 0;
    appState.isReading = true;
    appState.isPaused = false;
    appState.pausedTime = 0;

    // Hide results
    document.getElementById('results-container').style.display = 'none';

    // Update UI
    document.getElementById('start-button').disabled = true;
    document.getElementById('pause-button').disabled = false;
    document.getElementById('resume-button').disabled = true;
    document.getElementById('stop-button').disabled = false;

    startTimer();
    displayWord();
}

// ===== Pause Reading =====
function pauseReading() {
    appState.isReading = false;
    appState.isPaused = true;
    stopTimer();

    document.getElementById('pause-button').disabled = true;
    document.getElementById('resume-button').disabled = false;
}

// ===== Resume Reading =====
function resumeReading() {
    appState.isReading = true;
    appState.isPaused = false;
    appState.pausedTime = Date.now() - appState.startTime;

    document.getElementById('pause-button').disabled = false;
    document.getElementById('resume-button').disabled = true;

    startTimer();
    displayWord();
}

// ===== Stop Reading =====
function stopReading() {
    const t = translations[appState.currentLanguage];
    appState.isReading = false;
    appState.isPaused = false;
    stopTimer();

    document.getElementById('word-display').textContent = t.readyToStart;
    document.getElementById('progress-display').textContent = '0%';
    document.getElementById('word-counter-display').textContent = '0/0';
    document.getElementById('time-display').textContent = '0:00';

    document.getElementById('start-button').disabled = false;
    document.getElementById('pause-button').disabled = true;
    document.getElementById('resume-button').disabled = true;
    document.getElementById('stop-button').disabled = true;

    document.getElementById('results-container').style.display = 'none';
}

// ===== Complete Reading =====
function completeReading() {
    const t = translations[appState.currentLanguage];
    appState.isReading = false;
    stopTimer();
    
    const elapsed = Math.floor((Date.now() - appState.startTime) / 1000);
    const minutes = elapsed / 60;
    const wordsRead = appState.words.length;
    const wpm = Math.round(wordsRead / minutes);

    const resultsContainer = document.getElementById('results-container');
    resultsContainer.style.display = 'block';

    const content = resultsContainer.querySelector('#results-content') || 
                    document.createElement('div');
    content.id = 'results-content';

    content.innerHTML = `
        <div class="result-card feedback-correct">
            <h3>${t.completedTitle}</h3>
            <p style="margin-top: 1rem;">${t.completedText}</p>
        </div>
        <div class="result-card">
            <h3>${t.readingSpeed}</h3>
            <div class="result-value">${wpm} PPM</div>
        </div>
        <div class="result-card">
            <h3>${t.readingTime}</h3>
            <div class="result-value">${(elapsed / 60).toFixed(1)} ${t.minutes}</div>
        </div>
        <div class="result-card">
            <h3>${t.wordsRead}</h3>
            <div class="result-value">${wordsRead} ${t.words.toLowerCase()}</div>
        </div>
        <div style="margin-top: 2rem;">
            <button class="btn btn-primary" onclick="resetReading()">${t.newReading}</button>
        </div>
    `;

    resultsContainer.appendChild(content);
    
    // Update buttons
    document.getElementById('start-button').disabled = false;
    document.getElementById('pause-button').disabled = true;
    document.getElementById('resume-button').disabled = true;
    document.getElementById('stop-button').disabled = true;
}

function resetReading() {
    const t = translations[appState.currentLanguage];
    document.getElementById('results-container').style.display = 'none';
    document.getElementById('word-display').textContent = t.readyToStart;
    document.getElementById('progress-display').textContent = '0%';
    document.getElementById('word-counter-display').textContent = '0/0';
    document.getElementById('time-display').textContent = '0:00';
}

// ===== Settings Management =====
function updateSetting(setting, value) {
    appState.settings[setting] = value;
    applyCSSVariables();
}

function applyCSSVariables() {
    const root = document.documentElement;
    root.style.setProperty('--font-size', `${appState.settings.fontSize}px`);
    root.style.setProperty('--line-height', appState.settings.lineHeight);
    root.style.setProperty('--letter-spacing', `${appState.settings.letterSpacing}em`);
    root.style.setProperty('--bg-color', appState.settings.bgColor);
    root.style.setProperty('--text-color', appState.settings.textColor);
    document.body.style.backgroundColor = appState.settings.bgColor;
    document.body.style.color = appState.settings.textColor;
}

// ===== Preset Modes =====
function applyPreset(preset) {
    const presets = {
        dyslexic: {
            fontSize: 36,
            lineHeight: 2,
            letterSpacing: 0.2,
            bgColor: '#FFF8E7',
            textColor: '#2C2C2C'
        },
        comfortable: {
            fontSize: 28,
            lineHeight: 1.6,
            letterSpacing: 0.1,
            bgColor: '#FFFFFF',
            textColor: '#333333'
        },
        contrast: {
            fontSize: 32,
            lineHeight: 1.8,
            letterSpacing: 0.15,
            bgColor: '#000000',
            textColor: '#FFFF00'
        }
    };

    const settings = presets[preset];
    appState.settings = { ...appState.settings, ...settings };
    
    // Update UI
    document.getElementById('font-size-slider').value = settings.fontSize;
    document.getElementById('font-size-display').textContent = `${settings.fontSize}px`;
    document.getElementById('line-height-slider').value = settings.lineHeight;
    document.getElementById('line-height-display').textContent = settings.lineHeight.toFixed(1);
    document.getElementById('letter-spacing-slider').value = settings.letterSpacing;
    document.getElementById('letter-spacing-display').textContent = `${settings.letterSpacing.toFixed(2)}em`;
    document.getElementById('bg-color').value = settings.bgColor;
    document.getElementById('text-color').value = settings.textColor;

    applyCSSVariables();
}

// ===== Load Custom Text =====
function renderCustomQuestions() {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';

    appState.customQuestions.forEach((q, index) => {
        const questionHtml = `
            <div class="question-item" data-question-index="${index}">
                <h4>Pregunta ${index + 1}</h4>
                <div class="control-group">
                    <label>Texto de la Pregunta:</label>
                    <input type="text" class="question-input question-text" placeholder="¿Cuál es tu pregunta?" value="${q.question || ''}" data-index="${index}">
                </div>
                <div class="control-group">
                    <label>Opciones de Respuesta:</label>
                    ${q.options.map((opt, optIdx) => `
                        <div class="option-item">
                            <input type="text" class="option-input" placeholder="Opción ${optIdx + 1}" value="${opt}" data-question-index="${index}" data-option-index="${optIdx}">
                            <label style="margin: 0; display: flex; align-items: center; white-space: nowrap;">
                                <input type="radio" name="correct-answer-${index}" value="${optIdx}" ${q.correctAnswer === optIdx ? 'checked' : ''} data-question-index="${index}" class="correct-answer-radio" style="margin: 0 0.5rem;">
                                Correcta
                            </label>
                        </div>
                    `).join('')}
                </div>
                <div class="control-group">
                    <label>Explicación (opcional):</label>
                    <textarea class="question-input explanation-text" placeholder="Explicación de la respuesta..." data-index="${index}" style="min-height: 60px; resize: vertical;">${q.explanation || ''}</textarea>
                </div>
                <div class="question-actions">
                    <button type="button" class="btn btn-small btn-remove" onclick="removeQuestion(${index})">Eliminar</button>
                </div>
            </div>
        `;
        container.innerHTML += questionHtml;
    });
}

function addNewQuestion() {
    const newQuestion = {
        id: `custom-${appState.customQuestions.length}`,
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        explanation: ''
    };
    appState.customQuestions.push(newQuestion);
    renderCustomQuestions();
}

function removeQuestion(index) {
    appState.customQuestions.splice(index, 1);
    renderCustomQuestions();
}

function getCustomQuestionsFromForm() {
    const questions = [];
    
    document.querySelectorAll('.question-item').forEach((item, index) => {
        const questionText = item.querySelector('.question-text').value.trim();
        const options = Array.from(item.querySelectorAll('.option-input')).map(input => input.value.trim());
        const correctAnswerRadio = item.querySelector('input[type="radio"]:checked');
        const correctAnswer = correctAnswerRadio ? parseInt(correctAnswerRadio.value) : 0;
        const explanation = item.querySelector('.explanation-text').value.trim();

        if (questionText && options.some(opt => opt)) {
            questions.push({
                id: `custom-${index}`,
                question: questionText,
                options: options,
                correctAnswer: correctAnswer,
                explanation: explanation || 'Respuesta guardada.'
            });
        }
    });

    return questions;
}

function loadCustomText() {
    const title = document.getElementById('custom-title').value.trim();
    const customText = document.getElementById('custom-text').value.trim();

    if (!customText) {
        alert('Por favor, pegue un texto para cargar');
        return;
    }

    // Get questions from form
    const questions = getCustomQuestionsFromForm();

    // Store custom text and questions
    texts.custom.titulo = title || 'Texto Personalizado';
    texts.custom.text = customText;
    texts.custom.questions = questions;

    // Save to localStorage
    saveCustomTextToStorage(texts.custom.titulo, customText, questions);

    // Switch to custom language
    document.getElementById('language-select').value = 'custom';
    appState.currentLanguage = 'custom';
    appState.customQuestions = questions;

    const preview = customText.substring(0, 50).replace(/\n/g, ' ') + '...';
    alert(`Texto cargado: "${texts.custom.titulo}"\n\nPalabras: ${customText.split(/\s+/).length}\nPreguntas: ${questions.length}\n\n${preview}`);
}

// ===== Event Listeners Setup =====
document.addEventListener('DOMContentLoaded', function() {
    // Settings toggle button
    document.getElementById('settings-toggle').addEventListener('click', function() {
        const panel = document.getElementById('sentences-panel');
        const isActive = panel.classList.contains('active');
        const t = translations[appState.currentLanguage];
        
        if (isActive) {
            panel.classList.remove('active');
            panel.style.display = 'none';
            this.textContent = t.manageSentences;
        } else {
            panel.style.display = 'block';
            setTimeout(() => panel.classList.add('active'), 10);
            this.textContent = t.close;
        }
    });

    // Language selector - Change UI language
    document.getElementById('language-select').addEventListener('change', (e) => {
        appState.currentLanguage = e.target.value;
        updateUILanguage(e.target.value);
    });

    // WPM slider
    document.getElementById('wpm-slider').addEventListener('input', (e) => {
        const wpm = parseInt(e.target.value);
        appState.settings.wpm = wpm;
        document.getElementById('wpm-display').textContent = `${wpm} PPM`;
    });

    // Font size slider
    document.getElementById('font-size-slider').addEventListener('input', (e) => {
        const fontSize = parseInt(e.target.value);
        updateSetting('fontSize', fontSize);
        document.getElementById('font-size-display').textContent = `${fontSize}px`;
    });

    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.lang);
        });
    });

    // Add sentence button
    document.getElementById('add-sentence-btn').addEventListener('click', addSentence);
    
    // Add sentence on Enter key
    document.getElementById('new-sentence-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addSentence();
        }
    });

    // Load sentences from storage
    loadSentencesFromStorage();
    renderSentences('spanish');
    renderSentences('basque');

    // Reading buttons
    document.getElementById('start-button').addEventListener('click', startReading);
    document.getElementById('pause-button').addEventListener('click', pauseReading);
    document.getElementById('resume-button').addEventListener('click', resumeReading);
    document.getElementById('stop-button').addEventListener('click', stopReading);

    // Apply initial CSS variables and UI language
    applyCSSVariables();
    updateUILanguage(appState.currentLanguage);
});
