const express = require('express');
const { body, validationResult } = require('express-validator');
const Form = require('../models/Form');
const Response = require('../models/Response');
const auth = require('../middleware/auth');
const { Parser } = require('json2csv');

const router = express.Router();

// Create a new form (Admin only)
router.post('/', auth, [
  body('title').trim().isLength({ min: 1 }),
  body('questions').isArray({ min: 3, max: 5 }),
  body('questions.*.text').trim().isLength({ min: 1 }),
  body('questions.*.type').isIn(['text', 'multiple-choice'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, questions } = req.body;

    // Validate multiple-choice questions have options
    for (const question of questions) {
      if (question.type === 'multiple-choice' && (!question.options || question.options.length < 2)) {
        return res.status(400).json({ 
          message: 'Multiple-choice questions must have at least 2 options' 
        });
      }
    }

    const form = new Form({
      title,
      description,
      questions,
      creator: req.user._id
    });

    await form.save();
    await form.populate('creator', 'name email');

    res.status(201).json(form);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all forms for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const forms = await Form.find({ creator: req.user._id })
      .populate('creator', 'name email')
      .sort({ createdAt: -1 });

    // Add response count to each form
    const formsWithStats = await Promise.all(
      forms.map(async (form) => {
        const responseCount = await Response.countDocuments({ form: form._id });
        return {
          ...form.toObject(),
          responseCount
        };
      })
    );

    res.json(formsWithStats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific form by ID (Admin only)
router.get('/:id', auth, async (req, res) => {
  try {
    const form = await Form.findOne({ 
      _id: req.params.id, 
      creator: req.user._id 
    }).populate('creator', 'name email');

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const responseCount = await Response.countDocuments({ form: form._id });

    res.json({
      ...form.toObject(),
      responseCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get public form (no auth required)
router.get('/public/:publicUrl', async (req, res) => {
  try {
    const form = await Form.findOne({ 
      publicUrl: req.params.publicUrl,
      isActive: true 
    }).select('-creator');

    if (!form) {
      return res.status(404).json({ message: 'Form not found or inactive' });
    }

    res.json(form);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit response to public form (no auth required)
router.post('/public/:publicUrl/submit', async (req, res) => {
  try {
    const { answers } = req.body;

    const form = await Form.findOne({ 
      publicUrl: req.params.publicUrl,
      isActive: true 
    });

    if (!form) {
      return res.status(404).json({ message: 'Form not found or inactive' });
    }

    // Validate answers
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid answers format' });
    }

    // Create response
    const response = new Response({
      form: form._id,
      answers,
      ipAddress: req.ip
    });

    await response.save();

    res.status(201).json({ message: 'Response submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get responses for a form (Admin only)
router.get('/:id/responses', auth, async (req, res) => {
  try {
    const form = await Form.findOne({ 
      _id: req.params.id, 
      creator: req.user._id 
    });

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const responses = await Response.find({ form: form._id })
      .sort({ createdAt: -1 });

    res.json(responses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export responses as CSV (Admin only)
router.get('/:id/export', auth, async (req, res) => {
  try {
    const form = await Form.findOne({ 
      _id: req.params.id, 
      creator: req.user._id 
    });

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const responses = await Response.find({ form: form._id })
      .sort({ createdAt: -1 });

    if (responses.length === 0) {
      return res.status(404).json({ message: 'No responses found' });
    }

    // Prepare data for CSV
    const csvData = responses.map(response => {
      const row = {
        'Submitted At': response.submittedAt.toISOString(),
        'IP Address': response.ipAddress || 'N/A'
      };

      response.answers.forEach(answer => {
        row[answer.questionText] = Array.isArray(answer.answer) 
          ? answer.answer.join(', ') 
          : answer.answer;
      });

      return row;
    });

    const parser = new Parser();
    const csv = parser.parse(csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${form.title}-responses.csv"`);
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update form (Admin only)
router.put('/:id', auth, [
  body('title').trim().isLength({ min: 1 }),
  body('questions').isArray({ min: 3, max: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const form = await Form.findOneAndUpdate(
      { _id: req.params.id, creator: req.user._id },
      { ...req.body },
      { new: true }
    ).populate('creator', 'name email');

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    res.json(form);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete form (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const form = await Form.findOneAndDelete({ 
      _id: req.params.id, 
      creator: req.user._id 
    });

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    // Also delete all responses
    await Response.deleteMany({ form: form._id });

    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
