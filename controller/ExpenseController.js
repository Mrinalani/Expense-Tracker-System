const Expense = require('../model/ExpenseModel')
const User = require('../model/signupModel')
const sequelize = require('../util/database');


exports.postaddExpense = async (req,res,next)=>{
    try{
        const t = await sequelize.transaction(); 
    var expense = req.body.Expense;
    console.log("ghj***",expense)
    const description = req.body.Description;
    const category = req.body.Category;
    
    const data = await Expense.create( {expense:expense, description:description, category:category, signupId:req.user.id},
         { transaction: t } )

    expense = parseFloat(req.body.Expense)
    const TotalExpense = parseFloat(req.user.totalExpense);
    const updatedExpense = TotalExpense+expense

    const update = await User.update( { totalExpense: updatedExpense },
        { where: { id: req.user.id } ,transaction: t })

        await t.commit();

    console.log(data)
    res.status(201).json({newUserDetails:data})
    }catch(error){

        await t.rollback();


        console.error('Error:', error); 

        res.status(500).json({
            error: error.message 
        });

    }
}


exports.deleteExpense = async (req, res, next) => {
  const t = await sequelize.transaction(); // Create a transaction object
  
  try {
    console.log("hjhgfghjh");
    const prodId = req.params.productId;
    const data = await Expense.findByPk(prodId, { transaction: t });  // use transaction 

    if (data.signupId !== req.user.id) {
      throw new Error("Permission denied. You can only delete your own expenses.");
    }

    console.log("destroyedData =", data);
    const deletedItem = await data.destroy({ transaction: t });  // use transaction

    const expense = deletedItem.expense;
    const TotalExpense = req.user.totalExpense;
    const updatedItem = TotalExpense - expense;

    await User.update(
      { totalExpense: updatedItem },
      { where: { id: req.user.id }, transaction: t }      // use transaction
    );

    await t.commit(); // Commit the transaction

    res.status(201).json({ deletedData: deletedItem });
  } catch (error) {
    await t.rollback(); // Rollback the transaction if an error occurs

    console.error(error);
    res.status(500).json({ error: "An error occurred while deleting the expense" });
  }
};

exports.getExpense = async (req,res,next)=>{
    try{
        const data = await Expense.findAll({where:{signupId:req.user.id}})
        //const data = await Expense.findAll()
       console.log("@@@@@@@@@@@@@@@@@@@@@",data)
       console.log(data.length)
       if(data.length==0){
        res.status(202).json({message:false})
       }else{
        res.status(201).json({retrievedData:data})
       }
        }catch(error){
            res.status(500).json({
                error:error
            })
        }
    }
