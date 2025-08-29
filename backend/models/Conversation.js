// backend/models/Conversation.js

const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ['user', 'bot']
    },
    text: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const conversationSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    messages: [messageSchema]
}, {
    timestamps: true
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;