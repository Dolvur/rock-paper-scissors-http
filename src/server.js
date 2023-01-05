const Hapi = require('@hapi/hapi');
const { getGame, createGame, joinGame, makeAMove } = require('./utils.js');

// Game states for Rock Paper Scissors
let games = {
    // <gameId>: {
        // player1: {
            // key : <string | null (not joined)>,
            // name: <string>,
            // move: <rock | paper | scissors | null (not chosen)>
        // },
        // player2: {
            // key : <string | null (not joined)>,
            // name: <string>,
            // move: <rock | paper | scissors | null (not chosen)>
        // },
        // winner: <player1 | player2 | tie | null (not determined)>
    // }
} 

const server = Hapi.server({
    host: 'localhost',
    port: 8000
});

// Add Routes:
// Get a current game
server.route({
    method: 'GET',
    path: '/api/games/{id}',
    handler: function (request, h) {
        return getGame(request, h, games);
    },
});

// Create a new game
server.route({
    method: 'POST',
    path: '/api/games',
    handler: function (request, h) {
        return createGame(request, h, games);
    }
});

// Join an existing game
server.route({
    method: 'POST',
    path: '/api/games/{id}/join',
    handler: function (request, h) {
        return joinGame(request, h, games);
    }
});

// Make a move
server.route({
    method: 'POST',
    path: '/api/games/{id}/move',
    handler: function (request, h) {
        return makeAMove(request, h, games);
    }
});

// start the server
const start = async function () {
        try {
            await server.start();
        }
        catch (err) {
            console.log(err);
            process.exit(1);
        }
        console.log('Server running at:', server.info.uri);
    }

start();