const User = require('../model/signupModel')
const Expense = require('../model/ExpenseModel')
const sequelize = require('../util/database')

const getUserLeaderBoard = async (req,res,next) =>{
try{
    const leaderboardofuser  = await User.findAll({

         order:[['totalExpense', 'DESC']]
    })
    console.log("===========",leaderboardofuser)
    res.status(200).json({AllExpenses:leaderboardofuser})

}catch(error){
    console.log(error)
    res.status(500).json(error)
}
}

module.exports = {
    getUserLeaderBoard
}