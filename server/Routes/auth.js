const express = require('express')
const router = express.Router();

const {log_in, sign_in} = require('../Controllers/authController');
router.post('/log-in', log_in);
router.post('/sign-up', sign_in);
module.exports = router