const { getGame, createGame, joinGame, makeAMove } = require("./utils.js");

function initRoutes(games) {
  const routes = [
    {
      method: "GET",
      path: "/api/games/{id}",
      handler: function (request, h) {
        return getGame(request, h, games);
      },
    },
    {
      method: "POST",
      path: "/api/games",
      handler: function (request, h) {
        return createGame(request, h, games);
      },
    },
    {
      method: "POST",
      path: "/api/games/{id}/join",
      handler: function (request, h) {
        return joinGame(request, h, games);
      },
    },
    {
      method: "POST",
      path: "/api/games/{id}/move",
      handler: function (request, h) {
        return makeAMove(request, h, games);
      },
    },
  ];

  return routes;
}

module.exports = {
  initRoutes,
};
