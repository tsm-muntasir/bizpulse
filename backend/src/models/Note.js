const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, required: true },
    sourceType: { type: String, enum: ['pdf', 'text', 'url'], default: 'text' },
    originalFileName: { type: String },
    filePath: { type: String },
    fileSize: { type: Number },
    mimeType: { type: String },
    tags: { type: [String], default: [] },
    summary: { type: String },
    keyPoints: { type: [String], default: [] }
  },
  { timestamps: true }
);

noteSchema.index({ userId: 1, subjectId: 1, createdAt: -1 });
noteSchema.index({ userId: 1, tags: 1 });

module.exports = mongoose.model('Note', noteSchema);
