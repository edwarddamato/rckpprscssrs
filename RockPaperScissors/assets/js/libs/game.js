var Game = (function () {
    var currentGame = {
        turn: 0,
        gameOver: false,
        players: []
    };

    var gameTimeout = {};

    var MOVES = {
        ROCK: "ROCK",
        PAPER: "PAPER",
        SCISSORS: "SCISSORS"
    };
    
    var PLAYERS = {
        HUMAN: 0,
        COMPUTER: 1
    };

    var movesLogic = {
        ROCK: {
            beats: [MOVES.SCISSORS]
        },
        PAPER: {
            beats: [MOVES.ROCK]
        },
        SCISSORS: {
            beats: [MOVES.PAPER]
        }
    };

    var _moves = {
        getWinner: function (move1, move2) {
            return movesLogic[move1].beats.indexOf(move2) > -1 ? move1 : move2;
        }
    };

    var _game = {
        subscribers: [],
        start: function (p1, p2) {
            currentGame.gameOver = false;
            currentGame.turn = 0;
            currentGame.players = [{
                type: p1,
                score: 0,
                move: -1
            },
            {
                type: p2,
                score: 0,
                move: -1
            }];

            _game.updateSubscribers();
            _game.waitForTurn();
        },
        finish: function () {
            currentGame.players = [];
            _game.updateSubscribers();
        },
        continue: function () {
            currentGame.gameOver = false;
            currentGame.turn = 0;
            currentGame.players[0].move = -1;
            currentGame.players[1].move = -1;

            _game.updateSubscribers();
            _game.waitForTurn();
        },
        play: function (player, move) {
            player.move = move;

            _game.waitForTurn();
            _game.updateSubscribers();
        },
        generateMove: function (againstPlayer, callback) {
            // I'm a computer, let me put a little delay
            clearTimeout(gameTimeout);
            gameTimeout = window.setTimeout(function () {
                var movesList = Tools.getMovesList();
                var moveToDo = movesList[(Math.floor(Math.random() * (movesList.length - 1 + 1) + 1)) - 1];

                callback(moveToDo);
            }, 1000);
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
                    _game.generateMove(player2, function (move) {
                        _game.play(player1, move);
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
                    _game.generateMove(player1, function (move) {
                        _game.play(player2, move);
                    });
                    return;
                }
            }

            // if both players made their move, check the score!
            if (player1.move !== -1 && player2.move !== -2) {
                // if move is the same, draw
                if (player1.move === player2.move) {

                }
                else {
                    var winnerMove = _moves.getWinner(player1.move, player2.move);
                    if (player1.move === winnerMove) {
                        player1.score++;
                    }

                    else {
                        player2.score++;
                    }
                }

                currentGame.gameOver = true;
                _game.updateSubscribers();
            }
        },
        subscribe: function (subscriber) {
            _game.subscribers.push(subscriber);
        },
        updateSubscribers: function () {
            for (var countSubs = 0; countSubs < _game.subscribers.length; countSubs++) {
                _game.subscribers[countSubs]();
            }
        }
    };

    return {
        start: _game.start,
        finish: _game.finish,
        play: _game.play,
        continue: _game.continue,
        waitForTurn: _game.waitForTurn,
        getCurrent: currentGame,
        subscribe: _game.subscribe,
        getWinner: _moves.getWinner,
        generateMove: _game.generateMove,
        PLAYERS: PLAYERS,
        MOVES: MOVES
    };
})();