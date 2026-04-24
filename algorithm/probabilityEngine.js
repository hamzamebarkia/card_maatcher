class ProbabilityEngine {
    constructor(patternDetector) {
        this.patternDetector = patternDetector;
        // Assign a base hidden weight for each symbol to simulate "rarity" distortions
        this.symbolWeights = {}; 
    }

    initializeWeights(symbols) {
        symbols.forEach((sym, i) => {
            // Lower index = rarer, lower probability distortion
            this.symbolWeights[sym] = 0.5 + (i / symbols.length) * 0.5; // 0.5 to 1.0
        });
    }

    calculateProbabilities(cards, flippedCardIndex) {
        const flippedCard = cards[flippedCardIndex];
        const unrevealedCards = cards.filter(c => !c.isMatched && !c.isFlipped);
        const totalRemaining = unrevealedCards.length;
        
        // Base probability: 1 out of remaining unrevealed cards
        const baseProb = totalRemaining > 0 ? (1 / totalRemaining) * 100 : 0;
        
        const probabilities = {};

        unrevealedCards.forEach(card => {
            let prob = baseProb;
            
            // 1. Symbol frequency/rarity distortion applies to the base probability first
            const weight = this.symbolWeights[flippedCard.symbol] || 1;
            prob = prob * weight;
            
            // 2. Adjacency bonus: "adjacent cards are 20% more likely to match"
            // We add this AFTER rarity so that the 20% flat boost isn't scaled down by rare weights
            let isAdj = this.patternDetector.isAdjacent(flippedCardIndex, card.index);
            if (isAdj) {
                prob += 20;
            }

            // 3. Add a slight random noise to simulate Bungee Gum stretching truth
            const noise = (Math.random() * 10) - 5; // -5% to +5%
            prob += noise;

            // 4. Enforce strict minimums so adjacent cards always look appropriately high
            if (isAdj) {
                prob = Math.max(20, prob); // Ensure adjacent cards never drop below 20%
            }

            // Clamp between 0 and 100
            prob = Math.max(1, Math.min(99, prob));
            
            // If the card is actually the matching pair, there is a "hidden pattern" 
            // The prompt said "The 93% card still fails 7% of the time".
            // Let's bias the actual correct card to be higher, but not always 100%.
            if (card.symbol === flippedCard.symbol) {
                prob = Math.max(prob, 70 + (Math.random() * 20)); // Ensure it's reasonably high
            }

            probabilities[card.index] = Math.round(prob);
        });

        return probabilities;
    }
}

window.ProbabilityEngine = ProbabilityEngine;
