//const Razorpay = require("razorpay");

//const { getAllExpenses } = require("./controller/purchaseController");

 async function SaveExpense(event){
    event.preventDefault();
    
    const Expense = event.target.expense.value;
    console.log(Expense)
    const Description = event.target.description.value;
    const Category = event.target.category.value;

    const obj = {
      Expense,
      Description,
      Category
    }
    console.log(obj)
      
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post("http://localhost:3000/add-expense", obj,{ headers: { "Authorization": token } });
            console.log(response)
          ShowUserOnScreen(response.data.newUserDetails);
    
      } catch (error) {
        console.error("An error occurred:", error);
      }
      event.target.reset();
    }
    

async function ShowUserOnScreen(obj){
    const parentElement = document.getElementById('itemlist')
    const children = document.createElement('li');
    children.textContent = obj.expense+"-"+obj.description+"-"+obj.category

    const deletebutton = document.createElement('input');
    deletebutton.type = "button";
    deletebutton.value = 'delete';
    deletebutton.onclick = async() => {
      console.log(obj.id)
      deleteUser(obj.id)
       parentElement.removeChild(children);
    }
    children.appendChild(deletebutton);
  parentElement.appendChild(children);
}

async function deleteUser(userid){
  try{
    const token = localStorage.getItem('token')
  console.log("id=",userid)
  
 const response =  await axios.delete(`http://localhost:3000/delete-Expense/${userid}`,{ headers: { "Authorization": token } })
 console.log(response.status)
const response2 =  await axios.get("http://localhost:3000/get-expense", { headers: { "Authorization": token } })

 console.log("%%%%%%",response.data)
  }catch(error){
    console.log(error)
  }
 
}

window.addEventListener("DOMContentLoaded", async() => {

    try{
      const token = localStorage.getItem('token')
      const response1 =await axios.get("http://localhost:3000/remove/premium", { headers: { "Authorization": token } });
      console.log(response1.data.isPremiumUser)
      if(response1.data.isPremiumUser == true){
        console.log(response1.data.isPremiumUser)
        document.getElementById('rzp-button').style.display = 'none'
        const div =  document.getElementById('divtag')
        div.textContent = 'You are a premium user';
        div.style.color = 'blue';
        document.getElementById('leaderboardbutton').textContent = 'LeaderBoard';
        const leaderbutton = document.getElementById('leaderboardbutton')
        leaderbutton.textContent = 'LeaderBoard';
        leaderbutton.onclick = async()=>{

          const leaderboard = document.getElementById('leaderboard')
          leaderboard.innerText = 'LEADERBOARD'

          const ulist1 = document.getElementById('ulist1')

           const response3 = await axios.get("http://localhost:3000/get/allExpense")
           try{
           if (response3.data.AllExpenses) {
            const allExpenses = response3.data.AllExpenses;
                 console.log("########",allExpenses)
            ulist1.innerHTML = '';

            for (let i = 0; i < allExpenses.length; i++) {
              const expense = allExpenses[i];
              const li = document.createElement('li');
              li.textContent = `Name - ${expense.Name} TotalExpense - ${expense.TotalExpense}`;
              ulist1.appendChild(li);
            }
        
            // You can then use allExpenses as needed
          } else {
            console.log("No Data Found Yet");
          }
        } catch (error) {
          console.log(error);
        
        }
        }
      }
     
   const response =  await axios.get("http://localhost:3000/get-expense", { headers: { "Authorization": token } });
   console.log(response)
   if(response.data.message == false){
    console.log("No Data Found Yet")
   }
   else{
        for (var i = 0; i < response.data.retrievedData.length; i++) {
          const obj = response.data.retrievedData[i];
          ShowUserOnScreen(obj);
        }
      }
    }catch(error){
        console.log(error);
      };
  
    })

    document.getElementById('rzp-button').onclick = async function(e){
      const token = localStorage.getItem('token')
      console.log(token)
    const response =  await axios.get("http://localhost:3000/purchase/premiummembership", { headers: { "Authorization": token } });
    
    console.log("response =",response)

var options = {
  key: response.data.key_id,// imp 
  amount: 2500,  // The amount should match the amount used when creating the order.
  currency: "INR",
  name: "Random Company",
  description: "Premium Membership",
  order_id: response.data.order.id,  // Make sure to extract the order ID correctly. imp
  handler: async function (response) {
    // Handle the response when payment is successful.
    console.log("success response=",response)
    await axios.post("http://localhost:3000/purchase/updatetransactionstatus", {
      order_id: options.order_id,
      payment_id: response.razorpay_payment_id
    }, { headers: { "Authorization": token } });

    alert("You are a premium user now");
    const response2 =await axios.get("http://localhost:3000/remove/premium", { headers: { "Authorization": token } });
    document.getElementById('rzp-button').style.display = 'none'
    const div =  document.getElementById('divtag')
    div.textContent = 'You are a premium user';
    div.style.color = 'blue';
    document.getElementById('leaderboardbutton').textContent = 'LeaderBoard';
    const leaderbutton = document.getElementById('leaderboardbutton')
    leaderbutton.textContent = 'LeaderBoard';
    leaderbutton.onclick = async()=>{

      const leaderboard = document.getElementById('leaderboard')
      leaderboard.innerText = 'LEADERBOARD'

      const ulist1 = document.getElementById('ulist1')

       const response3 = await axios.get("http://localhost:3000/get/allExpense")
       try{
       if (response3.data.AllExpenses) {
        const allExpenses = response3.data.AllExpenses;
             console.log("########",allExpenses)
        ulist1.innerHTML = '';

        for (let i = 0; i < allExpenses.length; i++) {
          const expense = allExpenses[i];
          const li = document.createElement('li');
          li.textContent = `Name - ${expense.Name} TotalExpense - ${expense.TotalExpense}`;
          ulist1.appendChild(li);
        }
    
        // You can then use allExpenses as needed
      } else {
        console.log("No Data Found Yet");
      }
    } catch (error) {
      console.log(error);
    
    }
    }
  }
};

    const rzp = new Razorpay(options);
    rzp.open();
    e.preventDefault();

    rzp.on('payment.failed',async function(response){
      await axios.post("http://localhost:3000/purchase/updatetransactionFailed", {
      order_id: options.order_id,
      payment_id: response.razorpay_payment_id
    }, { headers: { "Authorization": token } });
      console.log("response2=", response)
      alert("something went wrong")
    })
    }

