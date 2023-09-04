const express = require('express');

const SignupController = require('../controller/signController')

const router = express.Router();

router.post('/user/signup',SignupController.postSignup)

module.exports = router