const { Chess, SQUARES, Square } = require('chess.js');
const { ChessAI } = require('./ChessAI');

const chessAI = new ChessAI(new Chess());
chessAI.printBoard();

console.log(chessAI.evaluateBoard(chessAI.chess.board()), "aa")

const prompt = require('prompt-sync')();

while (!chessAI.chess.isGameOver()) {
    const bestMove = chessAI.run();
    console.log(bestMove);
    chessAI.printBoard();

    //ask();
    //chessAI.printBoard();
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