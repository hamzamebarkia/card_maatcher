const SYMBOLS = [
    '🕷️', '🃏', '⛓️', '🎣', '👁️', '⚡', '🩸', '🗡️', '🎭', '🐉',
    '👊', '🎩', '🧭', '🦅', '🐺', '🐜', '🦋', '🪙', '🧬', '🔮'
];

class GameManager {
    constructor() {
        this.cards = [];
        this.flippedCardIndices = [];
        this.isProcessing = false;
        this.matchesFound = 0;

        // Initialize algorithms
        this.patternDetector = new PatternDetector(8, 5);
        this.probabilityEngine = new ProbabilityEngine(this.patternDetector);
        this.probabilityEngine.initializeWeights(SYMBOLS);
        this.interferenceManager = new InterferenceManager();

        // Initialize components
        this.scorePanel = new ScorePanel('score-panel-container', () => this.handleTimeUp());
        this.cardGrid = new CardGrid('card-grid-container', (idx) => this.handleCardClick(idx));

        this.initGame();

        // Bind restart button
        document.getElementById('restart-btn').addEventListener('click', () => {
            document.getElementById('modal-overlay').classList.add('hidden');
            this.initGame();
        });
    }

    initGame() {
        this.isProcessing = false;
        this.flippedCardIndices = [];
        this.matchesFound = 0;
        this.scorePanel.reset();
        
        // Create 40 cards (20 pairs)
        const deck = [...SYMBOLS, ...SYMBOLS];
        
        // Shuffle the deck (Fisher-Yates)
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }

        // Add hidden pattern: slightly bias pairs to be closer to each other? 
        // Not strictly necessary since we already have the probability engine.
        // We'll stick to a completely random shuffle to make probability actually useful.

        this.cards = deck.map((symbol, index) => ({
            index,
            symbol,
            isFlipped: false,
            isMatched: false
        }));

        this.cardGrid.render(this.cards);
        this.scorePanel.startTimer();
    }

    handleCardClick(index) {
        if (this.isProcessing) return;

        const card = this.cards[index];
        if (card.isFlipped || card.isMatched) return;

        this.cardGrid.flipCard(index);
        card.isFlipped = true;
        this.flippedCardIndices.push(index);

        if (this.flippedCardIndices.length === 1) {
            // Calculate and show probabilities based on the first flipped card
            const probs = this.probabilityEngine.calculateProbabilities(this.cards, index);
            this.cardGrid.showProbabilities(probs);
        } else if (this.flippedCardIndices.length === 2) {
            this.isProcessing = true;
            this.scorePanel.addMove();
            this.cardGrid.clearProbabilities();
            
            this.checkMatch();
        }
    }

    checkMatch() {
        const [idx1, idx2] = this.flippedCardIndices;
        const card1 = this.cards[idx1];
        const card2 = this.cards[idx2];

        if (card1.symbol === card2.symbol) {
            // Match found!
            card1.isMatched = true;
            card2.isMatched = true;
            this.matchesFound++;
            this.scorePanel.addScore(10);
            this.cardGrid.markMatched([idx1, idx2]);
            this.flippedCardIndices = [];
            this.interferenceManager.recordMatch();
            
            this.isProcessing = false;

            if (this.matchesFound === 20) {
                this.handleWin();
            }
        } else {
            // Mismatch
            this.scorePanel.addScore(0); // For consistency with prompt requirements
            
            const interferenceTriggered = this.interferenceManager.recordMismatch();

            setTimeout(() => {
                // Unflip
                card1.isFlipped = false;
                card2.isFlipped = false;
                this.cardGrid.unflipCards([idx1, idx2]);
                this.flippedCardIndices = [];

                if (interferenceTriggered) {
                    this.applyNenInterference();
                } else {
                    this.isProcessing = false;
                }
            }, 1000);
        }
    }

    applyNenInterference() {
        // Find a random matched pair and unmatch them
        const interferedIndices = this.interferenceManager.applyInterference(this.cards, (indices) => {
            this.cardGrid.unmarkMatched(indices);
            this.matchesFound--; // We lost a match
        });

        // Add a slight delay to let user see the interference before continuing
        setTimeout(() => {
            this.isProcessing = false;
        }, 1000);
    }

    handleTimeUp() {
        this.isProcessing = true;
        this.showModal("Game Over", "Hisoka got bored. You died.");
    }

    handleWin() {
        this.scorePanel.stopTimer();
        this.showModal("You Survived", `Moves: ${this.scorePanel.moves} | Score: ${this.scorePanel.score}`);
    }

    showModal(title, desc) {
        document.getElementById('modal-title').innerText = title;
        document.getElementById('modal-desc').innerText = desc;
        document.getElementById('modal-overlay').classList.remove('hidden');
    }
}

// Start game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new GameManager();
});
