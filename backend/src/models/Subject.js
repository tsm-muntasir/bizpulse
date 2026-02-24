const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    code: { type: String, trim: true, maxlength: 30 },
    examDate: { type: Date, required: true, index: true },
    weeklyTargetHours: { type: Number, min: 1, max: 60, default: 6 }
  },
  { timestamps: true }
);

subjectSchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
