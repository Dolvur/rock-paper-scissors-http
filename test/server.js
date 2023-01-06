const Hapi = require('@hapi/hapi');
const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const { initRoutes } = require('../src/routes.js');

const { expect } = Code;
const lab = exports.lab = Lab.script();

const experiment = lab.experiment;
const test = lab.test;
const describe = lab.describe;
const it = lab.it;

describe('Create and play a game', () => {
    let games = {};
    const server = new Hapi.Server();
    server.route(initRoutes(games));

    let gameID = null;
    let player1Key = null;
    let player2Key = null;
    
    it('creates a game', async () => {
        const injectOptions = {
            method: 'POST',
            url: '/api/games',
            payload: {
                name: 'Player 1'
            }
        }

        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(201);
        expect(response.result).to.include(['gameID', 'key', 'name']);
        expect(response.result.name).to.equal('Player 1');
        gameID = response.result.gameID;
        player1Key = response.result.key;
    });

    it('joins a game', async () => {
        const injectOptions = {
            method: 'POST',
            url: `/api/games/${gameID}/join`,
            payload: {
                name: 'Player 2'
            }
        }

        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.include(['name', 'key']);
        expect(response.result.name).to.equal('Player 2');
        player2Key = response.result.key;
    });

    it('check the game state', async () => {
        const injectOptions = {
            method: 'GET',
            url: `/api/games/${gameID}`,
            headers: {
                'Authorization': player2Key
            }
        }

        const response = await server.inject(injectOptions);

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.include(['player1', 'player2', 'winner']);
        expect(response.result.player1.name).to.equal('Player 1');
        expect(response.result.player2.name).to.equal('Player 2');
        expect(response.result.winner).to.equal(null);
        expect(response.result.player1.move).to.equal("unknown");
        expect(response.result.player2.move).to.equal(null);
    });

    it('player1 makes a move', async () => {
        const injectOptions = {
            method: 'POST',
            url: `/api/games/${gameID}/move`,
            headers: {
                'Authorization': player1Key
            },
            payload: {
                move: 'rock'
            }
        }

        const response = await server.inject(injectOptions);

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.include(['player1', 'player2', 'winner']);
        expect(response.result.player1.name).to.equal('Player 1');
        expect(response.result.player2.name).to.equal('Player 2');
        expect(response.result.winner).to.equal(null);
        expect(response.result.player1.move).to.equal('rock');
        expect(response.result.player2.move).to.equal("unknown");
    });

    it('player2 makes a move', async () => {
        const injectOptions = {
            method: 'POST',
            url: `/api/games/${gameID}/move`,
            headers: {
                'Authorization': player2Key
            },
            payload: {
                move: 'paper'
            }
        }

        const response = await server.inject(injectOptions);

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.include(['player1', 'player2', 'winner']);
        expect(response.result.player1.name).to.equal('Player 1');
        expect(response.result.player2.name).to.equal('Player 2');
        expect(response.result.winner).to.equal('Player 2');
        expect(response.result.player1.move).to.equal('rock');
        expect(response.result.player2.move).to.equal('paper');
    });

    it('check the game state (no authorization required)', async () => {
        const injectOptions = {
            method: 'GET',
            url: `/api/games/${gameID}`
        }

        const response = await server.inject(injectOptions);

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.include(['player1', 'player2', 'winner']);
        expect(response.result.player1.name).to.equal('Player 1');
        expect(response.result.player2.name).to.equal('Player 2');
        expect(response.result.winner).to.equal('Player 2');
        expect(response.result.player1.move).to.equal('rock');
        expect(response.result.player2.move).to.equal('paper');
    });
});

