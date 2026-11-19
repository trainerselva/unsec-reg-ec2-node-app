const request = require('supertest');
const app = require('./app');

describe('Routing Tests', () => {
    test('Root path returns welcome message', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });
});