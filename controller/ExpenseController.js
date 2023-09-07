const Expense = require('../model/ExpenseModel')

exports.postaddExpense = async (req,res,next)=>{
    try{
    const expense = req.body.Expense;
    console.log("ghj***",expense)
    const description = req.body.Description;
    const category = req.body.Category;

    const data = await Expense.create( {expense:expense, description:description, category:category} )
    console.log(data)
    res.status(201).json({newUserDetails:data})
    }catch(error){
        console.error('Error:', error); 

        res.status(500).json({
            error: error.message 
        });

    }
}

exports.getExpense = async (req,res,next)=>{
    try{
        const data = await Expense.findAll()
        res.status(201).json({retrievedData:data})
        }catch(error){
            res.status(500).json({
                error:error
            })
        }
    }
