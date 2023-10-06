

const uuid = require('uuid');
const bcrypt = require('bcrypt');
const User = require('../model/signupModel');
const Forgotpassword = require('../model/forgotformModel');


const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pandeymrinalani02@gmail.com',
    pass: 'odvv bpzg pxkp fwtr',
  },
});

const forgotpassword = async (req, res) => {
    console.log('this is forgot password controller')
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });
  
      if (user) {
        const id = uuid.v4();
        await user.createForgotpassword({ id, active: true });
  
        console.log('id 1=',id)
        // Create a nodemailer email message
        const mailOptions = {
          from: 'pandeymrinalani02@gmail.com',
          to: email,
          subject: 'Sending with Nodemailer is Fun',
          html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset your password</a>`,
        };
  
        // Send the email using nodemailer
        await transporter.sendMail(mailOptions);
         console.log('forgot password 1')
        return res
          .status(200)
          .json({ message: 'Link to reset password sent to your email', success: true });
      } else {
        throw new Error("User doesn't exist");
      }
    } catch (err) {
      console.error(err);
      return res.json({ message: err.message || 'An error occurred', success: false });
    }
  };
  

const resetpassword = (req, res) => {
    console.log('this is reset password controller')
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ active: false});
            console.log('reset password 1')
            console.log('id 2=',id)

            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>
                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}

const updatepassword = (req, res) => {
    console.log('this is update password controller')

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({ where: { id : resetpasswordrequest.signupId } }).then(user => {
                if(user) {
                    console.log('uuuussseerrrr===',user)
                    //encrypt the password
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.error(err); 
                            return res.status(500).json({ error: 'Password update failed', success: false });
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            if(err){
                                console.error(err); 
                                return res.status(500).json({ error: 'Password update failed', success: false });
                            }
                            user.update({ Password: hash }).then(() => {
                            
                                res.status(201).json({ message: 'Successfully updated the new password', success: true });
                            }).catch(err => {
                                console.error(err); 
                                res.status(500).json({ error: 'Password update failed', success: false });
                            });
                        });
                    });
                } else {
                    return res.status(404).json({ error: 'No user exists', success: false });
                }
            }).catch(err => {
                console.error(err); 
                return res.status(500).json({ error: 'User retrieval failed', success: false });
            });
        }).catch(err => {
            console.error(err); 
            return res.status(500).json({ error: 'Forgot password retrieval failed', success: false });
        });
    } catch(error) {
        console.error(error); 
        return res.status(403).json({ error, success: false });
    }
}



module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}