var Tools = (function () {
    var _private = {
        getMovesList: function () {
            var arrMoves = [];
            var moves = Game.MOVES;
            for (var move in moves) {
                if (moves.hasOwnProperty(move)) {
                    arrMoves.push(moves[move]);
                }
            }
            return arrMoves;
        }
    };

    return {
        getMovesList: _private.getMovesList
    };
})();