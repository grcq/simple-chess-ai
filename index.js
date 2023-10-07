const { Chess, SQUARES, Square } = require('chess.js');
const { ChessAI } = require('./ChessAI');

const chessAI = new ChessAI(new Chess("r1b1k2r/pppp3p/1bn5/4p1Q1/4P3/3P4/PPP1BPPP/R3K2R w KQ - 1 14"));
chessAI.printBoard();

console.log(chessAI.evaluateBoard(chessAI.chess.board()), "aa")

const prompt = require('prompt-sync')();

while (!chessAI.chess.isGameOver()) {
    const bestMove = chessAI.run(7);
    console.log(bestMove);
    chessAI.printBoard();

    ask();
    chessAI.printBoard();
}

function ask() {
    let move = prompt('Enter your move: ');
    if (move === 'exit' || move === 'quit' || move === "^C") {
        process.exit(0);
    }
    try {
        chessAI.chess.move(move);
    } catch (e) {
        console.log("Invalid move, try again.")
        ask();
    }
}