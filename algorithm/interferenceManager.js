class InterferenceManager {
    constructor() {
        this.consecutiveMismatches = 0;
        this.interferenceThreshold = 3;
    }

    recordMatch() {
        this.consecutiveMismatches = 0; // Reset counter on match
        return false;
    }

    recordMismatch() {
        this.consecutiveMismatches++;
        if (this.consecutiveMismatches >= this.interferenceThreshold) {
            this.consecutiveMismatches = 0; // Reset after trigger
            return true; // Trigger interference
        }
        return false;
    }

    applyInterference(cards, onFlipBack) {
        // Find all matched cards
        const matchedPairs = cards.filter(c => c.isMatched);
        
        if (matchedPairs.length === 0) return null; // No cards to interfere with

        // Pick a random matched card's symbol to un-match the entire pair
        const randomCard = matchedPairs[Math.floor(Math.random() * matchedPairs.length)];
        const targetSymbol = randomCard.symbol;

        // Un-match the pair
        const pairIndices = [];
        cards.forEach((c, idx) => {
            if (c.symbol === targetSymbol && c.isMatched) {
                c.isMatched = false;
                c.isFlipped = false;
                pairIndices.push(idx);
            }
        });

        if (onFlipBack) {
            onFlipBack(pairIndices);
        }

        return pairIndices;
    }
}

window.InterferenceManager = InterferenceManager;
