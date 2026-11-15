// ===== Letter -> colour map (per language) =====
// Shared vowel colours keep the same meaning across both languages;
// consonant/digraph entries are language-specific.
const letterColorMap = {
    basque: {
        a: '#e63946', e: '#f1c40f', i: '#2ecc71', o: '#3498db', u: '#9b59b6',
        k: '#1abc9c', tx: '#e84393', j: '#e67e22', z: '#16a085',
        tt: '#ff7043', x: '#8e44ad', rr: '#d35400'
    },
    spanish: {
        a: '#e63946', e: '#f1c40f', i: '#2ecc71', o: '#3498db', u: '#9b59b6',
        ll: '#e67e22', ñ: '#e84393', rr: '#1abc9c', ch: '#16a085',
        c: '#ff7043', j: '#8e44ad', z: '#d35400'
    }
};

// ===== Letter-eating maze layout (fixed, hand-designed) =====
const MAZE_ROWS = 7;
const MAZE_COLS = 7;
const MAZE_WALLS = [[1, 1], [1, 5], [2, 3], [4, 3], [5, 1], [5, 5]];
const MAZE_PLAYER_START = { row: 3, col: 3 };
const MAZE_GHOST_START = { row: 0, col: 0 };

// ===== Companion growth stages (cumulative stars) =====
const companionStages = [
    { minStars: 0, scale: 0.8, sparkle: false },
    { minStars: 8, scale: 1.0, sparkle: false },
    { minStars: 20, scale: 1.15, sparkle: true },
    { minStars: 40, scale: 1.3, sparkle: true, accessory: '👑' }
];

// ===== Paragraph bank (level 3, unlocked after 10 correct at level 2) =====
const paragraphBank = {
    basque: [
        {
            id: 'eu-3-001',
            text: 'Eguzkia goizean atera zen. Txoriek kantuan hasi ziren zuhaitzean. Neska txikiak leihotik begiratu zuen pozik.',
            targetLetters: ['tx', 'z', 'e'],
            check: { type: 'picture-match', emoji: '🐦', distractorEmojis: ['🚗', '🍕'] }
        },
        {
            id: 'eu-3-002',
            text: 'Katu beltza etxean bizi da. Egunero esnea edaten du goizean. Arratsaldean lorategian jolasten da pilotarekin.',
            targetLetters: ['k', 'e', 'a'],
            check: { type: 'picture-match', emoji: '🐱', distractorEmojis: ['🐶', '🐦'] }
        }
    ],
    spanish: [
        {
            id: 'es-3-001',
            text: 'El sol salió por la mañana. Los pájaros empezaron a cantar en el árbol. La niña miró por la ventana muy contenta.',
            targetLetters: ['ñ', 'j', 'a'],
            check: { type: 'picture-match', emoji: '🐦', distractorEmojis: ['🚗', '🍕'] }
        },
        {
            id: 'es-3-002',
            text: 'El gato negro vive en casa. Cada mañana bebe leche. Por la tarde juega en el jardín con una pelota.',
            targetLetters: ['ch', 'j', 'a'],
            check: { type: 'picture-match', emoji: '🐱', distractorEmojis: ['🐶', '🐦'] }
        }
    ]
};

