const signup = require('../model/signupModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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

    // const data = await signup.create({ Name:Name, Email:Email, Password:Password })

    // res.status(201).json({newUserDetails:data})
            // code hashing
            bcrypt.hash(Password, 10, async (err, hash) => {
              if (err) {
                  console.error(err);
                  return res.status(500).json({ error: "Password hashing failed" });
              }
  
              // Create a new user with the hashed password
              await signup.create({ Name, Email, Password: hash });
  
              res.status(201).json({ message: "Successfully created a new user" });
          });
  

    }
    catch(error){
    res.status(500).json({
       error:error
    })
  }
}

function generateExcessToken(id,name){
  return jwt.sign({signupId:id,name:name},'mysecretcode')
  
}

exports.postLogin = async (req, res, next) => {
  try {
    const Email = req.body.Email;
    const Password = req.body.Password;

    console.log("Email:", Email);

    if (isstringvalid(Email) || isstringvalid(Password)) {
      return res.status(400).json({ message: 'Email or password is missing', Exist: false });
    }
    const user = await signup.findAll({where:{Email}})
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>", user)
          
     if(user.length>0){
       bcrypt.compare(Password,user[0].Password, (err, result)=>{
        if(err){
         return res.status(500).json({message:"something went wrong" , Exist:false})
        }
        if(result == true){
          return res.status(200).json({message:"user logged successfully" , Exist:true , token:generateExcessToken(user[0].id,user[0].Name)})
        }else{
          return res.status(400).json({message:"password is incorrect" , Exist:false})
        }
       })
     }else{
      return res.status(401).json({message:"user not found" , Exist:false})
     }

  }catch(error){
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}