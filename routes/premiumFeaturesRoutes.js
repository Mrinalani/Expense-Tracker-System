const express = require('express');

const userauthentication = require('../middleware/auth')

const premiumFeatureController = require('../controller/premiumFeatureController')

const router = express.Router();

router.get('/showLeaderBoard',userauthentication.authenticate,premiumFeatureController.getUserLeaderBoard)

module.exports = router  