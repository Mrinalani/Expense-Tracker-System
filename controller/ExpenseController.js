const { json } = require('body-parser');
const Expense = require('../model/ExpenseModel')
const User = require('../model/signupModel')
const UserServices = require('../services/userservices')
const sequelize = require('../util/database');
const S3Services = require('../services/s3services')
const FileURL = require('../model/fileURLModel')


exports.downloadexpense = async (req, res, next) => {
  try {
    const userid= req.user.id
    const expenses = await UserServices.getExpenses(req);
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',req.user)
    const stringfiedexpenses = JSON.stringify(expenses);
    const filename = `Expense${userid}/${new Date}.txt`;

    const fileURL = await S3Services.uploadToS3(stringfiedexpenses, filename)
      console.log(fileURL)
        res.status(200).json({ fileURL, success: true });
  } catch (err) {
    console.log(err);
    // Handle other errors that might occur during expenses retrieval
    res.status(500).json({ success: false, message: err.message || 'An error occurred' });
  }
};

exports.getListOfDownloads = async (req,res,next)=>{
  const data = await FileURL.findAll({where:{signupId:req.user.id}})
  console.log(data)
  res.status(200).json({retrievedData:data})
}

exports.postFileURL = async(req,res,next)=>{
  const URL = req.body.fileURL;
  const data = await FileURL.create( {fileURL:URL,signupId:req.user.id})
  res.status(200).json({retrievedData:data})
}

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
   // try{
      //   const data = await Expense.findAll({where:{signupId:req.user.id}})
      //   //const data = await Expense.findAll()
      //  console.log("@@@@@@@@@@@@@@@@@@@@@",data)
      //  console.log(data.length)
      //  if(data.length==0){
      //   res.status(202).json({message:false})
      //  }else{
      //   res.status(201).json({retrievedData:data})
      //  }
      //   }catch(error){
      //       res.status(500).json({
      //           error:error
      //       })
      //   }
     }

     exports.getPagination = async (req, res, next) => {
      try {
          const page = parseInt(req.query.page) || 1;
          let expensesPerPage = parseInt(req.query.itemsPerPage) || 5;
  
          // Handle invalid expensesPerPage
          if (isNaN(expensesPerPage) || expensesPerPage < 1) {
              console.log('Invalid expensesPerPage. Using default value.');
              expensesPerPage = 5; // Set a default value
          }
  
          console.log('Page:', page);
          console.log('Expenses Per Page:', expensesPerPage);
  
          const offset = (page - 1) * expensesPerPage
          const data = await Expense.findAndCountAll({
              where: { signupId: req.user.id },
              offset,
              limit: expensesPerPage,
          });
  
          if (data.count === 0) {
              res.status(202).json({ message: false });
          } else {
              res.status(201).json({
                  retrievedData: data.rows,
                  totalCount: data.count,
                  currentPage: page,
              });
          }
      } catch (error) {
          res.status(500).json({ error: error.message });
          console.error(error);
      }
  };
  