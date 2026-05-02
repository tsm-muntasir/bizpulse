const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const pdfParse = require('pdf-parse');
const env = require('../config/env');
const noteRepo = require('../repositories/noteRepository');
const aiService = require('../services/aiService');

const uploadDir = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname.replace(/\s+/g, '_')}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

async function extractTextFromPdf(filePath) {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

async function uploadNote(req, res) {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { title, subjectId, tags } = req.body;
  const filePath = req.file.path;

  let content = '';
  try {
    content = await extractTextFromPdf(filePath);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to parse PDF' });
  }

  const note = await noteRepo.create({
    userId: req.user.id,
    subjectId,
    title: title || req.file.originalname,
    content,
    sourceType: 'pdf',
    originalFileName: req.file.originalname,
    filePath,
    fileSize: req.file.size,
    mimeType: req.file.mimetype,
    tags: tags ? tags.split(',').map(t => t.trim()) : []
  });

  res.status(201).json(note);
}

async function createTextNote(req, res) {
  const { title, subjectId, content, tags } = req.body;

  const note = await noteRepo.create({
    userId: req.user.id,
    subjectId,
    title,
    content,
    sourceType: 'text',
    tags: tags || []
  });

  res.status(201).json(note);
}

async function summarizeNote(req, res) {
  const { id } = req.params;
  const note = await noteRepo.findById(id, req.user.id);

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  const prompt = `Summarize the following study notes and extract key points:\n\n${note.content.substring(0, 3000)}`;
  const schemaHint = '{"summary":"string","keyPoints":["string"]}';

  let aiOutput;
  try {
    aiOutput = await aiService.callAiStructured(prompt, schemaHint);
  } catch (_err) {
    aiOutput = {
      summary: 'Summary generation failed. Please review the content manually.',
      keyPoints: ['Review the full content for important information']
    };
  }

  const updatedNote = await noteRepo.updateSummary(
    id,
    req.user.id,
    aiOutput.summary,
    aiOutput.keyPoints
  );

  res.json(updatedNote);
}

async function listNotes(req, res) {
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 20), 100);
  const subjectId = req.query.subjectId;
  const docs = await noteRepo.listByUser(req.user.id, subjectId, page, limit);
  return res.status(200).json({ page, limit, data: docs });
}

async function getNote(req, res) {
  const doc = await noteRepo.findById(req.params.id, req.user.id);
  if (!doc) {
    return res.status(404).json({ message: 'Note not found' });
  }
  return res.status(200).json(doc);
}

async function deleteNote(req, res) {
  const note = await noteRepo.findById(req.params.id, req.user.id);
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  if (note.filePath) {
    try {
      await fs.unlink(note.filePath);
    } catch (err) {
    }
  }

  await noteRepo.deleteById(req.params.id, req.user.id);
  return res.status(204).send();
}

module.exports = {
  uploadMiddleware: upload.single('file'),
  uploadNote,
  createTextNote,
  summarizeNote,
  listNotes,
  getNote,
  deleteNote
};
