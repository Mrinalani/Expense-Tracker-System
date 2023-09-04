const Sequelize = require('sequelize')

const sequelize = new Sequelize('general-store', 'root', 'Vikas1998',{
    dialect:'mysql',
    host:'localhost'
})

module.exports = sequelize;