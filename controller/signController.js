const signup = require('../model/signupModel');

exports.postSignup = async(req,res,next)=>{

    try{
    const Name = req.body.Name
    const Email = req.body.Email
    const Password = req.body.Password
    console.log(Name,Email,Password)

    const data = await signup.create({ Name:Name, Email:Email, Password:Password })

    res.status(201).json({newUserDetails:data})
    }catch(error){
    res.status(403).json({
       error:error
    })
  }
}

