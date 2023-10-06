const path = require('path');



const express = require('express');
const bodyParser = require('body-parser');

const User = require('./model/signupModel')
const Expense = require('./model/ExpenseModel')
const Order = require('./model/ordermodel')
const Forgotpassword = require('./model/forgotformModel');


const sequelize = require('./util/database')

const signupRoutes = require('./routes/signupRoutes')
const ExpenseRoutes = require('./routes/ExpenseRoutes')
const PurchaseRoutes = require('./routes/purchaseRoutes')
const PremiumFeaturesRoutes = require('./routes/premiumFeaturesRoutes')
const resetPasswordRoutes = require('./routes/forgotformRoutes')

var cors = require('cors');
const { truncate } = require('fs/promises');

const app = express()


app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(PremiumFeaturesRoutes)
app.use(PurchaseRoutes)
app.use(resetPasswordRoutes);
app.use(ExpenseRoutes)
app.use(signupRoutes)

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(Expense);
Expense.belongsTo(User)

User.hasMany(Order); 
Order.belongsTo(User)


sequelize.sync({})
    .then(() => {
        console.log('Database and tables synced');
        app.listen(3000)
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });





