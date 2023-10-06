const { Chess } = require('chess.js');

class ChessAI {

    #chess;

    #pawnTable = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [5, 5, 10, 25, 25, 10, 5, 5],
        [0, 0, 0, 20, 20, 0, 0, 0],
        [5, -5, -10, 0, 0, -10, -5, 5],
        [5, 10, 10, -20, -20, 10, 10, 5],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    #knightTable = [
        [-50, -40, -30, -30, -30, -30, -40, -50],
        [-40, -20, 0, 0, 0, 0, -20, -40],
        [-30, 0, 10, 15, 15, 10, 0, -30],
        [-30, 5, 15, 20, 20, 15, 5, -30],
        [-30, 0, 15, 20, 20, 15, 0, -30],
        [-30, 5, 10, 15, 15, 10, 5, -30],
        [-40, -20, 0, 5, 5, 0, -20, -40],
        [-50, -40, -30, -30, -30, -30, -40, -50]
    ];

    #bishopTable = [
        [-20, -10, -10, -10, -10, -10, -10, -20],
        [-10, 0, 0, 0, 0, 0, 0, -10],
        [-10, 0, 5, 10, 10, 5, 0, -10],
        [-10, 5, 5, 10, 10, 5, 5, -10],
        [-10, 0, 10, 10, 10, 10, 0, -10],
        [-10, 10, 10, 10, 10, 10, 10, -10],
        [-10, 5, 0, 0, 0, 0, 5, -10],
        [-20, -10, -10, -10, -10, -10, -10, -20]
    ];

    #rookTable = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [5, 10, 10, 10, 10, 10, 10, 5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [0, 0, 0, 5, 5, 0, 0, 0]
    ];

    #queenTable = [
        [-20, -10, -10, -5, -5, -10, -10, -20],
        [-10, 0, 0, 0, 0, 0, 0, -10],
        [-10, 0, 5, 5, 5, 5, 0, -10],
        [-5, 0, 5, 5, 5, 5, 0, -5],
        [0, 0, 5, 5, 5, 5, 0, -5],
        [-10, 5, 5, 5, 5, 5, 0, -10],
        [-10, 0, 5, 0, 0, 0, 0, -10],
        [-20, -10, -10, -5, -5, -10, -10, -20]
    ];

    #kingTable = [
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-30, -40, -40, -50, -50, -40, -40, -30],
        [-20, -30, -30, -40, -40, -30, -30, -20],
        [-10, -20, -20, -20, -20, -20, -20, -10],
        [20, 20, 0, 0, 0, 0, 20, 20],
        [20, 30, 10, 0, 0, 10, 30, 20]
    ];

    #kingTableEndGame = [
        [-50, -40, -30, -20, -20, -30, -40, -50],
        [-30, -20, -10, 0, 0, -10, -20, -30],
        [-30, -10, 20, 30, 30, 20, -10, -30],
        [-30, -10, 30, 40, 40, 30, -10, -30],
        [-30, -10, 30, 40, 40, 30, -10, -30],
        [-30, -10, 20, 30, 30, 20, -10, -30],
        [-30, -30, 0, 0, 0, 0, -30, -30],
        [-50, -30, -30, -30, -30, -30, -30, -50]
    ];

    #isWhite;
    #aiVsAi;

    constructor(chess = undefined, isWhite = true, aiVsAi = false) {
        this.#chess = chess || new Chess("r6r/pRp3k1/7p/2P5/q2P2BP/4BR2/8/4K1N1 w - - 0 25");
        this.#isWhite = isWhite;
        this.#aiVsAi = aiVsAi;
    }

    get chess() {
        return this.#chess;
    }

    get isWhite() {
        return this.#isWhite;
    }

    orderMoves() {
        const moves = this.#chess.moves();
        const orderedMoves = [];
        for (const move of moves) {
            this.#chess.move(move);
            if (this.#chess.isCheckmate()) {
                orderedMoves.unshift(move);
            } else {
                orderedMoves.push(move);
            }
            this.#chess.undo();
        }
        return orderedMoves;
    }

    minimax(depth, maximizingPlayer, alpha, beta) {
        if (this.#chess.isCheckmate()) {
            return maximizingPlayer ? -Infinity : Infinity;
        }
        if (depth === 0) {
            return maximizingPlayer ? -this.evaluateBoard(this.#chess.board()) : this.evaluateBoard(this.#chess.board());
        }

        if (maximizingPlayer) {
            let bestMoveValue = -Infinity;
            for (const move of this.orderMoves(this.#chess.moves())) {
                this.#chess.move(move);
                bestMoveValue = Math.max(this.minimax(depth - 1, false, alpha, beta));
                this.#chess.undo();

                alpha = Math.max(alpha, bestMoveValue);
                if (alpha >= beta) {
                    return beta;
                }

            }

            return bestMoveValue;
        } else {
            let bestMoveValue = Infinity;
            for (const move of this.orderMoves(this.#chess.moves())) {
                this.#chess.move(move);
                bestMoveValue = Math.min(this.minimax(depth - 1, true, alpha, beta));
                this.#chess.undo();

                beta = Math.min(beta, bestMoveValue);
                if (beta <= alpha) {
                    return alpha;
                }

            }

            return bestMoveValue;
        }

    }


    getBestMove(depth) {
        let bestMove = null;
        let bestMoveValue = -Infinity;

        for (const move of this.orderMoves(this.#chess.moves())) {
            this.#chess.move(move);
            const value = this.minimax(depth - 1, false, -Infinity, Infinity);
            this.#chess.undo();

            //console.log(value);
            if (value === Infinity) {
                return move;
            }

            if (value >= bestMoveValue) {
                bestMoveValue = value;
                bestMove = move;
            }
        }

        return bestMove;
    }

    evaluateBoard(board) {
        let totalEvaluation = 0;
        totalEvaluation += this.evaluateTable(board);

        for (const row of board) {
            for (const square of row) {
                totalEvaluation += this.getPieceValue(square);
            }
        }

        totalEvaluation += this.getControlOfCenter(board);
        return totalEvaluation;
    }

    evaluateTable(board) {
        let totalEvaluation = 0;
        for (const row of board) {
            for (const square of row) {
                if (square === null) {
                    continue;
                }

                const piece = this.#chess.get(square.square);
                if (piece.color == "w" && this.isWhite) {
                    totalEvaluation += this.getTableValue(square, piece.color);
                } else {
                    totalEvaluation -= this.getTableValue(square, piece.color);
                }
            }
        }

        return totalEvaluation;
    }

    getTableValue(square, color) {
        if (square === null) {
            return 0;
        }

        const piece = this.#chess.get(square);
        switch (piece.type) {
            case "p":
                return (color == "w" ? this.#pawnTable[this.rankToIndex(square)][this.fileToIndex(square)] : this.#pawnTable[7 - this.rankToIndex(square)][this.fileToIndex(square)]);
            case "n":
                return (color == "w" ? this.#knightTable[this.rankToIndex(square)][this.fileToIndex(square)] : this.#knightTable[7 - this.rankToIndex(square)][this.fileToIndex(square)]);
            case "b":
                return (color == "w" ? this.#bishopTable[this.rankToIndex(square)][this.fileToIndex(square)] : this.#bishopTable[7 - this.rankToIndex(square)][this.fileToIndex(square)]);
            case "r":
                return (color == "w" ? this.#rookTable[this.rankToIndex(square)][this.fileToIndex(square)] : this.#rookTable[7 - this.rankToIndex(square)][this.fileToIndex(square)]);
            case "q":
                return (color == "w" ? this.#queenTable[this.rankToIndex(square)][this.fileToIndex(square)] : this.#queenTable[7 - this.rankToIndex(square)][this.fileToIndex(square)]);
            case "k":
                return (color == "w" ? this.#kingTable[this.rankToIndex(square)][this.fileToIndex(square)] : this.#kingTable[7 - this.rankToIndex(square)][this.fileToIndex(square)]);
        }

        return 0;
    }

    rankToIndex(square) {
        console.log("AAA ", 8 - parseInt(square[1]));

        return 8 - parseInt(square[1]);
    }

    fileToIndex(square) {
        console.log("AAA ", square.charCodeAt(0) - 97);
        return square.charCodeAt(0) - 97;
    }

    getControlOfCenter(board) {
        let totalEvaluation = 0;
        let centerSquares = ['d4', 'd5', 'e4', 'e5'];
        for (const square of centerSquares) {
            const piece = this.#chess.get(square);
            switch (piece.type) {
                case "p":
                    totalEvaluation += 60;
                    break;
                case "n":
                    totalEvaluation += 20;
                    break;
                case "b":
                    totalEvaluation += 20;
                    break;
                case "r":
                    totalEvaluation += 30;
                    break;
                case "q":
                    totalEvaluation += 40;
                    break;
                case "k":
                    totalEvaluation -= 50;
                    break;
            }
        }
        return totalEvaluation;
    }

    getMobility(board) {
        let totalEvaluation = 0;
        return 0;
    }

    getPieceValue(square) {
        if (square === null) {
            return 0;
        }
        let getAbsoluteValue = (piece) => {
            if (piece.type === 'p') {
                return 10;
            } else if (piece.type === 'r') {
                return 50;
            } else if (piece.type === 'n') {
                return 30;
            } else if (piece.type === 'b') {
                return 30;
            } else if (piece.type === 'q') {
                return 90;
            } else if (piece.type === 'k') {
                return 900;
            }
            throw new Error(`Unknown piece type: ${piece.type}`);
        };

        const absoluteValue = getAbsoluteValue(square);
        return square.color === 'w' ? absoluteValue : -absoluteValue;
    }

    run(depth = 5) {
        const bestMove = this.getBestMove(depth);
        if (bestMove == null) throw new Error('No move found');
        this.#chess.move(bestMove);
        if (this.#aiVsAi) this.#isWhite = !this.#isWhite;
        return bestMove;
    }

    printBoard() {
        console.log(this.#chess.ascii());
    }

    move(move) {
        this.#chess.move(move);
    }

    undo() {
        this.#chess.undo();
    }

}
exports.ChessAI = ChessAI;
