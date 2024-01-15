import { menuArray } from "./data.js";
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let itemsArray =  getItemsFromLocalStorage() || []


document.addEventListener('click', function(e) {
    e.target.dataset.add && addItemToCart(e.target.dataset.add)
    e.target.dataset.remove && removeItem(e.target.dataset.remove)
    e.target.id === 'complete-order-btn' && openModal()
})


// event listner for the form data
document.addEventListener('submit', function(e) {
    e.preventDefault()
    e.target.id === 'user-data' && displayOrderStatus()
})

//function to add items to cart
function addItemToCart(itemID){
    const listID = parseInt(itemID)
    const itemAdded = menuArray.find(item => item.id === listID)
   
    createNewLisOfItems(itemAdded)
    renderCart()

}

// function to delete items from cart
function removeItem(itemToRemoveID) {

    const itemToRemoveIndex = itemsArray.findIndex(item => item.uuid === itemToRemoveID)
    if (itemsArray.length === 1){
        document.getElementById('order-list').classList.add('hidden')   
    }
   
    itemsArray.splice(itemToRemoveIndex, 1)   
    localStorage.setItem('item', JSON.stringify(itemsArray))
       renderCart()
}

// function to open modal to complete forms
function openModal() {
    document.querySelector('.third-section').innerHTML = `
    <div class="form-modal">
    <h2>Enter card details</h2>
    <form  id="user-data">
        <input type="text" name="username" placeholder="Enter your name" required>
        <input type="number" name="cardnumber" placeholder="Enter your card number" required>
        <input type="number" name="cvv" placeholder="Enter CVV" required>
        <button type="submit" class="submit-btn" id="submit-btn">Pay</button>
    </form>
   </div>  `
   
}

// function to display order status
function displayOrderStatus() {
    const userData = document.getElementById('user-data')

    const getUserData = new FormData(userData)
    const name = getUserData.get('username')


    if(userData) {
        document.querySelector('.fourth-section').innerHTML = 
        `
        <p class="centre">Thanks, ${name}! Your order is on its way!</p>`
    }
    
    document.querySelector('.third-section').classList.toggle('hidden')
    document.getElementById('order-list').classList.toggle('hidden')

}

// function to create new array of selected items
function createNewLisOfItems(itemToAdd) {
    itemToAdd.uuid = uuidv4()
    const { id, name, price, uuid } = itemToAdd
    const itemNameAndPrice = {
        id: id,
        name: name,
        price: price,
        uuid: uuid
    }

    itemsArray.unshift(itemNameAndPrice)
    localStorage.setItem('item', JSON.stringify(itemsArray))

}

// function to retrieve items from localstorage
function getItemsFromLocalStorage() {
    const retrieveItems = JSON.parse(localStorage.getItem('item'))
    return retrieveItems

}

// function to render order list in a cart
function renderCart() {
    const retrieveItems = getItemsFromLocalStorage()
    const orderItems = document.getElementById('order-items') 
    const totalPrice = document.getElementById('total-price')
    let total = 0
    let renderItems = ''

    if (retrieveItems) {
        retrieveItems.forEach(items => {
               
                renderItems += `
                            <li class="each-item">
                            <p class="order-name" id="order-name">${items.name}</p>
                            <button class="remove-btn" data-remove=${items.uuid}>remove</button>
                            <p class="order-price">${items.price}</p>
                        </li>
                 `
                 total += items.price
                 document.getElementById('order-list').classList.remove('hidden')
        
         })
    } 
    
    totalPrice.innerText = total  
    orderItems.innerHTML = renderItems


} 
        
// function to render items on the menu
function lisOfItems(items){
   const itemMenu = document.getElementById('item-body')
    
   return items.map(item => {
    
            const { emoji, name, ingredients, price, id } = item
            
            itemMenu.innerHTML += `
                <div class="item-list" id="item-list">
                        <div class="item-emoji"> ${emoji}</div>
                        <div class="food-details">
                            <div class="item-name">${name}</div>
                            <div class="item-ingredient">${ingredients}</div>
                            <div class="item-price">$${price}</div>
                        </div>
                        <i class="fa-regular fa-plus" data-add="${id}"></i>
            </div>
            `
        })
}



lisOfItems(menuArray)
