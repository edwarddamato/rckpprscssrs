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
        // method to attach a callback
        subscribe: function (subscriber) {
            _private.subscribers.push(subscriber);
        },
        // goes through the attached callbacks and calls them
        updateSubscribers: function () {
            for (var countSubs = 0; countSubs < _private.subscribers.length; countSubs++) {
                _private.subscribers[countSubs]();
            }
        },
        // start of a new game - resets the current game object to its default
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
            currentGame.players[0].name = currentGame.players[0].type === PLAYERS.COMPUTER ? "COMPUTER 1" : "HUMAN 1";
            currentGame.players[1].name = currentGame.players[1].type === PLAYERS.COMPUTER ? "COMPUTER 2" : "HUMAN 2";

            _private.updateSubscribers();
            _private.waitForTurn();
        },
        finish: function () {
            currentGame.players = [];
            _private.updateSubscribers();
        },
        continue: function () {
            currentGame.gameOver = false;
            currentGame.turn = 0;
            currentGame.winner = -1;
            currentGame.players[0].move = -1;
            currentGame.players[1].move = -1;

            _private.updateSubscribers();
            _private.waitForTurn();
        },
        play: function (player, move) {
            player.move = move;

            _private.waitForTurn();
            _private.updateSubscribers();
        },
        generateMove: function (againstPlayer, callback) {
            // I'm a computer, let me put a little delay
            clearTimeout(gameTimeout);
            gameTimeout = window.setTimeout(function () {
                callback(Moves.getRandomMove());
            }, 2000);
        },
        waitForTurn: function () {
            currentGame.gameOver = false;
            var player1 = currentGame.players[0];
            var player2 = currentGame.players[1];

            // check if player 1 made the move
            if (player1.move === -1) {
                currentGame.turn = 0;
                if (player1.type === PLAYERS.HUMAN) {
                    // do nothing, wait for human to play
                    return;
                }
                else if (player1.type === PLAYERS.COMPUTER) {
                    _private.generateMove(player2, function (move) {
                        _private.play(player1, move);
                    });
                    return;
                }
            }


            if (player2.move === -1) {
                currentGame.turn = 1;
                if (player2.type === PLAYERS.HUMAN) {
                    // do nothing, wait for human to play
                    return;
                }
                else if (player2.type === PLAYERS.COMPUTER) {
                    _private.generateMove(player1, function (move) {
                        _private.play(player2, move);
                    });
                    return;
                }
            }

            // if both players made their move, check the score!
            if (player1.move !== -1 && player2.move !== -2) {
                // if move is the same, draw
                if (player1.move === player2.move) {
                    currentGame.winner = -1;
                }
                else {
                    var winnerMove = Moves.getWinner(player1.move, player2.move);
                    if (player1.move === winnerMove) {
                        player1.score++;
                        currentGame.winner = player1;
                    }

                    else {
                        player2.score++;
                        currentGame.winner = player2;
                    }
                }

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