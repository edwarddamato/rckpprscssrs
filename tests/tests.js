var expect = chai.expect;

describe('Moves', function () {
    describe('getWinner()', function () {
        it('ROCK beats PAPER', function () {
            expect(Moves.getWinner(Moves.MOVES.ROCK, Moves.MOVES.SCISSORS)).to.equal(Moves.MOVES.ROCK);
        });
        it('ROCK beats LIZARD', function () {
            expect(Moves.getWinner(Moves.MOVES.ROCK, Moves.MOVES.LIZARD)).to.equal(Moves.MOVES.ROCK);
        });
        it('PAPER beats ROCK', function () {
            expect(Moves.getWinner(Moves.MOVES.ROCK, Moves.MOVES.PAPER)).to.equal(Moves.MOVES.PAPER);
        });
        it('PAPER beats SPOCK', function () {
            expect(Moves.getWinner(Moves.MOVES.PAPER, Moves.MOVES.SPOCK)).to.equal(Moves.MOVES.PAPER);
        });
        it('SCISSORS beats LIZARD', function () {
            expect(Moves.getWinner(Moves.MOVES.SCISSORS, Moves.MOVES.LIZARD)).to.equal(Moves.MOVES.SCISSORS);
        });
        it('SCISSORS beats PAPER', function () {
            expect(Moves.getWinner(Moves.MOVES.SCISSORS, Moves.MOVES.PAPER)).to.equal(Moves.MOVES.SCISSORS);
        });
        it('LIZARD beats SPOCK', function () {
            expect(Moves.getWinner(Moves.MOVES.SPOCK, Moves.MOVES.LIZARD)).to.equal(Moves.MOVES.LIZARD);
        });
        it('LIZARD beats PAPER', function () {
            expect(Moves.getWinner(Moves.MOVES.LIZARD, Moves.MOVES.PAPER)).to.equal(Moves.MOVES.LIZARD);
        });
        it('SPOCK beats ROCK', function () {
            expect(Moves.getWinner(Moves.MOVES.SPOCK, Moves.MOVES.ROCK)).to.equal(Moves.MOVES.SPOCK);
        });
        it('SPOCK beats SCISSORS', function () {
            expect(Moves.getWinner(Moves.MOVES.SPOCK, Moves.MOVES.SCISSORS)).to.equal(Moves.MOVES.SPOCK);
        });
    });

    describe('getMoveBeatsMove()', function () {
        it('ROCK is beaten by PAPER/SPOCK', function () {
            expect(Moves.getMoveBeatsMove(Moves.MOVES.ROCK)).to.satisfy(function (beatenBy) {
                return beatenBy === Moves.MOVES.PAPER || beatenBy === Moves.MOVES.SPOCK;
            });
        });

        it('PAPER is beaten by SCISSORS/LIZARD', function () {
            expect(Moves.getMoveBeatsMove(Moves.MOVES.PAPER)).to.satisfy(function (beatenBy) {
                return beatenBy === Moves.MOVES.SCISSORS || beatenBy === Moves.MOVES.LIZARD;
            });
        });

        it('SCISSORS is beaten by ROCK/SPOCK', function () {
            expect(Moves.getMoveBeatsMove(Moves.MOVES.SCISSORS)).to.satisfy(function (beatenBy) {
                return beatenBy === Moves.MOVES.ROCK || beatenBy === Moves.MOVES.SPOCK;
            });
        });

        it('LIZARD is beaten by SCISSORS/ROCK', function () {
            expect(Moves.getMoveBeatsMove(Moves.MOVES.LIZARD)).to.satisfy(function (beatenBy) {
                return beatenBy === Moves.MOVES.SCISSORS || beatenBy === Moves.MOVES.ROCK;
            });
        });

        it('SPOCK is beaten by PAPER/LIZARD', function () {
            expect(Moves.getMoveBeatsMove(Moves.MOVES.SPOCK)).to.satisfy(function (beatenBy) {
                return beatenBy === Moves.MOVES.PAPER || beatenBy === Moves.MOVES.LIZARD;
            });
        });
    });

    describe('getMovesList()', function () {
        it('returns ARRAY', function () {
            expect(Moves.getMovesList()).to.be.an('array');
        });
    });

    describe('guessNextMove()', function () {
        var history = ['ROCK', 'PAPER', 'SCISSORS', 'ROCK', 'PAPER', 'SCISSORS'];
        it(history.join(',') + ' next move is ROCK', function () {
            expect(Moves.guessNextMove(history)).to.equal('SCISSORS');
        });

        var history2 = ['ROCK', 'PAPER', 'PAPER','SPOCK','LIZARD','ROCK','SPOCK','LIZARD','ROCK','PAPER','PAPER','LIZARD', 'SCISSORS', 'ROCK', 'PAPER', 'SCISSORS'];
        it(history2.join(',') + ' next move is LIZARD', function () {
            expect(Moves.guessNextMove(history2)).to.equal('LIZARD');
        });

        var history3 = ['ROCK'];
        it(history3.join(',') + ' next move is N/A', function () {
            expect(Moves.guessNextMove(history3)).to.equal('');
        });
    });
});


describe('Storage', function () {
    // tests for storage
});

describe('Extensions', function () {
    // tests for extensions
});

describe('Game', function () {
    describe('Check Player Count', function () {
        it('Has Two Players', function () {
            Game.start(0, 0);

            expect(Game.current.players.length).to.equal(2);
        });
    });

    describe('Check Player Scores', function () {
        it('P1 wins', function () {

            Game.start(0, 0);

            Game.play(Game.current.players[0], Moves.MOVES.SCISSORS);
            Game.play(Game.current.players[1], Moves.MOVES.PAPER);

            expect(Game.current.players[0].score.wins).to.equal(1);
            expect(Game.current.players[1].score.losses).to.equal(1);
        });
    });
});