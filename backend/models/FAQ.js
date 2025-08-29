// backend/models/FAQ.js

const mongoose = require('mongoose');

const faqSchema = mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    sourceDocument: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const FAQ = mongoose.model('FAQ', faqSchema);

module.exports = FAQ;