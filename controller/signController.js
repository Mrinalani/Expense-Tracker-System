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

// exports.postLogin = async (req, res, next) => {
//     try {
//       const Email = req.body.Email; // Get the email from the query parameter
//       const Password = req.body.Password;
  
//       console.log("Email:", Email);
  
//       // Perform the email existence check
//       const present = await signup.findAll({ 
//         where: { 
//           Email: Email, 
//           Password: Password 
//         } 
//       });
         

//       const emailcheck = await signup.findOne({where:{Email:Email}})
     
//       if (present.length === 0) {
//         console.log("Email not found");
//         if(emailcheck == null){
//           res.status(401).json({ message: "user not found", Exist: false });
//         }else{
//           res.status(404).json({ message: "password not correct", Exist: false });
//         }
        
//       }
//        else {
//         console.log("Email found");
//         res.status(201).json({ message: "user logged in successfully", Exist: true });
//       }

  
//     } catch (error) {
//       console.error("Error:", error);
//       return res.status(500).json({ message: "Internal server error", error: error.message });
//     }
//   };

/// //// other way of postlogin
  
// exports.postLogin = async (req, res, next) => {
//   try {
//     const Email = req.body.Email; // Get the email from the query parameter
//     const Password = req.body.Password;

//     console.log("Email:", Email);

//     if(isstringvalid(Email) || isstringvalid(Password)){
//       return res.status(400).json({message: 'email idor password is missing' , Exist:false})
//     }
//       const user = await signup.findAll({where: {Email:Email}})
//       if(user.length >0){
//         if(user[0].Password === Password){
//           return res.status(200).json({message: "user loggedin successfully" , Exist:true})
//         }else{
//           return res.status(400).json({message: "password is incorrect" , Exist:false})
//         }
//       }else{
//           return res.status(404).json({message: "user dosent exist" , Exist: false})
//       }

//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// };


exports.postLogin = async (req, res, next) => {
  try {
    const Email = req.body.Email;
    const Password = req.body.Password;

    console.log("Email:", Email);

    if (isstringvalid(Email) || isstringvalid(Password)) {
      return res.status(400).json({ message: 'Email or password is missing', Exist: false });
    }

    const user = await signup.findOne({ where: { Email: Email } });

    if (!user) {
      return res.status(404).json({ message: "User not found", Exist: false });
    }

    bcrypt.compare(Password, user.Password, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Password comparison failed", Exist: false });
      }

      if (result) {
        return res.status(200).json({ message: "User logged in successfully", Exist: true });
      } else {
        return res.status(401).json({ message: "Password is incorrect", Exist: false });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

