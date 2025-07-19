const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['text', 'multiple-choice'],
    required: true
  },
  options: [{
    type: String,
    trim: true
  }], // Only for multiple-choice questions
  required: {
    type: Boolean,
    default: true
  }
});

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  questions: [questionSchema],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  publicUrl: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate public URL before saving
formSchema.pre('save', function(next) {
  if (!this.publicUrl) {
    this.publicUrl = this._id.toString();
  }
  next();
});

module.exports = mongoose.model('Form', formSchema);
