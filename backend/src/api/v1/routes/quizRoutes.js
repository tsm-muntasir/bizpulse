const express = require('express');
const authenticate = require('../../../middlewares/authenticate');
const quizController = require('../../../controllers/quizController');

const router = express.Router();

router.use(authenticate);
router.get('/', quizController.listQuizzes);
router.get('/:id', quizController.getQuiz);
router.post('/:id/take', quizController.takeQuiz);
router.delete('/:id', quizController.deleteQuiz);

module.exports = router;
