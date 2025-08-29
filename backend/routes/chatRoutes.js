// backend/routes/chatRoutes.js

const express = require('express');
const dotenv = require('dotenv');
const { protect } = require('../middleware/authMiddleware');
const Conversation = require('../models/Conversation');
const FAQ = require('../models/FAQ');

const router = express.Router();
dotenv.config();

const callGeminiAPI = async (prompt) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;
    
    const MAX_RETRIES = 3;
    let retries = 0;
    
    while (retries < MAX_RETRIES) {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        role: "user",
                        parts: [{ text: prompt }]
                    }]
                }),
            });
            if (!response.ok) {
                if (response.status === 429 && retries < MAX_RETRIES - 1) {
                    const delay = Math.pow(2, retries) * 1000;
                    console.warn(`Rate limit hit, retrying in ${delay / 1000}s...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    retries++;
                    continue;
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error.message || 'Gemini API call failed');
                }
            }
            const data = await response.json();
            const botResponse = data.candidates[0].content.parts[0].text;
            return botResponse;
        } catch (error) {
            console.error(`Attempt ${retries + 1} failed: ${error.message}`);
            retries++;
            if (retries >= MAX_RETRIES) {
                throw new Error('Failed to get a response from Gemini after multiple retries.');
            }
        }
    }
};

const findRelevantFAQ = async (userMessage) => {
    const faqs = await FAQ.find();
    let bestMatch = null;
    let maxMatches = 0;
    faqs.forEach(faq => {
        const faqText = `${faq.question} ${faq.answer}`.toLowerCase();
        const userText = userMessage.toLowerCase();
        const matches = userText.split(' ').filter(word => faqText.includes(word)).length;
        if (matches > maxMatches) {
            maxMatches = matches;
            bestMatch = faq;
        }
    });
    return bestMatch;
};

router.post('/send', protect, async (req, res) => {
    const { userMessage } = req.body;
    const userId = req.user._id;
    if (!userMessage || !userId) {
        return res.status(400).json({ message: 'User message and ID are required' });
    }
    try {
        let conversation = await Conversation.findOne({ userId });
        if (!conversation) {
            conversation = await Conversation.create({ userId, messages: [] });
        }
        const relevantFAQ = await findRelevantFAQ(userMessage);
        let botResponseText;
        let promptText;
        if (relevantFAQ) {
            promptText = `You are a helpful AI customer support agent. The user's query is: "${userMessage}". The relevant company FAQ is: "${relevantFAQ.question}: ${relevantFAQ.answer}". Use this FAQ to answer the user's question concisely.`;
        } else {
            promptText = `You are a helpful AI customer support agent. Answer the user's question: "${userMessage}". If you don't have information about it, respond in a friendly, concise manner.`;
        }
        botResponseText = await callGeminiAPI(promptText);
        conversation.messages.push({ role: 'user', text: userMessage, timestamp: new Date() });
        conversation.messages.push({ role: 'bot', text: botResponseText, timestamp: new Date() });
        await conversation.save();
        res.json({ message: 'Message sent', botResponse: botResponseText });
    } catch (error) {
        console.error(`Error in chat/send: ${error.message}`);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
});

router.get('/history', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const conversation = await Conversation.findOne({ userId });
        if (!conversation) {
            return res.json({ messages: [] });
        }
        res.json({ messages: conversation.messages });
    } catch (error) {
        console.error(`Error in chat/history: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
