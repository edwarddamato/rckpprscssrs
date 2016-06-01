/*
    Game engine - contains methods and functionality used by the UI
    to play the game.
*/
var Game = (function () {
    // stores current game object
    var currentGame = {};

    // stores game timeout object
    var gameTimeout = {};
    
    // PLAYERS enum - type of players allowed to play this game
    var PLAYERS = {
        HUMAN: 0,
        COMPUTER: 1
    };

    // private list of methods and objects
    var _private = {
        /* an array of callbacks that can attach themselves to the game object;
        these callbacks are called whenever the game decides - these are used by the UI so that the UI
        is updated when the game is updated.
        */
        subscribers: [],
        /**
            Attaches a function to the list of subscribers to be called on a game event.
        */
        subscribe: function (subscriber) {
            _private.subscribers.push(subscriber);
        },
        /**
            Goes through all attached subscribers and calls them.
        */
        updateSubscribers: function () {
            for (var countSubs = 0; countSubs < _private.subscribers.length; countSubs++) {
                _private.subscribers[countSubs]();
            }
        },
        /**
            Starts a new game with the given two player types. Game assumes always 2 players.
            @param {int} p1: Type of player 1.
            @param {int} p2: Type of player 2.
        */
        start: function (p1, p2) {
            currentGame.winner = -1; // no winner specified
            currentGame.gameOver = false; // game is not over
            currentGame.turn = 0; // turn for first player
            currentGame.players = [{ // array of 2 players
                type: p1,
                score: 0,
                move: -1,
                name: ""
            },
            {
                type: p2,
                score: 0,
                move: -1,
                name: ""
            }];
            // set friendly names for players
            currentGame.players[0].name = currentGame.players[0].type === PLAYERS.COMPUTER ? "COMPUTER 1" : "HUMAN 1";
            currentGame.players[1].name = currentGame.players[1].type === PLAYERS.COMPUTER ? "COMPUTER 2" : "HUMAN 2";

            // update subscribers (call them)
            _private.updateSubscribers();

            // wait for the next turn
            _private.waitForTurn();
        },
        /**
            Finishes a game; just clears the list of players and updates the subscribers.
        */
        finish: function () {
            currentGame.players = [];
            _private.updateSubscribers();
        },
        /**
            Prepares the game for the next round, keeping scores and the same players. Updates subscribers.
        */
        continue: function () {
            currentGame.gameOver = false;
            currentGame.turn = 0;
            currentGame.winner = -1;
            currentGame.players[0].move = -1;
            currentGame.players[1].move = -1;

            _private.updateSubscribers();
            _private.waitForTurn();
        },
        /**
            Method used to make a move for a player. Updates subscribers.
            @param {obj} player: Object representing the player making a move.
            @param {string} move: String representing the move made by the player.
        */
        play: function (player, move) {
            player.move = move;
            Storage.storeMove(player, move);

            _private.waitForTurn();
            _private.updateSubscribers();
        },
        /**
            Method used to generate a player against a player. This method is only used by a COMPUTER player hence a delay
            is applied as otherwise the game will be too fast. The COMPUTER tries to guess the HUMAN's MOVE history and plays accordingly.
            @param {obj} againstPlayer: Object representing the player that the move is being made against. If the player is human, some thinking
            by the computer is done based on the player's history.
            @param {function} callback: The function to call after the move has been generated.
        */
        generateMove: function (againstPlayer, callback) {
            // I'm a computer, let me put a little delay
            clearTimeout(gameTimeout);
            gameTimeout = window.setTimeout(function () {
                // if we're playing against a HUMAN, let's do some thinking
                if (againstPlayer.type === PLAYERS.HUMAN) {

                    // get historical moves for opponent - this returns also the round move; we shouldn't use that!
                    var opponentMoves = Storage.getMoves(againstPlayer);
                    // if there are less than 2 moves (i.e. no historical moves or just 1 move (the current move)), do nothing
                    if (opponentMoves.length < 2) {
                        callback(Moves.getRandomMove());
                    }
                    else {
                        // remove the last move, we don't need that as it's the move currently being played
                        opponentMoves.splice(-1, 1);
                        
                        // try and guess next move - move history must be in descending order (most recent first)
                        var guessedOpponentMove = Moves.guessNextMove(opponentMoves.reverse());
                        if (guessedOpponentMove.length > 0) {
                            // throw against the guess move
                            callback(Moves.getMoveBeatsMove(guessedOpponentMove));
                        }
                        else {
                            // throw random move
                            callback(Moves.getRandomMove());
                        }
                    }
                }
                else {
                    // get random move
                    callback(Moves.getRandomMove());
                }
            }, 2000);
        },
        /**
            Method which makes the game tick. Checks who made moves and who hasn't and sets the game's turn accordingly. Updates subscribers.
        */
        waitForTurn: function () {
            // we're waiting for a turn, game is not yet over
            currentGame.gameOver = false;
            // set players
            var player1 = currentGame.players[0];
            var player2 = currentGame.players[1];

            // check if player 1 made the move
            if (player1.move === -1) {
                currentGame.turn = 0; // player 1 hasn't made the move, their turn
                if (player1.type === PLAYERS.HUMAN) {
                    // do nothing, wait for human to play
                    return;
                }
                else if (player1.type === PLAYERS.COMPUTER) {
                    // player is computer, generate move and make it (against player 2)
                    _private.generateMove(player2, function (move) {
                        _private.play(player1, move);
                    });
                    return;
                }
            }

            // check if player 2 made the move
            if (player2.move === -1) {
                currentGame.turn = 1; // player 2 hasn't made the move, their turn
                if (player2.type === PLAYERS.HUMAN) {
                    // do nothing, wait for human to play
                    return;
                }
                else if (player2.type === PLAYERS.COMPUTER) {
                    // player is computer, generate move and make it (against player 1)
                    _private.generateMove(player1, function (move) {
                        _private.play(player2, move);
                    });
                    return;
                }
            }

            // if both players made their move, check the round winner!
            if (player1.move !== -1 && player2.move !== -2) {
                // if move is the same, draw
                if (player1.move === player2.move) {
                    currentGame.winner = -1; // everyone wins (or loses)
                }
                else {
                    // get the winner between the two moves
                    var winnerMove = Moves.getWinner(player1.move, player2.move);

                    // player 1 wins, update score and set as winner
                    if (player1.move === winnerMove) {
                        player1.score++;
                        currentGame.winner = player1;
                    }
                    // player 2 wins, update score and set as winner
                    else {
                        player2.score++;
                        currentGame.winner = player2;
                    }
                }

                // set gamee as game over and update subscribers
                currentGame.gameOver = true;
                _private.updateSubscribers();
            }
        }
    };

    return {
        PLAYERS: PLAYERS,
        current: currentGame,
        start: _private.start,
        finish: _private.finish,
        play: _private.play,
        continue: _private.continue,
        waitForTurn: _private.waitForTurn,
        subscribe: _private.subscribe
    };
})();