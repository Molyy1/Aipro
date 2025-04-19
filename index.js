const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Your OpenRouter API Key
const OPENROUTER_API_KEY = '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';

app.get('/aibot', async (req, res) => {
    const prompt = req.query.prompt;

    if (!prompt) {
        return res.status(400).json({ error: 'Missing prompt parameter' });
    }

    try {
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'openai/gpt-3.5-turbo',  // You can change this model if needed
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('OpenRouter API error:', error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/aibot?prompt=hello`);
});