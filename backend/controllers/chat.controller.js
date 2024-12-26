// chat.controller.js
require('dotenv').config();
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY;
const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

// Add debug endpoint
router.get('/test', (req, res) => {
    res.json({ 
        message: 'Chat controller is working!',
        apiKeySet: !!ZHIPU_API_KEY
    });
});

// Chat completion endpoint
router.post('/', async (req, res) => {
    try {
        const { messages } = req.body;
        
        console.log('Received request at /api/chat');
        console.log('API Key present:', !!ZHIPU_API_KEY);
        console.log('Messages received:', messages);

        if (!messages || !Array.isArray(messages)) {
            console.error('Invalid messages format:', messages);
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Messages must be an array'
            });
        }

        if (!ZHIPU_API_KEY) {
            console.error('ZHIPU_API_KEY not set');
            return res.status(500).json({
                error: 'Server Configuration Error',
                message: 'API key not configured'
            });
        }

        const response = await fetch(ZHIPU_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ZHIPU_API_KEY}`
            },
            body: JSON.stringify({
                model: 'glm-4',
                messages: messages
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Zhipu API error response:', errorText);
            console.error('Status:', response.status);
            console.error('Status Text:', response.statusText);
            return res.status(response.status).json({
                error: 'Zhipu API Error',
                message: errorText
            });
        }

        const data = await response.json();
        console.log('Zhipu API successful response:', data);
        res.json(data);
    } catch (error) {
        console.error('Error in chat completion:', error);
        res.status(500).json({ 
            error: 'Internal Server Error',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router;