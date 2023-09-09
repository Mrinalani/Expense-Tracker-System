const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const User = require('./model/signupModel')
const Expense = require('./model/ExpenseModel')

const sequelize = require('./util/database')

const signupRoutes = require('./routes/signupRoutes')
const ExpenseRoutes = require('./routes/ExpenseRoutes')

var cors = require('cors')

const app = express()


app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(ExpenseRoutes)
app.use(signupRoutes)

User.hasMany(Expense)
Expense.belongsTo(User)

sequelize.sync({})
    .then(() => {
        console.log('Database and tables synced');
        app.listen(3000)
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });





