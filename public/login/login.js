async function Login(event){
    try{
  event.preventDefault();

  const Email = event.target.email.value;
  const Password = event.target.password.value;

  const loginDetails = {
    Email,  
    Password

  }
     /// which req should we made to check if login detail email exist or not

     console.log("Login Details:", loginDetails);
     const response =  await axios.post(`http://13.53.131.225:3000/check-email-exists`, loginDetails)
        console.log("data::::" ,response.data)

     if(response.data.Exist == true){
        alert("user logged in successfully")

        localStorage.setItem('token',response.data.token);
        console.log("test success");

        window.location.href = '../Expense/expense.html';
     }
      
    }catch(err){
        console.log('........error')
        document.body.innerHTML += 'Error:wrong email or password'
    }
}

function forgotpassword() {
   window.location.href = "../forgotpassword/forgotform.html"
}