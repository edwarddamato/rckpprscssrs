var UI = (function () {
    var $gameStartOptions = [];

    var _private = {
        start: function () {
            _private.set();
            _private.bindEvents();
        },
        set: function () {
            var movesList = Tools.getMovesList();
            var $headerMovesList = document.querySelector(".js_header-moves");
            for (var countMoves = 0; countMoves < movesList.length; countMoves++) {
                $headerMovesList.appendChild(_ui.getMoveIcon(movesList[countMoves]));
            }

            Game.subscribe(_ui.refresh);
        },
        bindEvents: function () {
            // bind game start options
            $gameStartOptions = document.querySelectorAll(".js_nav-game-start");

            for (var countOptions = 0; countOptions < $gameStartOptions.length; countOptions++) {
                var $option = $gameStartOptions[countOptions];
                $option.addEventListener("click", function () {
                    var $this = this;
                    $gameStartOptions.removeClass("st-active");
                    $this.addClass("st-active");
                    var gameProps = JSON.parse($this.getAttribute('data-players'));
                    Game.start(gameProps.p1, gameProps.p2);
                });
            }

            var $gameStop = document.querySelectorAll(".js_nav-game-stop");
            $gameStop.addEvent("click", function (obj, event) {
                event.stopPropagation();

                $gameStartOptions.removeClass("st-active");
                Game.finish();
            });

            var $gameStop = document.querySelectorAll(".js_nav-game-stop");
            $gameStop.addEvent("click", function (obj, event) {
                event.stopPropagation();

                _ui.finishGame();
            });

            var $gameStopButton = document.querySelector(".js_button-stop");
            $gameStopButton.addEventListener("click", function () {
                _ui.finishGame();

            });
            var $gameAgainButton = document.querySelector(".js_button-again");
            $gameAgainButton.addEventListener("click", function () {
                Game.continue();
            });
        }
    };

    var _ui = {
        getMoveIcon: function (move) {
            var $moveIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            $moveIcon.addClass("icon icon_play icon_play--" + move.toLowerCase());
            var $moveIconUse = document.createElementNS("http://www.w3.org/2000/svg", "use");
            $moveIconUse.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#icon-" + move.toLowerCase());
            $moveIcon.appendChild($moveIconUse);
            return $moveIcon;
        },
        getBoardForPlayer: function (player) {
            var $playerBoard = document.createElement("li");
            $playerBoard.addClass("session_board-item");
            if (player.type === Game.PLAYERS.COMPUTER) {
                $playerBoard.addClass("session_board-item--c");
            }

            var $playerMovesList = document.createElement("ul");
            $playerMovesList.addClass("session_moves-list");

            var movesList = Tools.getMovesList();
            var move = {};
            for (var countMoves = 0; countMoves < movesList.length; countMoves++) {
                (function () {

                    var move = movesList[countMoves];
                    var $moveContainer = document.createElement("li");
                    $moveContainer.addClass("session_moves-item");
                    if (player.move === move) {
                        $moveContainer.addClass("st-selected");
                    }
                    $moveContainer.appendChild(_ui.getMoveIcon(move));

                    if (player.type === Game.PLAYERS.HUMAN) {
                        $moveContainer.addEventListener("click", function () {
                            Game.play(player, move);
                        }, false);
                    }

                    var $moveTitle = document.createElement("span");
                    $moveTitle.addClass("session_moves-title");
                    $moveTitle.innerText = move;
                    $moveContainer.appendChild($moveTitle);

                    $playerMovesList.appendChild($moveContainer);
                }());
            }

            $playerBoard.appendChild($playerMovesList);

            return $playerBoard;
        },
        generateSession: function () {
            var currentGame = Game.getCurrent;
            var players = currentGame.players;
            var $playersList = document.querySelector(".js_game-players");
            $playersList.empty();

            var $scoresList = document.querySelector(".js_game-scores");
            $scoresList.empty();

            var $sessionBoardList = document.querySelector(".js_session_board-list");
            $sessionBoardList.empty();

            for (var countPlayers = 0; countPlayers < players.length; countPlayers++) {
                var player = players[countPlayers];
                var $player = document.createElement("li");
                $player.addClass("session_players-item");
                $player.innerText = player.type === Game.PLAYERS.HUMAN ? ("Human " + (countPlayers+1)) : ("Computer " + (countPlayers+1));
                $playersList.appendChild($player);

                var $turnElement = document.createElement("span");
                $turnElement.addClass("session_players-turn");
                $turnElement.innerText = "Your Turn";
                $player.appendChild($turnElement);
                
                if (currentGame.turn === countPlayers) {
                    $player.addClass("st-hasturn");
                }

                var $score = document.createElement("li");
                $score.addClass("session_scores-item");
                $score.innerText = player.score;
                $scoresList.appendChild($score);

                $sessionBoardList.appendChild(_ui.getBoardForPlayer(player));
            }

            if (currentGame.gameOver) {

            }
        },
        finishGame: function () {
            $gameStartOptions.removeClass("st-active");
            Game.finish();
        },
        refresh: function () {
            var $session = document.querySelector(".js_session");
            var currentGame = Game.getCurrent;

            if (currentGame.players.length > 0) {
                $session.addClass("st-active");
                if (currentGame.gameOver) {
                    $session.addClass("st-gameover");
                }
                else {
                    $session.removeClass("st-gameover");
                }
                _ui.generateSession();
            }
            else {
                $session.removeClass("st-active");
            };
        }
    };

    return {
        start: _private.start
    };
})();