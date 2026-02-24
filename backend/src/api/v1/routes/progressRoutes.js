const express = require('express');
const authenticate = require('../../../middlewares/authenticate');
const progressController = require('../../../controllers/progressController');

const router = express.Router();
router.use(authenticate);
router.get('/dashboard', progressController.getDashboard);

module.exports = router;
