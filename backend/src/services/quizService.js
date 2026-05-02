const quizRepo = require('../repositories/quizRepository');

async function takeQuiz(quizId, userId, answers) {
  const quiz = await quizRepo.findById(quizId, userId);
  if (!quiz) {
    throw new Error('Quiz not found');
  }

  let correctCount = 0;
  const results = quiz.questions.map((q, index) => {
    const userAnswer = answers[index];
    const correctOption = q.options.findIndex(opt => opt.isCorrect);
    const isCorrect = userAnswer === correctOption;
    
    if (isCorrect) correctCount++;
    
    return {
      questionIndex: index,
      userAnswer,
      correctAnswer: correctOption,
      isCorrect,
      explanation: q.explanation
    };
  });

  const score = (correctCount / quiz.questions.length) * 100;
  const passed = score >= quiz.passingScore;

  await quizRepo.updateAttempts(quizId);

  return {
    quizId,
    score: Math.round(score),
    passed,
    correctCount,
    totalQuestions: quiz.questions.length,
    results
  };
}

module.exports = { takeQuiz };
