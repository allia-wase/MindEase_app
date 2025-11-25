const express = require('express');
const Assessment = require('../models/Assessment');
const auth = require('../middleware/auth');

const router = express.Router();

// PHQ-9 questions
const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself in some way"
];

// Get assessment questions
router.get('/questions/:type', auth, (req, res) => {
  const { type } = req.params;
  
  if (type === 'phq9') {
    const questions = PHQ9_QUESTIONS.map((text, index) => ({
      id: index + 1,
      text,
      options: [
        "Not at all",
        "Several days",
        "More than half the days",
        "Nearly every day"
      ]
    }));
    
    return res.json({ questions });
  }
  
  res.status(404).json({ message: 'Assessment type not found' });
});

// Submit assessment
router.post('/submit', auth, async (req, res) => {
  try {
    const { type, answers, note } = req.body;
    
    // Calculate score
    let totalScore = answers.reduce((sum, answer) => sum + answer.answer, 0);
    
    // Determine severity
    let severity;
    if (totalScore <= 4) severity = 'minimal';
    else if (totalScore <= 9) severity = 'mild';
    else if (totalScore <= 14) severity = 'moderate';
    else if (totalScore <= 19) severity = 'moderately_severe';
    else severity = 'severe';
    
    // Generate recommendations based on severity
    const recommendations = generateRecommendations(severity);
    
    const assessment = new Assessment({
      user: req.user.userId,
      type,
      answers,
      totalScore,
      severity,
      recommendations,
      note
    });
    
    await assessment.save();
    
    res.status(201).json({
      message: 'Assessment submitted successfully',
      assessment: {
        id: assessment._id,
        totalScore,
        severity,
        recommendations,
        completedAt: assessment.completedAt
      }
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error submitting assessment',
      error: error.message 
    });
  }
});

// Get user assessment history
router.get('/history', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const assessments = await Assessment.find({ user: req.user.userId })
      .sort({ completedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-answers');
    
    const total = await Assessment.countDocuments({ user: req.user.userId });
    
    res.json({
      assessments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching assessment history',
      error: error.message 
    });
  }
});

// Get specific assessment
router.get('/:id', auth, async (req, res) => {
  try {
    const assessment = await Assessment.findOne({
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }
    
    res.json({ assessment });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching assessment',
      error: error.message 
    });
  }
});

function generateRecommendations(severity) {
  const recommendations = {
    minimal: [
      "Continue regular exercise and healthy eating habits",
      "Maintain social connections with friends and family",
      "Practice stress management techniques like mindfulness",
      "Check in with your mood regularly using our tracking feature"
    ],
    mild: [
      "Try our guided meditation and relaxation exercises",
      "Connect with peers in our anonymous support groups",
      "Consider speaking with a counselor about your concerns",
      "Use our mood tracking feature to monitor patterns"
    ],
    moderate: [
      "Schedule a session with one of our certified counselors",
      "Join our peer support groups to connect with others",
      "Explore our resource library for coping strategies",
      "Consider reaching out to your university counseling center"
    ],
    moderately_severe: [
      "Book a counseling session as soon as possible",
      "Reach out to your university's mental health services",
      "Consider sharing your concerns with a trusted person",
      "Use our crisis resources if you're having thoughts of self-harm"
    ],
    severe: [
      "Contact a mental health professional right away",
      "Use our crisis support section for immediate help",
      "Reach out to your university counseling center urgently",
      "Consider informing a trusted faculty member or advisor"
    ]
  };
  
  return recommendations[severity] || recommendations.minimal;
}

module.exports = router;
