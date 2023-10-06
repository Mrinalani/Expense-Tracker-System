const express = require('express');

const resetpasswordController = require('../controller/forgotformController');


const router = express.Router();

router.get('/password/updatepassword/:resetpasswordid', resetpasswordController.updatepassword)

router.get('/password/resetpassword/:id', resetpasswordController.resetpassword)

router.post('/forgotpassword', resetpasswordController.forgotpassword)

module.exports = router;