const express = require('express');
const userauthentication = require('../middleware/auth')

const PurchaseController = require('../controller/purchaseController')

const router = express.Router();

router.get('/purchase/premiummembership',userauthentication.authenticate,PurchaseController.purchasePremium)

router.get('/remove/premium',userauthentication.authenticate,PurchaseController.removePremium)

router.post('/purchase/updatetransactionstatus',userauthentication.authenticate,PurchaseController.updateTransactionStatus)

router.post('/purchase/updatetransactionFailed',userauthentication.authenticate,PurchaseController.updateTransactionFailed)

// router.get('/get/allExpense',PurchaseController.getAllExpenses)

module.exports = router  


