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
        const response = await axios.post("http://localhost:3000/add-expense", obj);
            console.log(response)
          ShowUserOnScreen(response.data.newUserDetails);
    
      } catch (error) {
        console.error("An error occurred:", error);
      }
      event.target.reset();
    }
    

function ShowUserOnScreen(obj){
    const parentElement = document.getElementById('itemlist')
    const children = document.createElement('li');
    children.textContent = obj.expense+"-"+obj.description+"-"+obj.category

    const deletebutton = document.createElement('input');
    deletebutton.type = "button";
    deletebutton.value = 'delete';
    deletebutton.onclick = () => {
       parentElement.removeChild(children);
    }
    children.appendChild(deletebutton);
  parentElement.appendChild(children);
}

window.addEventListener("DOMContentLoaded", async() => {
    try{
   const response =  await axios.get("http://localhost:3000/get-expense")
        for (var i = 0; i < response.data.RetrivedData.length; i++) {
          const obj = response.data.RetrivedData[i];
          sellingPrices.push(obj.sellingPrice);
          ShowUserOnScreen(obj);
        }
    }catch(error){
        console.log(error);
      };
  
    })

