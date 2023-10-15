const Razorpay = require('razorpay'); 
const Order = require('../model/ordermodel');

const Expense = require('../model/ExpenseModel'); 
const Signup = require('../model/signupModel');





exports.purchasePremium = async (req, res,next) => {
  try {
    // Retrieve your Razorpay API key and secret from environment variables
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    ;
    // initialize rzp obj  which is instance of razorpay class
    const rzp = new Razorpay({
      key_id,
      key_secret,
    });

    if (!key_id || !key_secret) {
      throw new Error("Razorpay API key and secret are not configured.");
    }
    const amount = 2500;
     // req to made to rozar pay api through rzp.orders.create
    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      console.log("oooorrrdddeeerrr:", order)
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong with Razorpay", error: err.message });
      }
        // this particular user has created an order with pending state using req.user.createOrder
      req.user.createOrder({ orderid: order.id, status: "pending" })
        .then(() => {
          return res.status(201).json({ order, key_id });
        })
        .catch(err => {
          console.error(err);
          return res.status(500).json({ message: "Error creating user order", error: err.message });
        });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};
const jwt = require('jsonwebtoken');
function generateExcessToken(id,name,ispremiumuser){
  return jwt.sign({signupId:id,name:name,ispremiumuser},'mysecretcode')
  
}

exports.updateTransactionStatus = async (req, res) => {
  // try {
  //   const { payment_id, order_id } = req.body;

  //   // Find the order by order_id
  //   const order = await Order.findOne({ where: { orderid: order_id } });

  //   if (!order) {
  //     return res.status(404).json({ message: `Order with ID ${order_id} not found` });
  //   }

  //   // Update the order with payment_id and status
  //   const updatedOrder = await order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });

  //   // Update the user to indicate premium status
  //   await req.user.update({ ispremiumuser: true });

  //   return res.status(202).json({ success: true, message: "Transaction successful", updatedOrder });
  // } catch (error) {
  //   console.error(error);
  //   return res.status(500).json({ message: "Some internal error occurred", error: error.message });
  // }

  try{
    userid = req.user.id
    const {payment_id,order_id} = req.body;
    const order = await Order.findOne({orderid:order_id})
    const promise1 = order.update({paymentid:payment_id, status:"SUCCESSFUL"})
    const promise2 = req.user.update({ispremiumuser:true})

    Promise.all([promise1,promise2]).then(()=>{
    console.log("$$$$$$$$",req.user.ispremiumuser)
      return res.status(202).json({success:true, message:"Transaction Successful", token:generateExcessToken(userid,req.user.name,req.user.ispremiumuser)})
    }).catch((error)=>{
      throw new Error(error)
    })

  }catch(error){
    console.error(error);
    return res.status(500).json({ message: "Some internal error occurred", error: error.message });
  }
};

exports.removePremium = async (req, res, next) => {
  console.log("==================")
  console.log(req.user.ispremiumuser)
  try {
    if (req.user.ispremiumuser === true) {
      console.log("..................................true")
      return res.status(200).json({ isPremiumUser: true });
    } else {
      return res.status(200).json({ isPremiumUser: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateTransactionFailed = async(req,res,next)=>{
  try{
    const { payment_id, order_id } = req.body;


  const order = await Order.findOne({where:{orderid: order_id}})

  const updatedOrder = await order.update({ paymentid: payment_id, status: 'FAILED' });

  }catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Some internal error occurred", error: error.message });
  }
}




