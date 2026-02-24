const express = require('express');
const authenticate = require('../../../middlewares/authenticate');
const authorizeRoles = require('../../../middlewares/authorizeRoles');
const roles = require('../../../constants/roles');
const adminController = require('../../../controllers/adminController');

const router = express.Router();

router.use(authenticate, authorizeRoles(roles.ADMIN));
router.get('/users', adminController.listUsers);

module.exports = router;
