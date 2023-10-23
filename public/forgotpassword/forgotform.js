// async function ForgotPassword(event){
//     event.preventDefault();
//      try{
//     const Name = event.target.name.value;
//     const Email = event.target.email.value;
  
//     const forgotdetail = {  
//       Email
//     }
//     const response = await axios.post('/password/forgotpassword', forgotdetail);


// }catch(err){
//     console.error('Error sending password reset request:', err);
// }

// }

function forgotpassword(e) {
    e.preventDefault();
    console.log(e.target.name);
    const form = new FormData(e.target);

    const userDetails = {
        email: form.get("email"),

    }
    console.log(userDetails)
    axios.post('http://51.20.41.30:3000/forgotpassword',userDetails).then(response => {
        if(response.status === 200){
            document.body.innerHTML += '<div style="color:blue;">Mail Successfuly sent <div>'
        } else {
            throw new Error('Something went wrong!!!')
        }
    }).catch(err => {
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    })
}