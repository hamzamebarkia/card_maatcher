class CardGrid {
    constructor(containerId, onCardClick) {
        this.container = document.getElementById(containerId);
        this.onCardClick = onCardClick;
        this.cardElements = [];
    }

    render(cards) {
        this.container.innerHTML = '';
        this.cardElements = [];

        cards.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'card';
            cardEl.dataset.index = index;

            const frontEl = document.createElement('div');
            frontEl.className = 'card-face card-front';
            
            const backEl = document.createElement('div');
            backEl.className = 'card-face card-back';
            backEl.innerText = card.symbol; // The symbol is on the back

            cardEl.appendChild(frontEl);
            cardEl.appendChild(backEl);

            cardEl.addEventListener('click', () => {
                if (!cardEl.classList.contains('flipped') && !cardEl.classList.contains('matched')) {
                    this.onCardClick(index);
                }
            });

            this.container.appendChild(cardEl);
            this.cardElements.push(cardEl);
        });
    }

    flipCard(index) {
        this.cardElements[index].classList.add('flipped');
    }

    unflipCards(indices) {
        indices.forEach(idx => {
            this.cardElements[idx].classList.remove('flipped');
        });
    }

    markMatched(indices) {
        indices.forEach(idx => {
            this.cardElements[idx].classList.add('matched');
        });
    }

    unmarkMatched(indices) {
        indices.forEach(idx => {
            this.cardElements[idx].classList.remove('matched');
            this.cardElements[idx].classList.remove('flipped');
            // Add interference animation
            this.cardElements[idx].classList.add('interference-active');
            setTimeout(() => {
                if (this.cardElements[idx]) {
                    this.cardElements[idx].classList.remove('interference-active');
                }
            }, 1000);
        });
    }

    showProbabilities(probabilities) {
        ProbabilityOverlay.clearSuggestions(this.cardElements);
        this.cardElements.forEach(el => ProbabilityOverlay.clearFromCardElement(el));

        for (const [index, prob] of Object.entries(probabilities)) {
            ProbabilityOverlay.applyToCardElement(this.cardElements[index], prob);
        }

        ProbabilityOverlay.highlightBestCard(this.cardElements, probabilities);
    }

    clearProbabilities() {
        ProbabilityOverlay.clearSuggestions(this.cardElements);
        this.cardElements.forEach(el => ProbabilityOverlay.clearFromCardElement(el));
    }
}

window.CardGrid = CardGrid;
