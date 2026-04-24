class ScorePanel {
    constructor(containerId, onTimeUp) {
        this.container = document.getElementById(containerId);
        this.onTimeUp = onTimeUp;
        this.timeRemaining = 60;
        this.moves = 0;
        this.score = 0;
        this.timerInterval = null;
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <div class="score-item timer-warning" id="timer-box">
                <span class="score-label">Time Remaining</span>
                <span class="score-value" id="time-val">${this.timeRemaining}s</span>
            </div>
            <div class="score-item">
                <span class="score-label">Moves</span>
                <span class="score-value" id="moves-val">${this.moves}</span>
            </div>
            <div class="score-item">
                <span class="score-label">Score</span>
                <span class="score-value" id="score-val">${this.score}</span>
            </div>
        `;
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timeRemaining = 60;
        this.updateDisplay();
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateDisplay();
            
            const timerBox = document.getElementById('timer-box');
            if (this.timeRemaining <= 10) {
                timerBox.classList.add('timer-warning');
            } else {
                timerBox.classList.remove('timer-warning');
            }

            if (this.timeRemaining <= 0) {
                this.stopTimer();
                if (this.onTimeUp) this.onTimeUp();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
    }

    addMove() {
        this.moves++;
        this.updateDisplay();
    }

    addScore(points) {
        this.score += points;
        this.updateDisplay();
    }

    reset() {
        this.timeRemaining = 60;
        this.moves = 0;
        this.score = 0;
        this.stopTimer();
        this.updateDisplay();
    }

    updateDisplay() {
        const timeEl = document.getElementById('time-val');
        const movesEl = document.getElementById('moves-val');
        const scoreEl = document.getElementById('score-val');
        
        if(timeEl) timeEl.innerText = `${this.timeRemaining}s`;
        if(movesEl) movesEl.innerText = this.moves;
        if(scoreEl) scoreEl.innerText = this.score;
    }
}

window.ScorePanel = ScorePanel;
