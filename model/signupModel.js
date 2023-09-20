const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Signup = sequelize.define('signup',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,  
        primaryKey: true
    },
    Name: {
        type:Sequelize.STRING
    },
    Email:{
        type: Sequelize.STRING,
        unique: true
    },
    Password: {
        type:Sequelize.STRING,
    },
    ispremiumuser: {
        type:Sequelize.BOOLEAN,
    },
    totalExpense:{
        type:Sequelize.FLOAT
    }
})

module.exports = Signup;
