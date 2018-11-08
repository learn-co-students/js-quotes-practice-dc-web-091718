// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
const form = document.getElementById('new-quote-form')
const quotes = document.createElement('h2')
quotes.innerHTML = '<br>Quotes'
form.appendChild(quotes)
let formDisplay = false


document.addEventListener('DOMContentLoaded', function(){
  getAllquotes()

  form.addEventListener('submit', addQuote)
})

function getAllquotes() {
  fetch(`http://localhost:3000/quotes`)
  .then(results => results.json())
  .then(quotes => {
    quotes.forEach(quote => {renderQuote(quote)})
  })
}

function renderQuote(quote) {

  const quoteLi = document.createElement('ul')
  quoteLi.className = 'card'

  const blockquote = document.createElement('blockquote')
  blockquote.id = quote.id
  blockquote.className = 'blockquote'
  quoteLi.appendChild(blockquote)

  const quoteP = document.createElement('li')
  quoteP.className = `mb-${quote.id}`
  quoteP.innerText = quote.quote
  blockquote.appendChild(quoteP)

  const footer = document.createElement('footer')
  footer.className = 'blockquote-footer'
  footer.innerHTML = `${quote.author}`
  blockquote.appendChild(footer)

  const btnSuccess = document.createElement('BUTTON')
  btnSuccess.className = 'btn-success'
  btnSuccess.innerHTML = `Likes: <span>${quote.likes}</span>`
  blockquote.appendChild(btnSuccess)
  btnSuccess.addEventListener('click', addLikes)

  const btnDelete = document.createElement('BUTTON')
  btnDelete.className = 'btn-danger'
  btnDelete.innerText = `Delete`
  blockquote.appendChild(btnDelete)
  btnDelete.addEventListener('click', deleteQuote)

  const editButton = document.createElement('button')
  editButton.innerHTML = 'Edit'
  editButton.className = 'editButton'
  blockquote.appendChild(editButton)

  //EDIT BUTTON EVENT LISTENER
  editButton.addEventListener('click', editButtonClicked)

  const f = document.createElement("form");
  f.id = `form-${quote.id}`
  f.setAttribute('method',"post");
  f.setAttribute('action',"submit.php");

  var i = document.createElement("input"); //input element, text
  i.setAttribute('type',"text");
  i.placeholder = quote.quote
  i.id = `edit-quote-input-${quote.id}`
  i.setAttribute('name',"quote");

  var i2 = document.createElement("input"); //input element, text
  i2.setAttribute('type',"text");
  i2.id = `edit-author-input-${quote.id}`
  i2.placeholder = quote.author
  i2.setAttribute('name',"author");

  var s = document.createElement("input"); //input element, Submit button
  s.setAttribute('type',"submit");
  s.setAttribute('value',"Submit");

  f.appendChild(i);
  f.appendChild(i2);
  f.appendChild(s);
  f.style.display="none"


  blockquote.appendChild(f)

  quotes.appendChild(quoteLi)
}

function addQuote(event) {
  event.preventDefault()
  let url = `http://localhost:3000/quotes`
  let quote = document.getElementById('new-quote').value
  let author = document.getElementById('author').value
  let likes = 0
  fetch(url, {
    method: "POST",
    headers: {
      "Content-type" : "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({quote: quote, author: author, likes: 0})
  })
  .then(response => response.json())
  .then(data => renderQuote(data))
}

function deleteQuote(event) {
  event.preventDefault()
  let currentEl = event.currentTarget.parentNode
  let quoteId = currentEl.id
  let url = `http://localhost:3000/quotes/${quoteId}`
  fetch(url,
  {method: "DELETE"})
  .then(response => response.json())
  .then(data => {
  console.log(quoteId)
  let node = document.getElementById(quoteId).parentNode
  node.remove()
  })
}

function addLikes(event) {
  //optimistic rendering
  event.preventDefault()
  let likesText = event.currentTarget
  let likes = likesText.innerText.split(" ")[1]
  likes++
  likesText.innerText = `Likes: ${likes}`
  addLikesToDatabase(event, likes)
}

function addLikesToDatabase(event, likes) {
  console.log(event)
  let currentEl = event.currentTarget.parentNode
  console.log(currentEl)
  let quoteId = currentEl.id
  let url = `http://localhost:3000/quotes/${quoteId}`
  fetch(url, {
      method: "PATCH",
      headers: {
          "Content-Type" : "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(
          {likes: likes
        })
    })
    .then(response => response.json())
    .then(data => console.log(data))
}

  function toggleForm(quoteId) {
    var form = document.getElementById(`form-${quoteId}`)
    if (formDisplay) {
      form.style.display="block"
    }
    else {
      form.style.display="none"
    }
  }

function editButtonClicked(event) {
  event.preventDefault()
  formDisplay = !formDisplay
  var quoteId = event.target.parentNode.id
  toggleForm(quoteId)
  let form = document.getElementById(`form-${quoteId}`)
  form.addEventListener('submit', updateQuote)
}

function updateQuote(event) {
  event.preventDefault()
  var id = event.target.id.split("-")[1]
  var currentTextNode = event.target.firstChild
  var currentAuthorNode = document.querySelector(`#form-${id} :nth-child(2)`)
  var currentText = currentTextNode.placeholder
  var currentAuthor = currentAuthorNode.placeholder
  data = {quote: currentText, author: currentAuthor}
  var newText = (document.querySelector(`#edit-quote-input-${id}`)).value
  var newAuthor = (document.querySelector(`#edit-author-input-${id}`)).value
  if (newText) {
    data.quote = newText
  }
  if (newAuthor) {
    data.author = newAuthor
  }

  patchQuote(event, data)

}

function patchQuote(event, data) {
  var quoteId = event.target.id.split("-")[1]
  let url = `http://localhost:3000/quotes/${quoteId}`
  fetch(url, {
      method: "PATCH",
      headers: {
          "Content-Type" : "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(
          {quote: data.quote,
          author: data.author
        })
    })
    .then(response => response.json())
    .then(data => pessimisticallyRenderEditedQuote(data))
}

function pessimisticallyRenderEditedQuote(data) {
  const quoteId = data.id
  const quote = document.getElementById(`${quoteId}`).firstChild
  const author = document.getElementById(`${quoteId}`).childNodes[1]
  quote.innerHTML = data.quote
  author.innerHTML = data.author
}




































//
