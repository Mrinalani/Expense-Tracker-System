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
        type:Sequelize.STRING
    },
    description:{
        type: Sequelize.STRING,
        unique: true
    },
    category: {
        type:Sequelize.STRING,
    }
})

module.exports = Expense;
