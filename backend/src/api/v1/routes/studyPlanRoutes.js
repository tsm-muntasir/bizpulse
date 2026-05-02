const express = require('express');
const authenticate = require('../../../middlewares/authenticate');
const studyPlanController = require('../../../controllers/studyPlanController');

const router = express.Router();

router.use(authenticate);
router.get('/', studyPlanController.listStudyPlans);
router.post('/generate', studyPlanController.generateStudyPlan);

module.exports = router;
