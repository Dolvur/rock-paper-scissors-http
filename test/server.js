const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Hapi = require('@hapi/hapi');

const { expect } = Code;
const lab = exports.lab = Lab.script();

const experiment = lab.experiment;
const test = lab.test;
const describe = lab.describe;
const it = lab.it;

describe('inject requests with server.inject,', () => {  
    it('injects a request to a hapi server without a route', async () => {
      const server = new Hapi.Server()

      server.route({
        method: 'GET',
        path: '/api/games/{id}',
        handler: function (request, h) {
            const id = request.params.id;
            const key = request.headers.authorization;

            return h.response(`Game ${id} not found`).code(403);
        },
    });
  
      // these must match the route you want to test
      const injectOptions = {
        method: 'GET',
        url: '/api/games/1'
      }
  
      // wait for the response and the request to finish
      const response = await server.inject(injectOptions)

      console.log("payload: ", response.payload)
  
      // alright, set your expectations :)
      expect(response.statusCode).to.equal(403)
    })
  })