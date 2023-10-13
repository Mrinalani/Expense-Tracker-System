const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const fileURL = sequelize.define('fileURL',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,  
        primaryKey: true
    },
    fileURL: {
        type:Sequelize.STRING
    },
    
})

module.exports = fileURL;