

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
    leaderboard

async function ShowUserOnScreen(obj){
    const parentElement = document.getElementById('itemlist')
    const children = document.createElement('li');
    children.textContent = ` RECENT EXPENCE => ${obj.expense}-${obj.description}-${obj.category}`

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
 console.log(">>>>>>>>>>>>>>>>>...",response)

const response2 =  await axios.get("http://localhost:3000/get-expense", { headers: { "Authorization": token } })

 console.log("%%%%%%",response2.data)
  }catch(error){
    console.log(error)
  }
 
}

function showLeaderBoard(){
 
  console.log("inside showleader function")

  document.getElementById('leaderboardbutton').textContent = 'LeaderBoard';
  const leaderbutton = document.getElementById('leaderboardbutton')
  leaderbutton.textContent = 'LeaderBoard';
  leaderbutton.onclick = async()=>{

    const leaderboard = document.getElementById('leaderboard')
    leaderboard.innerText = 'LEADERBOARD'

    const ulist1 = document.getElementById('ulist1')

    const token = localStorage.getItem('token')

     const response3 = await axios.get('http://localhost:3000/showLeaderBoard', { headers: { "Authorization": token } })
     try{
     if (response3.data.AllExpenses) {
      const allExpenses = response3.data.AllExpenses;
           console.log("########",allExpenses)
      ulist1.innerHTML = '';

      for (let i = 0; i < allExpenses.length; i++) {
        const expense = allExpenses[i];
        const li = document.createElement('li');
        li.textContent = `Name - ${expense.Name}   TotalExpense - ${expense.totalExpense}`;
        ulist1.appendChild(li);
      }
  
    } else {
      console.log("No Data Found Yet");
    }
  } catch (error) {
    console.log(error);
  
  }
  }

}

function download(){
  const token = localStorage.getItem('token')
  axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
  .then((response) => {
      if(response.status === 200){
          console.log(response.data.fileURL);

          const obj = {
          fileURL:response.data.fileURL
          }


          axios.post('http://localhost:3000/user/postFileURL',obj,{ headers: {"Authorization" : token} })
          .then((response)=>{
              console.log(response)
          }).catch((err)=>{
            console.log(err)
          })


          var a = document.createElement("a");
          a.href = response.data.fileURL;
          a.download = 'myexpense.csv';
          a.click();
      } else {
          throw new Error(response.data.message)
      }

  })
  .catch((err) => {
      console.log(err)
  });
}

function GetAllDownloads() {
  const token = localStorage.getItem('token');

  axios.get('http://localhost:3000/user/listOfDownloads', { headers: { "Authorization": token } })
    .then((response) => {
      if (response.status === 200) {
        const downloads = response.data.retrievedData;

        displayDownloads(downloads);
      } else {
        console.error('Request failed with status code:', response.status);
      }
    })
    .catch((error) => {
      console.error('An error occurred while fetching downloads:', error);
    });
}


function displayDownloads(downloads) {
  const downloadsContainer = document.getElementById("downloads-container");
  downloadsContainer.innerHTML = '';

  // Iterate through the downloads and create links with download dates
  downloads.forEach((download) => {
    const downloadItem = document.createElement("div");
    const downloadLink = document.createElement("a");
    
    // Set the download link's attributes
    downloadLink.textContent = `File Downloaded on: ${download.createdAt}`;
    downloadLink.href = download.fileURL;
    downloadLink.target = "_blank"; // Opens the link in a new tab

    // Append the download link to the container
    downloadItem.appendChild(downloadLink);
    downloadsContainer.appendChild(downloadItem);
  });
}





function showPremiumUserMessage(){
  document.getElementById('rzp-button').style.display = 'none'
    const div =  document.getElementById('divtag')
    div.textContent = 'You are a premium user';
    div.style.color = 'blue';
}

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}


