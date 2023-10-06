const { QuickDB } = require("quick.db");

const db = new QuickDB();

class MoveStorage {

    addMove(moveStr) {
        const { fen, move, score } = this.readMove(moveStr);
        if (!this.check(moveStr)) {
            db.set(fen, moveStr);
        }
    }

    check(moveStr) {
        const m = this.readMove(moveStr);
        const { fen, move, score } = m;
        if (!db.has(fen)) return false;
        var d;
        db.get(fen).then(data => d = data);

        return d;
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

module.exports = new MoveStorage()