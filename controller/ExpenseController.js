const Expense = require('../model/ExpenseModel')
const User = require('../model/signupModel')

exports.postaddExpense = async (req,res,next)=>{
    try{
    var expense = req.body.Expense;
    console.log("ghj***",expense)
    const description = req.body.Description;
    const category = req.body.Category;
    
    const data = await Expense.create( {expense:expense, description:description, category:category, signupId:req.user.id} )

    expense = parseFloat(req.body.Expense)
    const TotalExpense = parseFloat(req.user.totalExpense);
    const updatedExpense = TotalExpense+expense

    const update = await User.update( { totalExpense: updatedExpense },
        { where: { id: req.user.id } })




    console.log(data)
    res.status(201).json({newUserDetails:data})
    }catch(error){
        console.error('Error:', error); 

        res.status(500).json({
            error: error.message 
        });

    }
}

exports.deleteExpense = async (req, res, next) => {
  try {
    console.log("hjhgfghjh")
    const prodId = req.params.productId;
    const data = await Expense.findByPk(prodId);
    if (data.signupId !== req.user.id) {
        return res.status(202).json({ message: "Permission denied. You can only delete your own expenses." });
      }
    console.log("destroyedData =", data);
    const deletedItem = await data.destroy();
    res.status(201).json({ deletedData: deletedItem });

           const expense = deletedItem.expense
           const TotalExpense = req.user.totalExpense
           const updateditem = TotalExpense-expense
           const update = await User.update( { totalExpense: updateditem },
            { where: { id: req.user.id } })

  } catch (error) {
    console.log(error);
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
