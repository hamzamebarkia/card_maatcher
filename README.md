# Greed Island: The Cards Matcher

"Probability is not destiny. The 93% card still fails 7% of the time. Trust nothing." — Hisoka

Welcome to the 67th floor of Greed Island's Central Tower. This is a high-difficulty Memory Match game incorporating probability calculations, Nen-based visual interference, and pattern detection, built with Vanilla JavaScript, HTML5, and CSS3.

## Features & Mechanics

1. **The Grid**: A perfect 8x5 grid containing 40 cards (20 pairs of Hunter x Hunter themed symbols).
2. **Probability Engine (`algorithm/probabilityEngine.js`)**:
   - When a single card is flipped, all face-down cards display a probability overlay indicating their chance of matching the flipped card.
   - **Base Probability**: Calculated dynamically based on the remaining unrevealed deck.
   - **Adjacency Bonus**: Cards adjacent to the flipped card gain an extra 20% match probability, simulating shared aura patterns.
   - **Symbol Rarity & Noise**: Hisoka's "Bungee Gum" distorts probability. Artificial weights scale probability, and a slight random noise (-5% to +5%) is added to make the engine unreliable, forcing the Hunter to rely on intuition as well as math.
3. **Nen Interference (`algorithm/interferenceManager.js`)**:
   - Every 3 consecutive mismatches triggers a "dead hunt" mechanism. Hisoka's Nen reaches into the board and randomly un-matches a previously solved pair, resetting them back to face-down.
   - The counter is reset whenever you find a match. "Plan your flips in batches of 2 to reset the counter."
4. **Best Move Suggestion**:
   - The Probability Overlay highlights the most statistically probable card with a glowing effect to assist the Hunter.
5. **Score & Timer**:
   - You have 60 seconds to match all 20 pairs.
   - +10 points for a match, +0 points for a mismatch.
   - The game tracks your total moves (lower is better).

## File Structure

```text
card-matcher/
├──  index.html
├──  style.css
├──  app.js
├──  algorithm/
│   ├──  probabilityEngine.js
│   ├──  patternDetector.js
│   └──  interferenceManager.js
├──  components/
│   ├──  CardGrid.js
│   ├──  ProbabilityOverlay.js
│   └──  ScorePanel.js
└──  README.md
```

## How to Run

Since the application is built entirely using Vanilla JS without modern ES Modules linking out-of-bounds (the architecture uses classes bound to the `window` object for simplicity and 100% offline reliability), simply open `index.html` in your favorite web browser.

No build tools, no npm installs, just pure front-end Hunter skills. Good luck.
