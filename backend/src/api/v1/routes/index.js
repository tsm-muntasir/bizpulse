const express = require('express');
const authRoutes = require('./authRoutes');
const subjectRoutes = require('./subjectRoutes');
const noteRoutes = require('./noteRoutes');
const aiRoutes = require('./aiRoutes');
const quizRoutes = require('./quizRoutes');
const flashcardRoutes = require('./flashcardRoutes');
const studyPlanRoutes = require('./studyPlanRoutes');
const progressRoutes = require('./progressRoutes');
const paymentRoutes = require('./paymentRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/subjects', subjectRoutes);
router.use('/notes', noteRoutes);
router.use('/ai', aiRoutes);
router.use('/quizzes', quizRoutes);
router.use('/flashcards', flashcardRoutes);
router.use('/study-plans', studyPlanRoutes);
router.use('/progress', progressRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
