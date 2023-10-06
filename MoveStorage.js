class MoveStorage {

    // todo: mysql

    addMove(move) {
        const { fen, move, score } = readMove(move);
    }

    readMove(moveStr) {
        const split = moveStr.split("|");
        const FEN = split[0];
        const move = split[1];
        const score = split[2];

        return {
            fen: FEN,
            move,
            score
        }
    }
}