describe('Create several games', () => {
    let games = {};
    const server = new Hapi.Server();
    server.route(initRoutes(games));

    let secondGameID = null;
    let secondPlayer1Key = null;

    it('creates a game', async () => {
        const injectOptions = {
            method: 'POST',
            url: '/api/games',
            payload: {
                name: 'Lisa'
            }
        }

        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(201);
        expect(response.result).to.include(['gameID', 'key', 'name']);
        expect(response.result.name).to.equal('Lisa');
    })

    it('creates a second game', async () => {
        const injectOptions = {
            method: 'POST',
            url: '/api/games',
            payload: {
                name: 'Pelle'
            }
        }

        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(201);
        expect(response.result).to.include(['gameID', 'key', 'name']);
        expect(response.result.name).to.equal('Pelle');
        secondGameID = response.result.gameID;
        secondPlayer1Key = response.result.key;
    });

    it('creates a third game', async () => {
        const injectOptions = {
            method: 'POST',
            url: '/api/games',
            payload: {
                name: 'Jonas'
            }
        }

        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(201);
        expect(response.result).to.include(['gameID', 'key', 'name']);
        expect(response.result.name).to.equal('Jonas');
    });

    it('joins the second game', async () => {
        const injectOptions = {
            method: 'POST',
            url: `/api/games/${secondGameID}/join`,
            payload: {
                name: 'Olaf'
            }
        }

        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.include(['name', 'key']);
        expect(response.result.name).to.equal('Olaf');
    });
    
    it('player1 makes a move in the second game', async () => {
        const injectOptions = {
            method: 'POST',
            url: `/api/games/${secondGameID}/move`,
            headers: {
                'Authorization': secondPlayer1Key
            },
            payload: {
                move: 'rock'
            }
        }

        const response = await server.inject(injectOptions);

        expect(response.statusCode).to.equal(200);
        expect(response.result).to.include(['player1', 'player2', 'winner']);
        expect(response.result.player1.name).to.equal('Pelle');
        expect(response.result.player2.name).to.equal('Olaf');
        expect(response.result.winner).to.equal(null);
        expect(response.result.player1.move).to.equal('rock');
        expect(response.result.player2.move).to.equal("unknown");
    });
});

describe('invalid requests', () => {
    let games = {};
    const server = new Hapi.Server();
    server.route(initRoutes(games));

    it('join a non-existing game', async () => {
        const injectOptions = {
            method: 'POST',
            url: '/api/games/1234/join',
            payload: {
                name: 'Lisa'
            }
        }

        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(404);
    });

    it('join a game with an already taken name', async () => {
        // Hardcode game
        games['1234'] = {
            player1: {
                name: 'Lisa',
                key: '1234',
                move: null
            },
            player2: {
                name: null,
                key: null,
                move: null
            },
            winner: null
        }

        const injectOptions = {
            method: 'POST',
            url: '/api/games/1234/join',
            payload: {
                name: 'Lisa'
            }
        }

        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(400);
    });

    it('join a full game', async () => {
        // Hardcode game
        games['1234'] = {
            player1: {
                name: 'Lisa',
                key: '1234',
                move: null
            },
            player2: {
                name: 'Pelle',
                key: '1235',
                move: null
            },
            winner: null
        }

        const injectOptions = {
            method: 'POST',
            url: '/api/games/1234/join',
            payload: {
                name: 'Olaf'
            }
        }

        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(403);
    });

    it('try to move with bad authorization', async () => {
        // Hardcode game
        games['1234'] = {
            player1: {
                name: 'Lisa',
                key: '1234',
                move: null
            },
            player2: {
                name: 'Pelle',
                key: '1235',
                move: null
            },
            winner: null
        }

        const injectOptions = {
            method: 'POST',
            url: '/api/games/1234/move',
            payload: {
                move: 'rock'
            },
            headers: {
                "Authorization": "1236"
            }
        }

        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(401);
    });

    it('try to make an invalid move', async () => {
        // Hardcode game
        games['1234'] = {
            player1: {
                name: 'Lisa',
                key: '1234',
                move: null
            },
            player2: {
                name: 'Pelle',
                key: '1235',
                move: null
            },
            winner: null
        }

        const injectOptions = {
            method: 'POST',
            url: '/api/games/1234/move',
            payload: {
                move: 'airplane'
            },
            headers: {
                "authorization": "1235"
            }
        }

        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(400);
    });

    it('try to make a move in a game that is already finished', async () => {
        // Hardcode game
        games['1234'] = {
            player1: {
                name: 'Lisa',
                key: '1234',
                move: 'rock'
            },
            player2: {
                name: 'Pelle',
                key: '1235',
                move: 'paper'
            },
            winner: 'Pelle'
        }

        const injectOptions = {
            method: 'POST',
            url: '/api/games/1234/move',
            payload: {
                move: 'scissors'
            },
            headers: {
                "authorization": "1234"
            }
        }

        const response = await server.inject(injectOptions);
        expect(response.statusCode).to.equal(403);
    });

});