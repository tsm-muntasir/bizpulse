const express = require('express');
const authRoutes = require('./authRoutes');
const subjectRoutes = require('./subjectRoutes');
const aiRoutes = require('./aiRoutes');
const progressRoutes = require('./progressRoutes');
const paymentRoutes = require('./paymentRoutes');
const adminRoutes = require('./adminRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/subjects', subjectRoutes);
router.use('/ai', aiRoutes);
router.use('/progress', progressRoutes);
router.use('/payments', paymentRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
