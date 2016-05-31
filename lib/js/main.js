Element.prototype.addClass = function(classes) {
    for (var $this = this, currentClasses = $this.hasAttribute("class") ? $this.getAttribute("class").split(" ") : [], newClasses = classes.split(" "), countNewClasses = 0; countNewClasses < newClasses.length; countNewClasses++) {
        var newClass = newClasses[countNewClasses];
        currentClasses.indexOf(newClass) < 0 && currentClasses.push(newClass);
    }
    $this.setAttribute("class", currentClasses.join(" "));
}, Element.prototype.removeClass = function(classes) {
    for (var $this = this, currentClasses = $this.hasAttribute("class") ? $this.getAttribute("class").split(" ") : [], newClasses = [], classesToRemove = classes.split(" "), countCurrentClasses = 0; countCurrentClasses < currentClasses.length; countCurrentClasses++) {
        var currentClass = currentClasses[countCurrentClasses];
        classesToRemove.indexOf(currentClass) < 0 && newClasses.push(currentClass);
    }
    $this.setAttribute("class", newClasses.join(" "));
}, NodeList.prototype.removeClass = function(classes) {
    for (var $this = this, countElem = 0; countElem < $this.length; countElem++) {
        var $elem = $this[countElem];
        1 === $elem.nodeType && $elem.removeClass(classes);
    }
}, NodeList.prototype.addEvent = function(event, func) {
    for (var $this = this, countElem = 0; countElem < $this.length; countElem++) $this[countElem].addEventListener(event, function(event) {
        func(this, event);
    });
}, Element.prototype.empty = function() {
    for (var $element = this; $element.firstChild; ) $element.removeChild($element.firstChild);
};

