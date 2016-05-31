/*
    Contains the moves available in the game (ex: rock, paper, scissors) and all 
    logic surrounding moves (ex: rock beats scissors).
*/
var Moves = (function () {
    // MOVES enum - defines moves available in game
    var MOVES = {
        ROCK: "ROCK",
        PAPER: "PAPER",
        SCISSORS: "SCISSORS"
    };

    // JSON object which defines which moves beat which moves
    var logic = {
        ROCK: { // rock beats scissors
            beats: [MOVES.SCISSORS]
        },
        PAPER: { // paper beats rock
            beats: [MOVES.ROCK]
        },
        SCISSORS: { // scissors beats paper
            beats: [MOVES.PAPER]
        }
    };

    // private list of methods
    var _private = {
        // returns the winner between two given moves (ex: winner from paper, rock returns paper)
        getWinner: function (move1, move2) {
            // uses JSON object above to check whether move1 beats move2
            return logic[move1].beats.indexOf(move2) > -1 ? move1 : move2;
        },
        // returns an array of moves from the MOVES enum
        getMovesList: function () {
            var arrMoves = [];
            var moves = MOVES;
            for (var move in moves) {
                if (moves.hasOwnProperty(move)) {
                    arrMoves.push(moves[move]);
                }
            }
            return arrMoves;
        },
        // generates a random move from the array of moves
        getRandomMove: function () {
            var movesList = _private.getMovesList();
            // generates a random number from a specific range (range being the length of the moves list)
            // based from: http://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
            return movesList[(Math.floor(Math.random() * (movesList.length - 1 + 1) + 1)) - 1];
        }
    };

    return {
        getMovesList: _private.getMovesList,
        getRandomMove: _private.getRandomMove,
        getWinner: _private.getWinner,
        MOVES: MOVES
    };
})();