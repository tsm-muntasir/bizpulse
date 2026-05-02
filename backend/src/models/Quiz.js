const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    options: { 
      type: [{ 
        text: { type: String, required: true },
        isCorrect: { type: Boolean, default: false }
      }], 
      required: true,
      validate: [(arr) => arr.length >= 2, 'At least 2 options required']
    },
    explanation: { type: String, trim: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    tags: { type: [String], default: [] }
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    questions: { type: [questionSchema], required: true },
    source: { type: String, enum: ['ai', 'manual'], default: 'ai' },
    aiModel: { type: String },
    timeLimitMinutes: { type: Number, default: 30 },
    passingScore: { type: Number, default: 70, min: 0, max: 100 },
    totalAttempts: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

quizSchema.index({ userId: 1, subjectId: 1, createdAt: -1 });
quizSchema.index({ subjectId: 1, isActive: 1 });

module.exports = mongoose.model('Quiz', quizSchema);
