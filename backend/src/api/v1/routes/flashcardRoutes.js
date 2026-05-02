const express = require('express');
const authenticate = require('../../../middlewares/authenticate');
const flashcardController = require('../../../controllers/flashcardController');

const router = express.Router();

router.use(authenticate);
router.get('/', flashcardController.listFlashcards);
router.post('/generate', flashcardController.generateFlashcards);
router.delete('/:id', flashcardController.deleteFlashcard);

module.exports = router;
