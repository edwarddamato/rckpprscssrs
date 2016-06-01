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
        //LIZARD: "LIZARD",
        //SPOCK: "SPOCK"
    };

    // JSON object which defines which moves beat which moves
    var logic = {
        ROCK: { // rock beats scissors
            beats: [MOVES.SCISSORS, MOVES.LIZARD]
        },
        PAPER: { // paper beats rock
            beats: [MOVES.ROCK, MOVES.SPOCK]
        },
        SCISSORS: { // scissors beats paper
            beats: [MOVES.PAPER, MOVES.LIZARD]
        },
        LIZARD: {
            beats: [MOVES.SPOCK, MOVES.PAPER]
        },
        SPOCK: {
            beats: [MOVES.ROCK, MOVES.SCISSORS]
        }
    };

    // private list of methods
    var _private = {

        /**
            Returns the winner between two given moves (ex: winner from paper, rock returns paper)
            @param {string} move1: String representing move1 to compare with move2.
            @param {string} move2: String representing move2 to compare with move1.
            @return {string}: String representing the winner move between move1 and move2.
        */
        getWinner: function (move1, move2) {
            // uses JSON object above to check whether move1 beats move2
            return logic[move1].beats.indexOf(move2) > -1 ? move1 : move2;
        },

        /**
            Returns an array of moves generated from the MOVES enum.
            @return {array}: The array containing the available moves.
        */
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

        /**
            Returns a random move based on the array of moves available, as generated from the getMovesList method
            @return {string}: The random move generated.
        */
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