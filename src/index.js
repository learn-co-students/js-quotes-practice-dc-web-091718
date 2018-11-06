// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading.

document.addEventListener("DOMContentLoaded", () => 
	{
		getQuotes()
		addClickListeners()

	})

function addClickListeners(){

	form = document.querySelector("form")
	form.addEventListener("submit", makeNewQuote)
}

function getQuotes(){
	fetch(' http://localhost:3000/quotes')
	.then(response => response.json())
	.then(json => render(json))
}


function getList(){
	return document.getElementById("quote-list")
}


function render(data){

	list = getList()
	list.innerHTML = ''
	data.forEach(
		x => {
		renderQuote(x)
				
	})
}

function renderQuote(x){
	listItem = document.createElement("div")
				listItem.className = "card p-3"
				listItem.id = x.id
				listItem.innerHTML = `
				   <blockquote class="blockquote mb-0 card-body">
				      <p>${x.quote}</p>
				      <footer class="blockquote-footer">
				        <small class="text-muted">
				          ${x.author}
				        </small>
				      </footer>
				    </blockquote>
					<button type="button" class="btn btn-warning">Edit</button>
					<button type="button" class="btn btn-danger">Delete</button>
							 		 
				`
				list.appendChild(listItem)
				
				buttonDelete = listItem.querySelector(".btn-danger")
				buttonEdit = listItem.querySelector(".btn-warning")

				buttonDelete.addEventListener("click", deleteQuote)
				buttonEdit.addEventListener("click", editQuote)

}


function deleteQuote(event){

	quoteId = event.currentTarget.parentElement.id
	fetch(`http://localhost:3000/quotes/${quoteId}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
	.then(json => {
		
		 card = document.getElementById(quoteId)
		 card.parentElement.removeChild(card)
		})

}
function makeNewQuote(event){

	event.preventDefault()

	let target = event.currentTarget
	let quote = event.currentTarget.querySelector("#new-quote").value
	let author = event.currentTarget.querySelector("#author").value

	data = {quote: quote , likes: 0, author: author}
	
	fetch(`http://localhost:3000/quotes`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(response => {
  	
  	if (response.status === 201){
  	target.querySelector("#new-quote").value = '' 
  	target.querySelector("#author").value = ''	
  	 getQuotes()
  	} else { 
  		alert(`response code  = ${response.status}`)
  }
})
}

function editQuote(event){

	alert('coming soon')
	
// card = event.currentTarget.parentElement
// var elementToReplace = card.parentElement.querySelector('p')
// var newElement = document.createElement("textarea")
// newElement.className = 'form-control'
// newElement.value = elementToReplace.innerHTML

// // <a href="/javascript/manipulation/creating-a-dom-element-51/">create a new element</a> that will take the place of "el"
// var newEl = document.createElement('p');
// newEl.innerHTML = '<b>Hello World!</b>';

// // replace el with newEL
// elementToReplace.parentNode.replaceChild(newElement, elementToReplace);
 }