class PatternDetector {
    constructor(gridCols, gridRows) {
        this.cols = gridCols;
        this.rows = gridRows;
    }

    getAdjacentIndices(index) {
        const adjacent = [];
        const col = index % this.cols;
        const row = Math.floor(index / this.cols);

        // Top
        if (row > 0) adjacent.push(index - this.cols);
        // Bottom
        if (row < this.rows - 1) adjacent.push(index + this.cols);
        // Left
        if (col > 0) adjacent.push(index - 1);
        // Right
        if (col < this.cols - 1) adjacent.push(index + 1);

        return adjacent;
    }

    isAdjacent(index1, index2) {
        const adj = this.getAdjacentIndices(index1);
        return adj.includes(index2);
    }
}

window.PatternDetector = PatternDetector;
