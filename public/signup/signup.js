async function signUp(event){
    try{
    event.preventDefault()

    const Name = event.target.name.value;
    const Email = event.target.email.value;
    const Password = event.target.password.value;

    const signupDetail = {
        Name,
        Email,
        Password
    }

    const response = await axios.post("http://51.20.41.30:3000/user/signup",signupDetail)
    if(response.status === 201){
        window.location.href = "../login/login.html"
       console.log('get request successfull')
    }else{
        throw new Error('failed to login');
    }
    }catch(err){
        console.log('........error')
        console.log(err)
        document.body.innerHTML += `<div style="color:red;">Error:${err.message}</div>`
    }

    event.target.reset()
    }
