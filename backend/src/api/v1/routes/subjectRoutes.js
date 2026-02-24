const express = require('express');
const authenticate = require('../../../middlewares/authenticate');
const validate = require('../../../middlewares/validate');
const { createSubjectSchema } = require('../../../validators/subjectValidators');
const subjectController = require('../../../controllers/subjectController');

const router = express.Router();

router.use(authenticate);
router.post('/', validate(createSubjectSchema), subjectController.createSubject);
router.get('/', subjectController.listSubjects);

module.exports = router;
