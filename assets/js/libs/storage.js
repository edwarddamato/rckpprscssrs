/*
    Contains logic to store and retrieve a player's move history in the browser sessionStorage object.
    Since everything is stored in the sessionStorage; information is cleared when browser tab is closed.
*/
var Storage = (function () {
    var playHistory = {

    };

    // private list of methods
    var _private = {
        /**
            Stores a move for a player's history. If no history is present, it is created.
            History information is saved as a JSON string and parsed/stringified accordingly.
            @param {object} player: The player for which to store the history.
            @param {string} move: The move that the player has made.
        */
        storeMove: function (player, move) {
            // if Storage is supported
            if (typeof (Storage) !== typeof undefined) {
                // check if playHistory object is saved
                if (sessionStorage.playHistory) {
                    // if yes, retrieve it and parse it 
                    playHistory = JSON.parse(sessionStorage.playHistory);
                }
                // check if playhistory object contains any history for the player
                if (typeof playHistory[player.name] === typeof undefined ||
                    playHistory[player.name].length < 1) {
                    // if not, initialize a new array
                    playHistory[player.name] = new Array();
                }
                // push the new move
                playHistory[player.name].push(move);

                // save the object to the sessionStorage
                sessionStorage.playHistory = JSON.stringify(playHistory);
            }
        },
        /**
            Returns an array of historical moves for a given player. History is returned in ascending order (oldest first).
            @param {object} player: The player for which to return the history.
            @returns {Array}: The moves that the player has made.
        */
        getMoves: function (player) {
            if (typeof (Storage) !== typeof undefined) {
                if (sessionStorage.playHistory) {
                    playHistory = JSON.parse(sessionStorage.playHistory);
                }
                if (typeof playHistory[player.name] !== typeof undefined) {
                    return playHistory[player.name];
                }
                
                return [];
            }
        }
    };

    return {
        storeMove: _private.storeMove,
        getMoves: _private.getMoves
    };
})();