
const Hapi = require('@hapi/hapi');

// Game states for Rock Paper Scissors
let games = {
    // <gameId>: {
        // player1: {
            // name: <string>,
            // move: <rock | paper | scissors | null (not chosen)>
        // },
        // player2: {
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
        if (!games[id]) {
            return `Game ${id} not found`;
        }

        // return the game state
        return games[id];
    },
});

// Create a new game
server.route({
    method: 'POST',
    path: '/api/games',
    handler: function (request, h) {
        let id = Math.random().toString(36).substring(2, 15);
        const playerName = request.payload.name ? request.payload.name : "player1";
        while (games[id]) { // make sure the id is unique
            id = Math.random().toString(36).substring(2, 15);
        }

        console.log("Creating game with id: " + id);
        games[id] = {
            player1: {name: playerName, move: null},
            player2: {name: null, move: null},
            winner: null
        };

        return "Created game with id: " + id;
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
            return `Game ${id} not found`;
        }
        if (games[id].player2.name) {
            return "Game already has two players";
        }
        if (games[id].player1.name === playerName) {
            return "Player name already taken";
        }

        games[id].player2.name = playerName;
        return `Successfully joined game: "${id}", player name: ${playerName}`;
    }
});

// Make a move
server.route({
    method: 'POST',
    path: '/api/games/{id}/move',
    handler: function (request, h) {
        const id = request.params.id;
        const playerName = request.payload.name;
        const validMoves = ["rock", "paper", "scissors"];
        const move = request.payload.move.toLowerCase();
        
        if (!games[id]) {
            return `Game ${id} not found`;
        }
        if (!validMoves.includes(move)) {
            return `Invalid move: ${move}, valid moves are: ${validMoves}`;
        }
        
        const player1 = games[id].player1;
        const player2 = games[id].player2;
        if (player1.name === playerName) {
            player1.move = move;
        } else if (player2.name === playerName) {
            player2.move = move;
        } else {
            return `Player ${playerName} not found in game, available players: ${player1.name}, ${player2.name}`;
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

        return `Move ${move} made by ${playerName} in game ${id}`;
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