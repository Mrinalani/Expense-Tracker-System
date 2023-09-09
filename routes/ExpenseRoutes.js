const express = require('express');
const userauthentication = require('../middleware/auth')

const ExpenseController = require('../controller/ExpenseController')

const router = express.Router();

router.post('/add-expense',userauthentication.authenticate,ExpenseController.postaddExpense)

router.get('/get-expense',userauthentication.authenticate, ExpenseController.getExpense)

router.delete('/delete-Expense/:productId',userauthentication.authenticate, ExpenseController.deleteExpense)

module.exports = router  