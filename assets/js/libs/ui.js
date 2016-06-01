/*
    UI layer - contains all logic around DOM manipulation and player actions on the UI.
*/
var UI = (function () {
    // nodelist containing the available game options (ex: player vs computer, computer vs computer)
    var $gameStartOptions = [];

    // placeholder array containing the available moves
    var movesList = [];

    // placeholder object containing timeout for move click event
    var clickTimeout = null;

    var _private = {
        /**
            Starts the UI.
            Sets the available moves in the header; subscribes to the game engine and binds click events
        */
        setUI: function () {
            // creates the available moves in the header
            movesList = Moves.getMovesList();
            var $headerMovesList = document.querySelector(".js_header-moves");
            for (var countMoves = 0; countMoves < movesList.length; countMoves++) {
                $headerMovesList.appendChild(_ui.getMoveIcon(movesList[countMoves]));
            }

            // bind events
            _private.bindEvents();

            // subscribe UI refresh method to game engine
            Game.subscribe(_ui.refresh);
        },
        /**
            Binds various click events on the UI.
        */
        bindEvents: function () {
            // get game start options nodelist (eg: player vs computer etc.)
            $gameStartOptions = document.querySelectorAll(".js_nav-game-start");

            // loop through each game start option and bind click event
            for (var countOptions = 0; countOptions < $gameStartOptions.length; countOptions++) {
                var $option = $gameStartOptions[countOptions];
                $option.addEventListener("click", function () {
                    var $this = this;
                    $gameStartOptions.removeClass("st-active");
                    $this.addClass("st-active");

                    // read data- attribute to get the player types for the gamee option
                    var gameProps = JSON.parse($this.getAttribute('data-players'));

                    // call game start with the player types
                    Game.start(gameProps.p1, gameProps.p2);
                });
            }

            // bind game stop event - this is bound to game start option in the NAV as well as the 'Stop' button after a round is complete
            var $gameStop = document.querySelectorAll(".js_game-stop");
            $gameStop.addEvent("click", function (obj, event) {
                event.stopPropagation(); // prevent click propagation in parent (useful for NAV)

                // call helper method which finishes the game
                _private.finishGame();
            });

            // bind game continue event - this allows the game to move to the next round
            var $gameAgainButton = document.querySelector(".js_button-again");
            $gameAgainButton.addEventListener("click", function () {
                Game.continue();
            });
        },
        /**
            Helper method which finishes the game
        */
        finishGame: function () {
            $gameStartOptions.removeClass("st-active");
            Game.finish();
        }
    };

    // collection of UI methods that generate DOM nodes
    var _ui = {
        /**
            Generates an SVG element for the particular move.
            @param {string} move: The move for which to generate the icon (including SVG)
            @return {SVG}: The generated SVG for the particular move.
        */
        getMoveIcon: function (move) {
            var $moveIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            $moveIcon.addClass("icon icon_play icon_play--" + move.toLowerCase());
            var $moveIconUse = document.createElementNS("http://www.w3.org/2000/svg", "use");
            $moveIconUse.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#icon-" + move.toLowerCase());
            $moveIcon.appendChild($moveIconUse);
            return $moveIcon;
        },
        /**
            Generates the board for a player. This includes the available moves, state and click events.
            @param {object} player: The player for which to generate the board.
            @param {bool} hasTurn: Whether the player has the turn or not.
            @return {LI}: The generated board containing the moves and state for the player.
        */
        getBoardForPlayer: function (player, hasTurn) {
            // generate board container
            var $playerBoard = document.createElement("li");
            $playerBoard.addClass("session_board-item");

            // if player is COMPUTER, set specific class to differentiate moves
            if (player.type === Game.PLAYERS.COMPUTER) {
                $playerBoard.addClass("session_board-item--c");
            }

            // generate moves list
            var $playerMovesList = document.createElement("ul");
            $playerMovesList.addClass("session_moves-list");

            // set done state class if player has done the move
            if (player.move !== -1) {
                $playerMovesList.addClass("st-done");
            }
            else if (!hasTurn) { // set waiting state if player doesn't have the turn and hasn't done the move
                $playerMovesList.addClass("st-waiting")
            }

            // loop through the available moves
            for (var countMoves = 0; countMoves < movesList.length; countMoves++) {
                (function () { // wrap in it's own closure for each move
                    var move = movesList[countMoves];
                    // generate move container
                    var $moveContainer = document.createElement("li");
                    $moveContainer.addClass("session_moves-item");
                    // mark move as selected if this is the player's move
                    if (player.move === move) {
                        $moveContainer.addClass("st-selected");
                    }
                    $moveContainer.appendChild(_ui.getMoveIcon(move));

                    // if player is HUMAN, bind click event for each move
                    if (player.type === Game.PLAYERS.HUMAN) {
                        $moveContainer.addEventListener("click", function () {
                            window.clearTimeout(clickTimeout);
                            // set a click timeout to handle double clicking
                            clickTimeout = window.setTimeout(function () {
                                Game.play(player, move);
                            }, 100);
                        }, false);
                    }
                    
                    // generate move title
                    var $moveTitle = document.createElement("span");
                    $moveTitle.addClass("session_moves-title");
                    $moveTitle.innerText = move;
                    $moveContainer.appendChild($moveTitle);

                    $playerMovesList.appendChild($moveContainer);
                }());
            }

            // append moves list to player board
            $playerBoard.appendChild($playerMovesList);

            return $playerBoard;
        },
        /**
            Sets the game session area, including scores and game state.
        */
        generateSession: function () {
            // object containing current game object
            var currentGame = Game.current;
            // current players
            var players = currentGame.players;

            // get player list
            var $playersList = document.querySelector(".js_game-players");
            $playersList.empty();

            // get scores list
            var $scoresList = document.querySelector(".js_game-scores");
            $scoresList.empty();

            // get session player boards
            var $sessionBoardList = document.querySelector(".js_session_board-list");
            $sessionBoardList.empty();

            // for each player
            for (var countPlayers = 0; countPlayers < players.length; countPlayers++) {
                var player = players[countPlayers];

                // generate player container
                var $player = document.createElement("li");
                $player.addClass("session_players-item");
                $player.innerText = player.name;
                $playersList.appendChild($player);

                // add turn indicator for player
                var $turnElement = document.createElement("span");
                $turnElement.addClass("session_players-turn");
                $turnElement.innerText = "Your Turn";
                $player.appendChild($turnElement);
                
                // if player has turn, add state class
                if (currentGame.turn === countPlayers) {
                    $player.addClass("st-hasturn");
                }

                // generate player score item
                var $score = document.createElement("li");
                $score.addClass("session_scores-item");
                $score.innerText = player.score;
                $scoresList.appendChild($score);

                // call the above method to generate the player board
                $sessionBoardList.appendChild(_ui.getBoardForPlayer(player, (currentGame.turn === countPlayers)));
            }

            // if game over, round is over - show result
            if (currentGame.gameOver) {
                // round winner element
                var $gameWinner = document.querySelector(".js_session-winner");
                // round moves element
                var $gameMoves = document.querySelector(".js_session-moves");
                // round moves description element
                var $gameDesc = document.querySelector(".js_session_description");

                $gameMoves.empty();

                // if no winner is specified, there was a draw!
                if (currentGame.winner === -1) {
                    $gameWinner.innerText = "That was a draw!";
                    $gameDesc.innerText = "Both players played " + currentGame.players[0].move;
                }
                else {
                    // set winner's name
                    $gameWinner.innerText = currentGame.winner.name + " wins";
                    // set round moves description (this only sets the first part, eg: ROCK beats)
                    $gameDesc.innerText = currentGame.winner.move + " beats";

                    // loop through the players
                    for (var countPlayers = 0; countPlayers < currentGame.players.length; countPlayers++) {
                        var player = currentGame.players[countPlayers];

                        // get move icon for each player
                        var $playerMove = _ui.getMoveIcon(player.move);

                        // if this move is the winning move, mark it with state class
                        if (player.move === currentGame.winner.move) {
                            $playerMove.addClass("st-winner");
                        }
                        else { // if not the winning move, finish the game description (eg: [ROCK beats] + SCISSORS)
                            $gameDesc.innerText += " " + player.move;
                        }
                        $gameMoves.appendChild($playerMove);
                    }
                }
            }
        },
        /**
            Refreshes the game area by calling the appropriate UI methods based on the game state. 
            This method is subscribed to the game engine and gets called everytime a game event happens.
        */
        refresh: function () {
            // get session area
            var $session = document.querySelector(".js_session");

            // get current game
            var currentGame = Game.current;

            // if there are players in the game, set session as active
            if (currentGame.players.length > 0) {
                $session.addClass("st-active");
                // if round is over, add state class
                if (currentGame.gameOver) {
                    $session.addClass("st-gameover");
                }
                else {
                    $session.removeClass("st-gameover");
                }
                // call UI method to set the session DOM
                _ui.generateSession();
            }
            else { // game is not active, remove state class
                $session.removeClass("st-active");
            };
        }
    };

    return {
        start: _private.setUI
    };
})();