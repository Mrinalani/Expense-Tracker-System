const jwt = require('jsonwebtoken')
const User = require('../model/signupModel')

const authenticate = async(req,res,next)=>{
    try{
     const token = req.header('Authorization')
     console.log("tttttttt",token)

     if (!token) {
        return res.status(401).json({ success: false, message: 'Authorization token is missing' });
    }

     const user = jwt.verify(token,'mysecretcode')
     console.log(">>>>>>>>>>>>" , user.signupId)

     User.findByPk(user.signupId)
     .then((user)=>{
      req.user = user
      next()
     })

    }catch(error){
        console.log(error)
        return res.status(401).json({success:false})
    }
}

module.exports = {
    authenticate
}