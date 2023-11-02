const path = require('path');
const fs = require('fs')
require('dotenv').config();


const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')

const User = require('./model/signupModel')
const Expense = require('./model/ExpenseModel')
const Order = require('./model/ordermodel')
const Forgotpassword = require('./model/forgotformModel');
const FileURL = require('./model/fileURLModel')


const sequelize = require('./util/database')

const signupRoutes = require('./routes/signupRoutes')
const ExpenseRoutes = require('./routes/ExpenseRoutes')
const PurchaseRoutes = require('./routes/purchaseRoutes')
const PremiumFeaturesRoutes = require('./routes/premiumFeaturesRoutes')
const resetPasswordRoutes = require('./routes/forgotformRoutes')

var cors = require('cors');
const { truncate } = require('fs/promises');

const app = express()

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags: 'a'}
)

app.use(cors());
app.use(helmet())
app.use(compression())
app.use(morgan('combined',{ stream: accessLogStream}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(PremiumFeaturesRoutes)
app.use(PurchaseRoutes)
app.use(resetPasswordRoutes);
app.use(ExpenseRoutes)
app.use(signupRoutes)

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "script-src 'self' https://cdnjs.cloudflare.com");
    return next();
});

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "script-src 'self' https://cdnjs.cloudflare.com 'unsafe-inline'");
    return next();
});

  app.use((req, res) => {
//      console.log('urlll', req.url);
   // res.sendFile(path.join(__dirname, `public/login/login.html`));
   console.log("cicd deployment testing")
   console.log("build automation is working fine")
     res.sendFile(path.join(__dirname, `public/${req.url}`));

  });



User.hasMany(FileURL);
FileURL.belongsTo(User)


User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(Expense);
Expense.belongsTo(User)

User.hasMany(Order); 
Order.belongsTo(User)



sequelize.sync({force:true})
    .then(() => {
        console.log('Database and tables synced');
        app.listen(3000)
    })
    .catch((err) => {
        console.error('Error syncing database:', err);
    });





