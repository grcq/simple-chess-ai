const { ChessAI } = require('./ChessAI');

const start = new Date();
const chessAI = new ChessAI();

chessAI.run(5);

const end = new Date() - start;
const seconds = end / 1000;
console.info('Execution time: %dms (%ds)', end, seconds);