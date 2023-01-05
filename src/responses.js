function responseGameCreated(h, gameID, key, name) {
    return h.response({ gameID, key, name }).code(201);
}

function responseGameJoined(h, name, key) {
    return h.response({ name, key }).code(200);
}

function responseGameState(h, visibleState) {
    return h.response(visibleState).code(200);
}

function responseGameNotFound(h) {
    return h.response("Game not found").code(404);
}

function responseGameFull(h) {
    return h.response("Game is full").code(403);
}

function responseGameIsOver(h) {
    return h.response("Game is over").code(400);
}

function responseInvalidMove(h) {
    return h.response("Invalid move").code(400);
}

function responseInvalidKey(h) {
    return h.response("Invalid key").code(401);
}

function responseNameTaken(h) {
    return h.response("Player name already taken").code(400);
}

module.exports = {
    responseGameCreated,
    responseGameJoined,
    responseGameState,
    responseGameNotFound,
    responseGameFull,
    responseGameIsOver,
    responseInvalidMove,
    responseInvalidKey,
    responseNameTaken
};