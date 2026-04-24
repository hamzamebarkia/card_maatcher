class ProbabilityOverlay {
    constructor() {
        // Overlay logic is handled directly in CardGrid for simplicity,
        // but this class can manage formatting and DOM updates if needed.
    }

    static formatProbability(probValue) {
        return `${probValue}%`;
    }

    static applyToCardElement(cardElement, probability) {
        if (!cardElement) return;
        
        let overlay = cardElement.querySelector('.prob-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'prob-overlay';
            cardElement.appendChild(overlay);
        }
        
        overlay.innerText = this.formatProbability(probability);
        cardElement.classList.add('show-prob');
    }

    static clearFromCardElement(cardElement) {
        if (!cardElement) return;
        cardElement.classList.remove('show-prob');
    }

    static highlightBestCard(cardElements, probabilities) {
        let maxProb = -1;
        let bestIndex = -1;
        
        for (const [index, prob] of Object.entries(probabilities)) {
            if (prob > maxProb) {
                maxProb = prob;
                bestIndex = parseInt(index);
            }
        }

        if (bestIndex !== -1 && cardElements[bestIndex]) {
            cardElements[bestIndex].classList.add('suggested');
        }
    }

    static clearSuggestions(cardElements) {
        cardElements.forEach(el => el.classList.remove('suggested'));
    }
}

window.ProbabilityOverlay = ProbabilityOverlay;
