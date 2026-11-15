# Irakurri eta Koloreztatu (Reading Buddy)

A gamified reading app for a dyslexic child learning to read in Basque and
Spanish. No build tools, no backend — plain HTML/CSS/JS, same as the other
apps in this repo.

## How it works

1. Read a short sentence (Basque or Spanish).
2. Tap "Prest! / ¡Listo!" and answer a quick comprehension check (match the
   picture, or pick the missing word) — this is how the app confirms she
   understood the sentence, since there's no speech recognition involved.
3. A correct answer earns stars and coins, and **Kolore** (the companion)
   reacts by changing color to match the letter she just practiced.
4. She then plays a short letter-color matching mini-game using the letters
   from the sentences she's just read.
5. Wrong answers are always gentle — no fail state, just a "try again" and
   another look at the sentence.

Progress (stars, coins, mastered letters, difficulty level) is tracked
separately for Basque and Spanish, and saved in the browser via
`localStorage`.

## Run it

Open `index.html` directly in a browser, or serve locally:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Files

- `index.html` — screens markup (home, reading, check, celebration, mini-game, settings)
- `app.js` — state machine and game logic
- `content.js` — sentence bank, letter-color map, companion growth stages
- `translations.js` — bilingual UI text (Spanish/Basque)
- `styles.css` — theme, layout, animations
- `assets/fonts/` — self-hosted OpenDyslexic font (OFL licensed, see `OFL.txt`)

## v1 scope

- 2 languages × 2 difficulty levels, ~14 sentences per language
- 2 comprehension-check types: picture-match, missing-word
- 1 mini-game: letter-color matching
- Companion with 4 growth stages, color-reaction, and letter "patches"

Deferred to a later version: word-order comprehension check, additional
mini-games (color-the-word, memory pairs), adaptive difficulty beyond a
simple streak, an in-app sentence editor, and a coin-spend accessory shop.
