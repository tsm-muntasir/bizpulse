const mongoose = require('mongoose');

const studyTaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    topic: { type: String, required: true },
    estimatedMinutes: { type: Number, required: true, min: 10 },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' }
  },
  { _id: false }
);

const studyPlanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    source: { type: String, enum: ['ai', 'manual'], default: 'ai' },
    aiModel: { type: String },
    generationPromptHash: { type: String },
    tasks: { type: [studyTaskSchema], default: [] },
    validFrom: { type: Date, required: true, index: true },
    validTo: { type: Date, required: true, index: true }
  },
  { timestamps: true }
);

studyPlanSchema.index({ userId: 1, subjectId: 1, createdAt: -1 });

module.exports = mongoose.model('StudyPlan', studyPlanSchema);
