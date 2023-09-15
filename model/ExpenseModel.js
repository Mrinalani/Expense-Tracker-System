const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Expense = sequelize.define('Expense',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,  
        primaryKey: true
    },
    expense: {
        type:Sequelize.FLOAT
    },
    description:{
        type: Sequelize.STRING,
    },
    category: {
        type:Sequelize.STRING,
    }
})

module.exports = Expense;
