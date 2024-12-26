// chat.test.js
const request = require('supertest');
const express = require('express');
const chatController = require('../controllers/chat.controller');

// Mock node-fetch
jest.mock('node-fetch');
const fetch = require('node-fetch');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/chat', chatController);

// Use the actual API key from environment
const API_KEY = 'Bearer 0d567b5f2975fe9553b9122af1fb183e.zC8c4UK9yC8nuxmF';
process.env.ZHIPU_API_KEY = API_KEY;

describe('Chat Controller', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('GET /api/chat/test', () => {
        it('should return status check with API key presence', async () => {
            const response = await request(app)
                .get('/api/chat/test');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: 'Chat controller is working!',
                apiKeySet: true
            });
        });
    });

    describe('POST /api/chat', () => {
        it('should handle valid chat completion request', async () => {
            const mockMessages = [
                { role: 'user', content: 'Hello' }
            ];

            const mockApiResponse = {
                choices: [
                    { message: { content: 'Hi there!' } }
                ]
            };

            // Mock successful API response
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockApiResponse
            });

            const response = await request(app)
                .post('/api/chat')
                .send({ messages: mockMessages });

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockApiResponse);
            expect(fetch).toHaveBeenCalledWith(
                'https://open.bigmodel.cn/api/paas/v4/chat/completions',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': API_KEY
                    },
                    body: JSON.stringify({
                        model: 'glm-4',
                        messages: mockMessages
                    })
                }
            );
        });

        it('should handle missing messages array', async () => {
            const response = await request(app)
                .post('/api/chat')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                error: 'Bad Request',
                message: 'Messages must be an array'
            });
        });

        it('should handle invalid messages format', async () => {
            const response = await request(app)
                .post('/api/chat')
                .send({ messages: 'not an array' });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                error: 'Bad Request',
                message: 'Messages must be an array'
            });
        });

        it('should handle API error response', async () => {
            const mockMessages = [
                { role: 'user', content: 'Hello' }
            ];

            // Mock API error response
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 401,
                statusText: 'Unauthorized',
                text: async () => 'Invalid API key'
            });

            const response = await request(app)
                .post('/api/chat')
                .send({ messages: mockMessages });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({
                error: 'Zhipu API Error',
                message: 'Invalid API key'
            });
        });

        it('should handle network errors', async () => {
            const mockMessages = [
                { role: 'user', content: 'Hello' }
            ];

            // Mock network error
            fetch.mockRejectedValueOnce(new Error('Network error'));

            const response = await request(app)
                .post('/api/chat')
                .send({ messages: mockMessages });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                error: 'Internal Server Error',
                message: 'Network error'
            });
        });
    });
});