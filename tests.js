const Code = require('@hapi/code');
const Lab = require('@hapi/lab');

const { expect } = Code;
const lab = exports.lab = Lab.script();
const server = require('../index.js');

lab.experiment('GET /api/games/{id}', () => {
    lab.test('try to return a nonexistant game', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/api/games/1'
        });
        expect(response.statusCode).to.equal(404);
    }
    );
});
