const express = require('express');

const ExpenseController = require('../controller/ExpenseController')

const router = express.Router();

router.post('/add-expense',ExpenseController.postaddExpense)

router.get('/get-expense', ExpenseController.getExpense)

module.exports = router  