const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    front: { type: String, required: true, trim: true },
    back: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    source: { type: String, enum: ['ai', 'manual'], default: 'ai' },
    nextReviewAt: { type: Date, index: true },
    reviewCount: { type: Number, default: 0 },
    easeFactor: { type: Number, default: 2.5 }
  },
  { timestamps: true }
);

flashcardSchema.index({ userId: 1, subjectId: 1, createdAt: -1 });

module.exports = mongoose.model('Flashcard', flashcardSchema);
