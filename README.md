# Rock-Paper-Scissors (Lizard-Spock)

> Rock-Paper-Scissors-Lizard-Spock fun!

This game is built using HTML, CSS and vanilla JavaScript.


## Install

If downloaded locally, install packages using `npm`.
```
$ npm install
```

When .SCSS or .JS files are modified, rebuild using Grunt.

Go to `RockPaperScissors/node_modules/.bin`.

```
grunt.cmd uglify

grunt.cmd sass
```

## Usage
Just download the source and open `index.html`. Alternatively, go to the [GitHub Page](http://edwarddamato.github.io/rckpprscssrs/index.html).

Game modes available are:
* Player vs. Computer -- here the COMPUTER uses your playing history for the session to try and guess your next move.
* Computer vs. Computer
* Player vs. Player

## Options

To modify the moves, open `moves.js` in `assets/js/libs` and modify the `MOVES` ENUM.

```js
// MOVES enum - defines moves available in game
var MOVES = {
    ROCK: "ROCK",
    PAPER: "PAPER",
    SCISSORS: "SCISSORS",
    LIZARD: "LIZARD",
    SPOCK: "SPOCK"
};
```
## Browsers/Devices

Tested on:
* Google Chrome
* Mozilla FireFox
* Internet Explorer 9, 10, 11, EDGE
* OS X Safari 9.1 (Desktop)
* iOS 7, 8, 9 (iPhone/iPad)
* Android 4.4, 5

## License

© [Edward D'Amato](http://www.edwarddamato.com)