var Game = function() {
    var currentGame = {}, gameTimeout = {}, PLAYERS = {
        HUMAN: 0,
        COMPUTER: 1
    }, _private = {
        subscribers: [],
        subscribe: function(subscriber) {
            _private.subscribers.push(subscriber);
        },
        updateSubscribers: function() {
            for (var countSubs = 0; countSubs < _private.subscribers.length; countSubs++) _private.subscribers[countSubs]();
        },
        start: function(p1, p2) {
            currentGame.winner = -1, currentGame.gameOver = !1, currentGame.turn = 0, currentGame.players = [ {
                type: p1,
                score: 0,
                move: -1,
                name: ""
            }, {
                type: p2,
                score: 0,
                move: -1,
                name: ""
            } ], currentGame.players[0].name = currentGame.players[0].type === PLAYERS.COMPUTER ? "COMPUTER 1" : "HUMAN 1", 
            currentGame.players[1].name = currentGame.players[1].type === PLAYERS.COMPUTER ? "COMPUTER 2" : "HUMAN 2", 
            _private.updateSubscribers(), _private.waitForTurn();
        },
        finish: function() {
            currentGame.players = [], _private.updateSubscribers();
        },
        "continue": function() {
            currentGame.gameOver = !1, currentGame.turn = 0, currentGame.winner = -1, currentGame.players[0].move = -1, 
            currentGame.players[1].move = -1, _private.updateSubscribers(), _private.waitForTurn();
        },
        play: function(player, move) {
            player.move = move, _private.waitForTurn(), _private.updateSubscribers();
        },
        generateMove: function(againstPlayer, callback) {
            clearTimeout(gameTimeout), gameTimeout = window.setTimeout(function() {
                callback(Moves.getRandomMove());
            }, 2e3);
        },
        waitForTurn: function() {
            currentGame.gameOver = !1;
            var player1 = currentGame.players[0], player2 = currentGame.players[1];
            if (-1 === player1.move) {
                if (currentGame.turn = 0, player1.type === PLAYERS.HUMAN) return;
                if (player1.type === PLAYERS.COMPUTER) return void _private.generateMove(player2, function(move) {
                    _private.play(player1, move);
                });
            }
            if (-1 === player2.move) {
                if (currentGame.turn = 1, player2.type === PLAYERS.HUMAN) return;
                if (player2.type === PLAYERS.COMPUTER) return void _private.generateMove(player1, function(move) {
                    _private.play(player2, move);
                });
            }
            if (-1 !== player1.move && -2 !== player2.move) {
                if (player1.move === player2.move) currentGame.winner = -1; else {
                    var winnerMove = Moves.getWinner(player1.move, player2.move);
                    player1.move === winnerMove ? (player1.score++, currentGame.winner = player1) : (player2.score++, 
                    currentGame.winner = player2);
                }
                currentGame.gameOver = !0, _private.updateSubscribers();
            }
        }
    };
    return {
        PLAYERS: PLAYERS,
        current: currentGame,
        start: _private.start,
        finish: _private.finish,
        play: _private.play,
        "continue": _private["continue"],
        waitForTurn: _private.waitForTurn,
        subscribe: _private.subscribe
    };
}(), Moves = function() {
    var MOVES = {
        ROCK: "ROCK",
        PAPER: "PAPER",
        SCISSORS: "SCISSORS"
    }, logic = {
        ROCK: {
            beats: [ MOVES.SCISSORS ]
        },
        PAPER: {
            beats: [ MOVES.ROCK ]
        },
        SCISSORS: {
            beats: [ MOVES.PAPER ]
        }
    }, _private = {
        getWinner: function(move1, move2) {
            return logic[move1].beats.indexOf(move2) > -1 ? move1 : move2;
        },
        getMovesList: function() {
            var arrMoves = [], moves = MOVES;
            for (var move in moves) moves.hasOwnProperty(move) && arrMoves.push(moves[move]);
            return arrMoves;
        },
        getRandomMove: function() {
            var movesList = _private.getMovesList();
            return movesList[Math.floor(Math.random() * (movesList.length - 1 + 1) + 1) - 1];
        }
    };
    return {
        getMovesList: _private.getMovesList,
        getRandomMove: _private.getRandomMove,
        getWinner: _private.getWinner,
        MOVES: MOVES
    };
}(), Tools = function() {
    return {};
}(), UI = function() {
    var $gameStartOptions = [], movesList = [], _private = {
        start: function() {
            _private.set(), _private.bindEvents();
        },
        set: function() {
            movesList = Moves.getMovesList();
            for (var $headerMovesList = document.querySelector(".js_header-moves"), countMoves = 0; countMoves < movesList.length; countMoves++) $headerMovesList.appendChild(_ui.getMoveIcon(movesList[countMoves]));
            Game.subscribe(_ui.refresh);
        },
        bindEvents: function() {
            $gameStartOptions = document.querySelectorAll(".js_nav-game-start");
            for (var countOptions = 0; countOptions < $gameStartOptions.length; countOptions++) {
                var $option = $gameStartOptions[countOptions];
                $option.addEventListener("click", function() {
                    var $this = this;
                    $gameStartOptions.removeClass("st-active"), $this.addClass("st-active");
                    var gameProps = JSON.parse($this.getAttribute("data-players"));
                    Game.start(gameProps.p1, gameProps.p2);
                });
            }
            var $gameStop = document.querySelectorAll(".js_nav-game-stop");
            $gameStop.addEvent("click", function(obj, event) {
                event.stopPropagation(), $gameStartOptions.removeClass("st-active"), Game.finish();
            });
            var $gameStop = document.querySelectorAll(".js_nav-game-stop");
            $gameStop.addEvent("click", function(obj, event) {
                event.stopPropagation(), _ui.finishGame();
            });
            var $gameStopButton = document.querySelector(".js_button-stop");
            $gameStopButton.addEventListener("click", function() {
                _ui.finishGame();
            });
            var $gameAgainButton = document.querySelector(".js_button-again");
            $gameAgainButton.addEventListener("click", function() {
                Game["continue"]();
            });
        }
    }, _ui = {
        getMoveIcon: function(move) {
            var $moveIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            $moveIcon.addClass("icon icon_play icon_play--" + move.toLowerCase());
            var $moveIconUse = document.createElementNS("http://www.w3.org/2000/svg", "use");
            return $moveIconUse.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#icon-" + move.toLowerCase()), 
            $moveIcon.appendChild($moveIconUse), $moveIcon;
        },
        getBoardForPlayer: function(player) {
            var $playerBoard = document.createElement("li");
            $playerBoard.addClass("session_board-item"), player.type === Game.PLAYERS.COMPUTER && $playerBoard.addClass("session_board-item--c");
            var $playerMovesList = document.createElement("ul");
            $playerMovesList.addClass("session_moves-list");
            for (var countMoves = 0; countMoves < movesList.length; countMoves++) !function() {
                var move = movesList[countMoves], $moveContainer = document.createElement("li");
                $moveContainer.addClass("session_moves-item"), player.move === move && $moveContainer.addClass("st-selected"), 
                $moveContainer.appendChild(_ui.getMoveIcon(move)), player.type === Game.PLAYERS.HUMAN && $moveContainer.addEventListener("click", function() {
                    Game.play(player, move);
                }, !1);
                var $moveTitle = document.createElement("span");
                $moveTitle.addClass("session_moves-title"), $moveTitle.innerText = move, $moveContainer.appendChild($moveTitle), 
                $playerMovesList.appendChild($moveContainer);
            }();
            return $playerBoard.appendChild($playerMovesList), $playerBoard;
        },
        generateSession: function() {
            var currentGame = Game.current, players = currentGame.players, $playersList = document.querySelector(".js_game-players");
            $playersList.empty();
            var $scoresList = document.querySelector(".js_game-scores");
            $scoresList.empty();
            var $sessionBoardList = document.querySelector(".js_session_board-list");
            $sessionBoardList.empty();
            for (var countPlayers = 0; countPlayers < players.length; countPlayers++) {
                var player = players[countPlayers], $player = document.createElement("li");
                $player.addClass("session_players-item"), $player.innerText = player.name, $playersList.appendChild($player);
                var $turnElement = document.createElement("span");
                $turnElement.addClass("session_players-turn"), $turnElement.innerText = "Your Turn", 
                $player.appendChild($turnElement), currentGame.turn === countPlayers && $player.addClass("st-hasturn");
                var $score = document.createElement("li");
                $score.addClass("session_scores-item"), $score.innerText = player.score, $scoresList.appendChild($score), 
                $sessionBoardList.appendChild(_ui.getBoardForPlayer(player));
            }
            if (currentGame.gameOver) {
                var $gameWinner = document.querySelector(".js_session-winner"), $gameMoves = document.querySelector(".js_session-moves"), $gameDesc = document.querySelector(".js_session_description");
                if ($gameMoves.empty(), -1 === currentGame.winner) $gameWinner.innerText = "That was a draw!", 
                $gameDesc.innerText = "Both players played " + currentGame.players[0].move; else {
                    $gameWinner.innerText = currentGame.winner.name + " wins", $gameDesc.innerText = currentGame.winner.move + " beats";
                    for (var countPlayers = 0; countPlayers < currentGame.players.length; countPlayers++) {
                        var player = currentGame.players[countPlayers], $playerMove = _ui.getMoveIcon(player.move);
                        player.move === currentGame.winner.move ? $playerMove.addClass("st-winner") : $gameDesc.innerText += " " + player.move, 
                        $gameMoves.appendChild($playerMove);
                    }
                }
            }
        },
        finishGame: function() {
            $gameStartOptions.removeClass("st-active"), Game.finish();
        },
        refresh: function() {
            var $session = document.querySelector(".js_session"), currentGame = Game.current;
            currentGame.players.length > 0 ? ($session.addClass("st-active"), currentGame.gameOver ? $session.addClass("st-gameover") : $session.removeClass("st-gameover"), 
            _ui.generateSession()) : $session.removeClass("st-active");
        }
    };
    return {
        start: _private.start
    };
}(), Main = function() {
    UI.start();
}();