const User = require('../model/signupModel')
const Expense = require('../model/ExpenseModel')
const sequelize = require('../util/database')

const getUserLeaderBoard = async (req,res,next) =>{
try{
    const leaderboardofuser  = await User.findAll({
        attributes: ['id','name',[sequelize.fn('sum',sequelize.col('Expenses.expense')),'total_cost']],
        include:[
            {
                model:Expense,
                attributes:[]
            }
        ],
        group:['signupId'],
        order:[['total_cost', 'DESC']]
    })
    res.status(200).json({AllExpenses:leaderboardofuser})
// const user = await User.findAll();
// const expense = await Expense.findAll()
// console.log("+++++++++++++" ,expense)

// const userAggregateExpense = [];

// expense.forEach((expense)=>{
//     // if(userAggregateExpense[expense.signupId]){
//     //     userAggregateExpense[expense.signupId] +=  expense.expense;
//     // }else{
//     //     userAggregateExpense[expense.signupId] = expense.expense
//     // }
//     const signupId = expense.signupId;
//     const expenseValue = parseFloat(expense.expense);

//     if (!isNaN(expenseValue)) {
//         if (userAggregateExpense[signupId]) {
//             userAggregateExpense[signupId] += expenseValue;
//         } else {
//             userAggregateExpense[signupId] = expenseValue;
//         }
//     } else {
//         console.error(`Invalid expense value for signupId ${signupId}: ${expense.expense}`);
//     }

// })
// var userLeaderBoardDetails = [];

// user.forEach((user)=>{
//     userLeaderBoardDetails.push({name:user.Name, total_cost:userAggregateExpense[user.id] || 0})
// })

// console.log(userAggregateExpense)
// userLeaderBoardDetails.sort((a,b)=>b.total_cost - a.total_cost)
// res.status(200).json({AllExpenses:userLeaderBoardDetails})

}catch(error){
    console.log(error)
    res.status(500).json(error)
}
}

module.exports = {
    getUserLeaderBoard
}