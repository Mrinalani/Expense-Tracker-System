const express = require('express');
const userauthentication = require('../middleware/auth')

const ExpenseController = require('../controller/ExpenseController')

const router = express.Router();

router.post('/add-expense',userauthentication.authenticate,ExpenseController.postaddExpense)

router.post('/user/postFileURL',userauthentication.authenticate,ExpenseController.postFileURL)

router.get('/get-expense',userauthentication.authenticate, ExpenseController.getExpense)

router.get('/user/download',userauthentication.authenticate,ExpenseController.downloadexpense)

router.get('/user/listOfDownloads',userauthentication.authenticate,ExpenseController.getListOfDownloads)

router.get('/get-pagination', userauthentication.authenticate, ExpenseController.getPagination);

router.delete('/delete-Expense/:productId',userauthentication.authenticate, ExpenseController.deleteExpense)

module.exports = router  