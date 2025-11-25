const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    enum: ['very_sad', 'sad', 'neutral', 'happy', 'very_happy'],
    required: true
  },
  intensity: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  factors: [{
    type: String,
    enum: ['academic', 'social', 'financial', 'health', 'family', 'relationships', 'other']
  }],
  note: {
    type: String,
    maxlength: 500
  },
  tags: [String],
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for user mood entries
moodEntrySchema.index({ user: 1, date: -1 });

// Static method to get mood statistics
moodEntrySchema.statics.getMoodStats = async function(userId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$mood',
        count: { $sum: 1 },
        avgIntensity: { $avg: '$intensity' }
      }
    }
  ]);
};

module.exports = mongoose.model('MoodEntry', moodEntrySchema);
