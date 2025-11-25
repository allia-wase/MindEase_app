const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['phq9', 'gad7', 'custom'],
    default: 'phq9'
  },
  answers: [{
    questionId: Number,
    questionText: String,
    answer: Number,
    points: Number
  }],
  totalScore: {
    type: Number,
    required: true
  },
  severity: {
    type: String,
    enum: ['minimal', 'mild', 'moderate', 'moderately_severe', 'severe'],
    required: true
  },
  recommendations: [String],
  completedAt: {
    type: Date,
    default: Date.now
  },
  note: String
}, {
  timestamps: true
});

// Compound index for user assessments
assessmentSchema.index({ user: 1, completedAt: -1 });

module.exports = mongoose.model('Assessment', assessmentSchema);
