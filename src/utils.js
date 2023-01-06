const {
    responseGameNotFound,
    responseGameCreated,
    responseGameFull,
    responseNameTaken,
    responseGameJoined,
    responseGameIsOver,
    responseInvalidMove,
    responseInvalidKey,
    responseGameState,
} = require("./responses");

// Help functions
function getUniqueKey(isUniquePredicate = () => true) {
    let key = Math.random().toString(36).substring(2, 15);
    while (!isUniquePredicate(key)) {
        key = Math.random().toString(36).substring(2, 15);
    }
    return key;
}

function getVisibleState(game, key) {
    const player1 = game.player1;
    const player2 = game.player2;
    const visibleState = structuredClone(game);
    // Remove keys from the visible state
    delete visibleState.player1.key;
    delete visibleState.player2.key;

    // Don't show opponent's move if the game is ongoing
    if (!game.winner) {
        if (player1.key === key) {
            visibleState.player2.move = 'unknown';
        } else if (player2.key === key) {
            visibleState.player1.move = 'unknown';
        } else {
            visibleState.player1.move = 'unknown';
            visibleState.player2.move = 'unknown';
        }
    }
    return visibleState;
}

function getPlayer(game, key) {
    if (game.player1.key === key) {
        return game.player1;
    } else if (game.player2.key === key) {
        return game.player2;
    } else {
        return null;
    }
}

function setWinnerIfGameDone(game, validMoves) {
    const player1MoveIndex = validMoves.indexOf(game.player1.move);
    const player2MoveIndex = validMoves.indexOf(game.player2.move);
    // Is game done?
    if (game.player1.move && game.player2.move) {
        // determine winner
        if (player1MoveIndex === player2MoveIndex) {
            game.winner = "tie";
        } else if (
            player1MoveIndex - player2MoveIndex === 1 ||
            player1MoveIndex - player2MoveIndex === -2
        ) {
            game.winner = game.player1.name;
        } else {
            game.winner = game.player2.name;
        }
    }
}

// Response functions

// Route handlers
function getGame(request, h, games) {
    const id = request.params.id;
    const key = request.headers.authorization;
    const game = games[id];
    if (!game) {
        return responseGameNotFound(h);
    }

    return responseGameState(h, getVisibleState(game, key));
}

function createGame(request, h, games) {
    const id = getUniqueKey((id) => !games[id]);
    const playerName = request.payload?.name ? request.payload.name : "player1";
    const player1Key = getUniqueKey();

    console.log("Creating game with id: " + id);
    games[id] = {
        player1: { key: player1Key, name: playerName, move: null },
        player2: { key: null, name: null, move: null },
        winner: null,
    };

    return responseGameCreated(h, id, player1Key, playerName);
}

function joinGame(request, h, games) {
    const id = request.params.id;
    const playerName = request.payload?.name ? request.payload.name : "player2";
    const game = games[id];

    if (!game) {
        return responseGameNotFound(h);
    }
    if (game.player2.name) {
        return responseGameFull(h);
    }
    if (game.player1.name === playerName) {
        return responseNameTaken(h);
    }

    game.player2.name = playerName;
    const player2Key = getUniqueKey((key) => game.player1.key !== key);
    game.player2.key = player2Key;

    return responseGameJoined(h, playerName, player2Key);
}

function makeAMove(request, h, games) {
    const id = request.params.id;
    const key = request.headers.authorization;
    const move = request.payload.move.toLowerCase();
    const validMoves = ["rock", "paper", "scissors"];
    const game = games[id];

    if (!game) {
        return responseGameNotFound(h);
    }
    if (game.winner) {
        return responseGameIsOver(h);
    }
    if (!validMoves.includes(move)) {
        return responseInvalidMove(h);
    }

    const player = getPlayer(game, key);
    if (!player) {
        return responseInvalidKey(h);
    }
    player.move = move;

    setWinnerIfGameDone(game, validMoves);

    return responseGameState(h, getVisibleState(game, key));
}

module.exports = {
    getGame,
    createGame,
    joinGame,
    makeAMove,
};
