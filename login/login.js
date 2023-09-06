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
     const response =  await axios.post(`http://localhost:3000/check-email-exists`, loginDetails)
        console.log("data::::" ,response.data)

     if(response.data.Exist == true){
        
        alert("user logged in successfully")
     }
      
    }catch(err){
        console.log('........error')
        document.body.innerHTML += `<div style="color:red;">Error:${err.message}</div>`
    }

}