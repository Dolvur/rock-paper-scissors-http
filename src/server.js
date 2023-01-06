const Hapi = require("@hapi/hapi");
const { initRoutes } = require("./routes.js");

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
};

const server = Hapi.server({
    host: "localhost",
    port: 8000,
});

// Add Routes:
server.route(initRoutes(games));

// Start the server
const start = async () => {
    try {
        await server.start();
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
    console.log("Server running at:", server.info.uri);
};

start();
