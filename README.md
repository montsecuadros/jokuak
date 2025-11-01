# Basque Word Search for Kids

A simple, kid-friendly Basque (Euskara) word search game that runs in the browser. No build tools required.

## Quick start

- Option 1: Open `index.html` directly in your browser.
- Option 2 (recommended): Serve locally to avoid any browser restrictions on local files.
  - Python: `python3 -m http.server 8000` then open http://localhost:8000
  - Node: `npx serve`

## How to play
- Find the hidden words listed on the right.
- Click and drag across the grid in a straight line (horizontal, vertical, or diagonal) to select a word. Release to check automatically.
- Use "Pista" to highlight a starting cell for a remaining word.

This initial version includes an 8x8 grid with simple Basque words (e.g., AMA, AITA, ETXE, MENDI, UR, EGUZKI).

## Files
- `index.html` – App markup
- `styles.css` – Styling for the word search
- `script.js` – Game logic and interactions

## License
MIT