window.addEventListener("DOMContentLoaded", async() => {

    try{
      const token = localStorage.getItem('token')
      const decodeToken = parseJwt(token)
      console.log("::::::::", decodeToken)
      const ispremiumuser = decodeToken.ispremiumuser
      if(ispremiumuser){
        showPremiumUserMessage()
        showLeaderBoard()
      }
     
   const response =  await axios.get("http://localhost:3000/get-expense", { headers: { "Authorization": token } });
   console.log(response)
   if(response.data.message == false){
    console.log("No Data Found Yet")
   }
   else{
        for (var i = 0; i < response.data.retrievedData.length; i++) {
          const obj = response.data.retrievedData[i];
         // ShowUserOnScreen(obj);
        }
      }
    }catch(error){
        console.log(error);
      };
  
    })

    document.getElementById('rzp-button').onclick = async function(e){
      const token = localStorage.getItem('token')
      console.log("%%%%%",token)
    const response =  await axios.get("http://localhost:3000/purchase/premiummembership", { headers: { "Authorization": token } });
    
    console.log("response =",response)

var options = {
  key: response.data.key_id,// imp 
  amount: 2500,  
  currency: "INR",
  name: "Random Company",
  description: "Premium Membership",
  order_id: response.data.order.id, 
  handler: async function (response) {
    
    console.log("success response=",response)
    const response2 = await axios.post("http://localhost:3000/purchase/updatetransactionstatus", {
      order_id: options.order_id,
      payment_id: response.razorpay_payment_id
    }, { headers: { "Authorization": token } });

    console.log("!!!!!!!!!!!!!!!!!",response2)

    alert("You are a premium user now");
    document.getElementById('rzp-button').style.display = 'none'
    const div =  document.getElementById('divtag')
    div.textContent = 'You are a premium user';
    div.style.color = 'blue';
    localStorage.setItem('token',response2.data.token)
    showLeaderBoard()
   
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


// Add event listeners for pagination buttons
document.getElementById('firstPageButton').addEventListener('click', () => changePage(1));
document.getElementById('prevPageButton').addEventListener('click', () => {
  changePage(currentPage - 1)
  console.log('currentPage P', currentPage)
});
document.getElementById('nextPageButton').addEventListener('click', () => {
  changePage(currentPage + 1)
  console.log('currentPage N', currentPage)
});
document.getElementById('lastPageButton').addEventListener('click', () => changePage(totalPages)); // Change this line

// Initialize currentPage and totalPages
let currentPage = 1;
let totalPages = 1;

// Function to update the page
function changePage(newPage) {
  if (newPage < 1 || newPage > totalPages) return;

  // Update the current page and make a request to the server with the new page
  currentPage = newPage;
  if (currentPage === totalPages) {
      // For the "Last" button, make the request with the maximum page value
      updateExpenseTable(totalPages);
  } else {
      updateExpenseTable(currentPage);
  }
}

let itemsPerPage = 5;

async function updateExpenseTable(page) {
  try {
    const token = localStorage.getItem('token');
    console.log ('page=',page)
    const response = await axios.get(`http://localhost:3000/get-pagination?page=${page}`, { headers: { "Authorization": token } });
    const data = response.data;

    const itemlist = document.getElementById('itemlist');
    itemlist.innerHTML = ''; // Clear the existing content

    if(data.message == false){
       console.log('length is zero')
    }else{
    if (data.retrievedData.length > 0) {
      const currentPage = data.currentPage;
      const firstItemNumber = (currentPage - 1) * itemsPerPage + 1;

      data.retrievedData.forEach((expense, index) => {
        const li = document.createElement('li');
        const itemNumber = firstItemNumber + index;
        li.textContent = `${itemNumber}. ${expense.description} - ${expense.category} - ${expense.expense}`;

        const deletebutton = document.createElement('input');
        deletebutton.type = "button";
        deletebutton.value = 'delete';
        deletebutton.onclick = async () => {
          console.log(expense.id);
          deleteUser(expense.id);
          itemlist.removeChild(li); 
        };
        
        li.appendChild(deletebutton);
        itemlist.appendChild(li);
        
      });
    }
  }
  

    // Update the total pages
    totalPages = Math.ceil(data.totalCount / itemsPerPage);

    // Enable/disable pagination buttons based on the current page and total pages
    document.getElementById('firstPageButton').disabled = page === 1;
    document.getElementById('prevPageButton').disabled = page === 1;
    document.getElementById('nextPageButton').disabled = page === totalPages;
    document.getElementById('lastPageButton').disabled = page === totalPages;
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

updateExpenseTable(1);