// ===== Sentence bank =====
const sentenceBank = {
    basque: {
        1: [
            {
                id: 'eu-1-001',
                text: 'Katua esnea edaten du.',
                targetLetters: ['k', 'a', 'u'],
                check: { type: 'picture-match', emoji: '🐱', distractorEmojis: ['🐶', '🐮'] }
            },
            {
                id: 'eu-1-002',
                text: 'Txakurra parkean korrika dabil.',
                targetLetters: ['tx', 'rr', 'k'],
                check: { type: 'picture-match', emoji: '🐶', distractorEmojis: ['🐱', '🐰'] }
            },
            {
                id: 'eu-1-003',
                text: 'Umeak pilotarekin jolasten dute.',
                targetLetters: ['j', 'u', 'e'],
                check: { type: 'missing-word', blankIndex: 2, options: ['jolasten', 'korrika', 'edaten'], correctOption: 'jolasten' }
            },
            {
                id: 'eu-1-004',
                text: 'Eguzkia zeruan dago.',
                targetLetters: ['z', 'e', 'u'],
                check: { type: 'picture-match', emoji: '☀️', distractorEmojis: ['🌙', '⭐'] }
            },
            {
                id: 'eu-1-005',
                text: 'Arrainak itsasoan igerian dabiltza.',
                targetLetters: ['rr', 'i', 'a'],
                check: { type: 'picture-match', emoji: '🐟', distractorEmojis: ['🐙', '🦀'] }
            },
            {
                id: 'eu-1-006',
                text: 'Txoriak kantuan ari dira.',
                targetLetters: ['tx', 'k', 'a'],
                check: { type: 'missing-word', blankIndex: 1, options: ['kantuan', 'jolasten', 'korrika'], correctOption: 'kantuan' }
            },
            {
                id: 'eu-1-007',
                text: 'Sagarra gorria da.',
                targetLetters: ['rr', 'a', 'o'],
                check: { type: 'picture-match', emoji: '🍎', distractorEmojis: ['🍌', '🍇'] }
            },
            {
                id: 'eu-1-008',
                text: 'Xagua zuloan ezkutatu da.',
                targetLetters: ['x', 'z', 'u'],
                check: { type: 'picture-match', emoji: '🐭', distractorEmojis: ['🐹', '🐰'] }
            }
        ],
        2: [
            {
                id: 'eu-2-001',
                text: 'Neska txikiak liburu polita irakurtzen du.',
                targetLetters: ['tx', 'i', 'u'],
                check: { type: 'picture-match', emoji: '📖', distractorEmojis: ['✏️', '🎈'] }
            },
            {
                id: 'eu-2-002',
                text: 'Mendiko gailurrean elur zuria zegoen.',
                targetLetters: ['z', 'u', 'e'],
                check: { type: 'missing-word', blankIndex: 3, options: ['zuria', 'gorria', 'berdea'], correctOption: 'zuria' }
            },
            {
                id: 'eu-2-003',
                text: 'Katu beltza sofan lo dago gaur.',
                targetLetters: ['z', 'a', 'o'],
                check: { type: 'picture-match', emoji: '😴', distractorEmojis: ['🏃', '🍽️'] }
            },
            {
                id: 'eu-2-004',
                text: 'Haurrak ur freskoa edan dute gogotsu.',
                targetLetters: ['rr', 'u', 'e'],
                check: { type: 'missing-word', blankIndex: 1, options: ['ur', 'esne', 'zuku'], correctOption: 'ur' }
            },
            {
                id: 'eu-2-005',
                text: 'Ilargia gauean argi dago zeruan.',
                targetLetters: ['i', 'a', 'z'],
                check: { type: 'picture-match', emoji: '🌙', distractorEmojis: ['☀️', '⭐'] }
            },
            {
                id: 'eu-2-006',
                text: 'Txakur txikiak hezurra jolasean gordetzen du.',
                targetLetters: ['tx', 'j', 'u'],
                check: { type: 'picture-match', emoji: '🦴', distractorEmojis: ['🐾', '🎾'] }
            }
        ]
    },
    spanish: {
        1: [
            {
                id: 'es-1-001',
                text: 'El gato bebe leche.',
                targetLetters: ['ch', 'e', 'a'],
                check: { type: 'picture-match', emoji: '🐱', distractorEmojis: ['🐶', '🐮'] }
            },
            {
                id: 'es-1-002',
                text: 'El perro corre en el parque.',
                targetLetters: ['rr', 'e', 'o'],
                check: { type: 'picture-match', emoji: '🐶', distractorEmojis: ['🐱', '🐰'] }
            },
            {
                id: 'es-1-003',
                text: 'Los niños juegan con la pelota.',
                targetLetters: ['ñ', 'j', 'o'],
                check: { type: 'missing-word', blankIndex: 2, options: ['juegan', 'corren', 'comen'], correctOption: 'juegan' }
            },
            {
                id: 'es-1-004',
                text: 'El sol brilla en el cielo.',
                targetLetters: ['c', 'e', 'o'],
                check: { type: 'picture-match', emoji: '☀️', distractorEmojis: ['🌙', '⭐'] }
            },
            {
                id: 'es-1-005',
                text: 'Los peces nadan en el mar.',
                targetLetters: ['c', 'e', 'a'],
                check: { type: 'picture-match', emoji: '🐟', distractorEmojis: ['🐙', '🦀'] }
            },
            {
                id: 'es-1-006',
                text: 'Los pájaros cantan contentos.',
                targetLetters: ['j', 'c', 'a'],
                check: { type: 'missing-word', blankIndex: 2, options: ['cantan', 'corren', 'juegan'], correctOption: 'cantan' }
            },
            {
                id: 'es-1-007',
                text: 'La manzana roja es dulce.',
                targetLetters: ['z', 'c', 'a'],
                check: { type: 'picture-match', emoji: '🍎', distractorEmojis: ['🍌', '🍇'] }
            },
            {
                id: 'es-1-008',
                text: 'El ratón se esconde en su cueva.',
                targetLetters: ['c', 'e', 'o'],
                check: { type: 'picture-match', emoji: '🐭', distractorEmojis: ['🐹', '🐰'] }
            }
        ],
        2: [
            {
                id: 'es-2-001',
                text: 'La niña pequeña lee un libro bonito.',
                targetLetters: ['ñ', 'e', 'i'],
                check: { type: 'picture-match', emoji: '📖', distractorEmojis: ['✏️', '🎈'] }
            },
            {
                id: 'es-2-002',
                text: 'En la montaña había nieve blanca.',
                targetLetters: ['ñ', 'a', 'i'],
                check: { type: 'missing-word', blankIndex: 4, options: ['nieve', 'lluvia', 'niebla'], correctOption: 'nieve' }
            },
            {
                id: 'es-2-003',
                text: 'El gato negro descansa en el sofá.',
                targetLetters: ['c', 'a', 'o'],
                check: { type: 'picture-match', emoji: '😴', distractorEmojis: ['🏃', '🍽️'] }
            },
            {
                id: 'es-2-004',
                text: 'Los niños beben agua fresca con ganas.',
                targetLetters: ['ñ', 'c', 'a'],
                check: { type: 'missing-word', blankIndex: 3, options: ['agua', 'leche', 'zumo'], correctOption: 'agua' }
            },
            {
                id: 'es-2-005',
                text: 'La luna brilla en el cielo oscuro.',
                targetLetters: ['c', 'u', 'o'],
                check: { type: 'picture-match', emoji: '🌙', distractorEmojis: ['☀️', '⭐'] }
            },
            {
                id: 'es-2-006',
                text: 'El perrito juega con su hueso feliz.',
                targetLetters: ['rr', 'j', 'e'],
                check: { type: 'picture-match', emoji: '🦴', distractorEmojis: ['🐾', '🎾'] }
            }
        ]
    }
};
