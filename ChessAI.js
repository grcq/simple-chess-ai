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
        this.#chess = chess || new Chess();
        this.#isWhite = isWhite;
        this.#aiVsAi = aiVsAi;
    }

    get chess() {
        return this.#chess;
    }

    get isWhite() {
        return this.#isWhite;
    }

    isDraw() {
        return this.#chess.isInsufficientMaterial() || this.#chess.isStalemate() || this.#chess.isThreefoldRepetition();
    }

    /*minimax(depth, maximizingPlayer, alpha, beta) {
        if (this.#chess.isCheckmate()) return maximizingPlayer ? -Infinity : Infinity;
        //if (this.isDraw()) return 0;
        if (depth === 0) return this.evaluateBoard(this.#chess.board());

        const moves = this.#shuffle(this.#chess.moves());
        if (maximizingPlayer) {
            let bestMoveValue = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                const move = moves[i];

                this.#chess.move(move);
                /*const c = MoveStorage.check(this.#chess.fen());
                if (!c) bestMoveValue = Math.max(this.minimax(depth - 1, false, alpha, beta));
                else bestMoveValue = c.score;
                bestMoveValue = Math.max(this.minimax(depth - 1, false, alpha, beta));
                this.#chess.undo();

                alpha = Math.max(alpha, bestMoveValue);
                if (beta <= alpha) {
                    break
                }

            }

            return bestMoveValue;
        } else {
            let bestMoveValue = Infinity;

            for (let i = 0; i < moves.length; i++) {
                const move = moves[i];

                this.#chess.move(move);
                /*const c = MoveStorage.check(this.#chess.fen());
                if (!c) bestMoveValue = Math.min(this.minimax(depth - 1, false, alpha, beta));
                else bestMoveValue = c.score;
                bestMoveValue = Math.min(this.minimax(depth - 1, false, alpha, beta));
                this.#chess.undo();

                beta = Math.min(beta, bestMoveValue);
                if (beta <= alpha) {
                    break;
                }

            }

            return bestMoveValue;
        }

    }*/

    orderMoves(moves) {
        moves.sort((a, b) => {
            if (a.flags.includes('e') && !b.flags.includes('e')) return -1;
            if (!a.flags.includes('e') && b.flags.includes('e')) return 1;

            if (a.flags.includes('c') && !b.flags.includes('c')) return -1;
            if (!a.flags.includes('c') && b.flags.includes('c')) return 1;
            
            return 0;
        });
    }

    // negamax
    negamax(depth, alpha, beta, extension = 0) {
        //extension = this.calculateExtension(extension, depth);
        if (this.#chess.isCheckmate()) return -Infinity;
        if (depth === 0) return this.evaluateBoard(this.#chess.board());

        let bestMoveValue = -Infinity;
        const moves = this.#chess.moves({ verbose: true });
        moves.sort((a, b) => {
            if (a.flags.includes('c') && !b.flags.includes('c')) return -1;
            if (!a.flags.includes('c') && b.flags.includes('c')) return 1;

            return 0;
        });
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];

            this.#chess.move(move);
            const value = -this.negamax(depth - 1 + extension, -beta, -alpha, extension);
            this.#chess.undo();

            bestMoveValue = Math.max(bestMoveValue, value);
            alpha = Math.max(alpha, value);
            if (alpha >= beta) {
                break;
            }
        }

        return bestMoveValue;
    }
    
    calculateExtension(currentExtension, depth) {
        if (this.#chess.isCheck() && currentExtension < 10) {
            return currentExtension + 1;
        }
        return 0;
    }

    getBestMove(depth) {
        let bestMove = null;
        let bestMoveValue = -Infinity;

        const moves = this.#shuffle(this.#chess.moves());
        for (let i = 0; i < moves.length; i++) {
            const move = moves[i];

            this.#chess.move(move);
            const value = this.negamax(depth - 1, -Infinity, Infinity);
            this.#chess.undo();

            console.log(value);
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

        for (const row of board) {
            for (const square of row) {
                if (!square) continue;
                
                totalEvaluation += this.getPieceValue(square);

                const piece = this.#chess.get(square.square);
                if (piece.color == "w" && this.isWhite) {
                    totalEvaluation += this.getTableValue(square, piece.color);
                } else {
                    totalEvaluation -= this.getTableValue(square, piece.color);
                }
            }
        }

        totalEvaluation += this.getControlOfCenter(board);
        return totalEvaluation;
    }

    #shuffle(array){
        for(let j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
        return array;
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
        return totalEvaluation * 10;
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
