const express = require('express');

const SignupController = require('../controller/signController')

const router = express.Router();

router.post('/user/signup',SignupController.postSignup)

router.post('/check-email-exists', SignupController.postLogin)

module.exports = router