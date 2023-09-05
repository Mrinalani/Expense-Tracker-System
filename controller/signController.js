const signup = require('../model/signupModel');
const bcrypt = require('bcrypt');


function isstringvalid(string){
    if(string==undefined || string.length===0){
        return true;
    }else{
        return false;
    }
}

exports.postSignup = async(req,res,next)=>{

    try{
    const Name = req.body.Name
    const Email = req.body.Email
    const Password = req.body.Password
    console.log(Name,Email,Password)

    if(isstringvalid(Name) || isstringvalid(Email) || isstringvalid(Password)  ){
        return res.status(400).json({err:"Bad parameter . something is missing"})
    }

    const data = await signup.create({ Name:Name, Email:Email, Password:Password })

    res.status(201).json({newUserDetails:data})
    }catch(error){
    res.status(500).json({
       error:error
    })
  }
}

exports.postLogin = async (req, res, next) => {
    try {
      const Email = req.body.Email; // Get the email from the query parameter
      const Password = req.body.Password;
  
      console.log("Email:", Email);
  
      // Perform the email existence check
      const present = await signup.findOne({ 
        where: { 
          Email: Email, 
          Password: Password 
        } 
      });

      const emailcheck = await signup.findOne({where:{Email:Email}})
      
      if (present === null) {
        console.log("Email not found");
        if(emailcheck == null){
          res.status(404).json({ message: "Email not found", Exist: false });
        }else{
          res.status(400).json({ message: "password is incorrect", Exist: false });
        }
        
      }
       else {
        console.log("Email found");
        res.status(201).json({ message: "user logged in successfully", Exist: true });
      }

  
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  

