const express = require('express');
const authenticate = require('../../../middlewares/authenticate');
const noteController = require('../../../controllers/noteController');

const router = express.Router();

router.use(authenticate);
router.post('/upload', noteController.uploadMiddleware, noteController.uploadNote);
router.post('/', noteController.createTextNote);
router.get('/', noteController.listNotes);
router.get('/:id', noteController.getNote);
router.post('/:id/summarize', noteController.summarizeNote);
router.delete('/:id', noteController.deleteNote);

module.exports = router;
