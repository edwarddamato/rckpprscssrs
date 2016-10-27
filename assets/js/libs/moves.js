/*
    Contains the moves available in the game (ex: rock, paper, scissors) and all 
    logic surrounding moves (ex: rock beats scissors).
*/
var Moves = (function () {
    // MOVES enum - defines moves available in game
    var MOVES = {
        ROCK: "ROCK",
        PAPER: "PAPER",
        SCISSORS: "SCISSORS",
        LIZARD: "LIZARD",
        SPOCK: "SPOCK"
    };

    // JSON object which defines which moves beat which moves
    var logic = {
        ROCK: { // rock beats scissors and lizard
            beats: [MOVES.SCISSORS, MOVES.LIZARD]
        },
        PAPER: { // paper beats rock and spock
            beats: [MOVES.ROCK, MOVES.SPOCK]
        },
        SCISSORS: { // scissors beats paper and lizard
            beats: [MOVES.PAPER, MOVES.LIZARD]
        },
        LIZARD: { // lizard beats spock and paper
            beats: [MOVES.SPOCK, MOVES.PAPER]
        },
        SPOCK: { // spock beats rock and scissors
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
            Returns a move which beats the given move. If there is more than 1 move that beats it, returns a random one.
            @param {string} moveeToBeat: The move to beat.
            @return {string}: String representing a move that beats the supplied moveToBeat.
        */
        getMoveBeatsMove: function (moveToBeat) {
            var movesThatBeat = [];
            var moves = MOVES;
            // loop through all the moves logic
            for (var move in logic) {
                if (logic.hasOwnProperty(move)) {
                    // if this move beats the supplied move, add to the array of moves that beat it
                    if (logic[move].beats.indexOf(moveToBeat) > -1) {
                        movesThatBeat.push(move);
                    }
                }
            }

            // get a random move from the array of moves that beat the supplied one
            return movesThatBeat.getRandomValue();
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
        /**
            Returns a random move based on the array of moves available, as generated from the getMovesList method
            @return {string}: The random move generated.
        */
        getRandomMove: function () {
            // generates a random number from a specific range (range being the length of the moves list)
            return _private.getMovesList().getRandomValue();
        },
        /**
            Returns a guessed move based on an array of historical moves.
            Eg: 
                History = [ROCK, PAPER, SCISSORS, ROCK, ROCK, PAPER, SCISSORS, ROCK]
                Guessed next move is: ROCK
                    - start search with 'ROCK,PAPER,SCISSORS,ROCK'
                    - search next occurence
                    - found at the end [ROCK, PAPER, SCISSORS, ROCK,|||ROCK, PAPER, SCISSORS, ROCK||||]
                    - move before that is ROCK, return that move
            @param {array} movesHistory: The array of historical moves, ordered by most recent.
            @return {string}: The guessed next move.
        */
        guessNextMove: function (movesHistory) {
            var nextMove = "";

            // get the last moves - this is done by getting the moves from the first half of the hisotry so
            // it can be compared to the rest of the history
            var lastMoves = movesHistory.slice(0, Math.ceil(movesHistory.length / 2));

            // create a string of the move history - used for comparison (easier to compare strings than arrays)
            var movesHistoryString = movesHistory.join(',');

            // guessed boolean to control while loop
            var guessed = false;
            while (!guessed) {
                // generate string of the last moves array
                var lastMovesString = lastMoves.join(',');

                // search the last moves in the moves history - start from 1 to avoid finding the same moves at the
                // very beginning - there is no move to guess if it is found at position 0
                var lastMovesInHistoryPos = movesHistoryString.indexOf(lastMovesString, 1);

                // if something has been found
                if (lastMovesInHistoryPos > 0) {
                    // use the position of the 'last moves' found in the moves history string to cut the string until that position
                    // we now have an array which stops right before the last moves
                    var newHistory = movesHistoryString.substr(0, lastMovesInHistoryPos - 1).split(',');

                    // get the last item in the array - this is the guessed move
                    nextMove = newHistory[newHistory.length - 1];
                    guessed = true;
                }
                else { // if nothing has been found, shorten the last moves to search for by removing an item from the array
                    if (lastMoves.length > 1) {
                        lastMoves.splice(-1, 1);
                    }
                    else { // if there is nothing else to remove, then nothing has been found in the history
                        break;
                    }
                }
            }
            
            // return the guessed next move
            return nextMove;
        }
    };

    return {
        getMovesList: _private.getMovesList,
        getRandomMove: _private.getRandomMove,
        getWinner: _private.getWinner,
        guessNextMove: _private.guessNextMove,
        getMoveBeatsMove: _private.getMoveBeatsMove,
        MOVES: MOVES
    };
})();