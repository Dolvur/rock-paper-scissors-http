const Hapi = require('@hapi/hapi');
const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const { getGame, createGame, joinGame, makeAMove } = require('../src/utils.js');
const { initRoutes } = require('../src/routes.js');

const { expect } = Code;
const lab = exports.lab = Lab.script();

const experiment = lab.experiment;
const test = lab.test;
const describe = lab.describe;
const it = lab.it;

describe('Create and play a game', () => {
    it('creates a game', async () => {
        let games = {};
        const server = new Hapi.Server();

        server.route(initRoutes(games));

        const injectOptions = {
            method: 'POST',
            url: '/api/games',
            payload: {
                name: 'Player 1'
            }
        }

        const response = await server.inject(injectOptions);

        expect(response.statusCode).to.equal(201);
    });

});

// describe('inject requests with server.inject,', () => {  
//     it('injects a request to a hapi server without a route', async () => {
//       const server = new Hapi.Server()

//       server.route({
//         method: 'GET',
//         path: '/api/games/{id}',
//         handler: function (request, h) {
//                 return getGame(request, h, games);
//             },
//         });
  
//       // these must match the route you want to test
//       const injectOptions = {
//     method: 'GET',
//         url: '/api/games/1'
//       }
  
//       // wait for the response and the request to finish
//       const response = await server.inject(injectOptions)

//       console.log("payload: ", response.payload)
  
//       // alright, set your expectations :)
//       expect(response.statusCode).to.equal(403)
//     })
//   })