// backend/routes/faqRoutes.js (Updated)

const express = require('express');
const fileUpload = require('express-fileupload');
const { protect, adminProtect } = require('../middleware/authMiddleware');
const FAQ = require('../models/FAQ');
const pdf = require('pdf-parse');
const path = require('path');

const router = express.Router();

router.use(fileUpload());

const processTextToFAQ = (text) => {
    const question = `Question about: ${text.substring(0, 50).trim()}...`;
    const answer = text;
    return { question, answer };
};

router.post('/upload', protect, adminProtect, async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: 'No files were uploaded.' });
    }
    const file = req.files.faqDocument;
    const fileExtension = path.extname(file.name).toLowerCase();
    try {
        let textContent = '';
        if (fileExtension === '.pdf') {
            const dataBuffer = file.data;
            const data = await pdf(dataBuffer);
            textContent = data.text;
        } else if (fileExtension === '.txt') {
            textContent = file.data.toString('utf8');
        } else {
            return res.status(400).json({ message: 'Unsupported file type. Please upload a .pdf or .txt file.' });
        }
        
        const faqData = processTextToFAQ(textContent);
        const newFAQ = { ...faqData, sourceDocument: file.name };
        await FAQ.deleteMany({});
        await FAQ.create(newFAQ);

        res.status(200).json({ message: 'FAQs uploaded and processed successfully.' });
    } catch (error) {
        console.error(`Error uploading FAQ: ${error.message}`);
        res.status(500).json({ message: 'Failed to process file.' });
    }
});

router.get('/list', protect, adminProtect, async (req, res) => {
    try {
        const faqs = await FAQ.find({});
        res.json(faqs);
    } catch (error) {
        console.error(`Error fetching FAQs: ${error.message}`);
        res.status(500).json({ message: 'Failed to fetch FAQs.' });
    }
});

router.delete('/delete/:id', protect, adminProtect, async (req, res) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }
        await FAQ.findByIdAndDelete(req.params.id);
        res.json({ message: 'FAQ removed' });
    } catch (error) {
        console.error(`Error deleting FAQ: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/faq/update/:id
// @desc    Update a specific FAQ by ID
// @access  Private (Admin only)
router.put('/update/:id', protect, adminProtect, async (req, res) => {
    try {
        const { question, answer } = req.body;
        const faq = await FAQ.findById(req.params.id);
        if (!faq) {
            return res.status(404).json({ message: 'FAQ not found' });
        }
        faq.question = question || faq.question;
        faq.answer = answer || faq.answer;
        const updatedFAQ = await faq.save();
        res.json(updatedFAQ);
    } catch (error) {
        console.error(`Error updating FAQ: ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;