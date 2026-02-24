const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    date: { type: Date, required: true, index: true },
    plannedMinutes: { type: Number, default: 0 },
    completedMinutes: { type: Number, default: 0 },
    accuracyScore: { type: Number, min: 0, max: 100, default: 0 },
    weaknessTopics: { type: [String], default: [] },
    streakCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

progressSchema.index({ userId: 1, subjectId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
