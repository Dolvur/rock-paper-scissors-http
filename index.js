
const Hapi = require('@hapi/hapi');

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
        const id = request.params.id;
        const key = request.headers.authorization;
        const game = games[id];
        if (!game) {
            return h.response(`Game ${id} not found`).code(404);
        }

        const player1 = game.player1;
        const player2 = game.player2;
        let visibleState = {
            player1: {
                name: player1.name,
            },
            player2: {
                name: player2.name,
            },
            winner: game.winner
        }

        // if the game is over, show both players moves
        if (game.winner) {
            visibleState.player1.move = player1.move;
            visibleState.player2.move = player2.move;
        }
        // if the game is not over, only show the player's own move
        else if (player1.key === key) {
            visibleState.player1.move = player1.move;
        } else if (player2.key === key) {
            visibleState.player2.move = player2.move;
        }

        return h.response(visibleState).code(200);
    },
});

// Create a new game
server.route({
    method: 'POST',
    path: '/api/games',
    handler: function (request, h) {
        let id = Math.random().toString(36).substring(2, 15);
        const playerName = request.payload.name ? request.payload.name : "player1";
        // make sure the id is unique
        while (games[id]) { 
            id = Math.random().toString(36).substring(2, 15);
        }

        let player1Key = Math.random().toString(36).substring(2, 15);
        console.log("Creating game with id: " + id);
        games[id] = {
            player1: {key: player1Key, name: playerName, move: null},
            player2: {key: null, name: null, move: null},
            winner: null
        };

        return h.response(`Created game with id: ${id}, player name: ${playerName}, player key: ${player1Key}`).code(201);
    }
});

// Join an existing game
server.route({
    method: 'POST',
    path: '/api/games/{id}/join',
    handler: function (request, h) {
        const id = request.params.id;
        const playerName = request.payload.name ? request.payload.name : "player2";
        if (!games[id]) {
            return h.response(`Game ${id} not found`).code(404);
        }
        if (games[id].player2.name) {
            return h.response(`Game ${id} already has two players`).code(400);
        }
        if (games[id].player1.name === playerName) {
            return h.response(`Player name already taken`).code(400);
        }

        games[id].player2.name = playerName;
        let player2Key = Math.random().toString(36).substring(2, 15);
        // make sure the key is unique
        while (games[id].player1.key === player2Key) {
            player2Key = Math.random().toString(36).substring(2, 15);
        }
        games[id].player2.key = player2Key;

        return h.response(`Successfully joined game: "${id}", player name: ${playerName}, player key: ${player2Key}`).code(200);
    }
});

// Make a move
server.route({
    method: 'POST',
    path: '/api/games/{id}/move',
    handler: function (request, h) {
        const id = request.params.id;
        const key = request.headers.authorization;
        const validMoves = ["rock", "paper", "scissors"];
        const move = request.payload.move.toLowerCase();
        const game = games[id];
        
        if (!game) {
            return h.response(`Game ${id} not found`).code(404);
        }
        if (game.winner) {
            return h.response(`Game ${id} is already over`).code(400);
        }
        if (!validMoves.includes(move)) {
            return h.response(`Invalid move: ${move}, valid moves are: ${validMoves}`).code(400);
        }
        
        const player1 = game.player1;
        const player2 = game.player2;
        let playerName = null;
        if (player1.key === key) {
            player1.move = move;
            playerName = player1.name;
        } else if (player2.key === key) {
            player2.move = move;
            playerName = player2.name;
        } else {
            return h.response(`Key: "${key}" invalid for game: ${id}`).code(401);
        }

        // check if both players have made a move
        const player1MoveIndex = validMoves.indexOf(player1.move);
        const player2MoveIndex = validMoves.indexOf(player2.move);
        if (player1.move && player2.move) {
            // determine winner
            if (player1MoveIndex === player2MoveIndex) {
                games[id].winner = "tie";
            } else if (player1MoveIndex - player2MoveIndex === 1 || player1MoveIndex - player2MoveIndex === -2) {
                games[id].winner = player1.name;
            } else {
                games[id].winner = player2.name;
            }
        }

        return h.response(`Action: "${move}" by ${playerName} in game ${id}`).code(200);
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