// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
const form = document.getElementById('new-quote-form')
const quotes = document.createElement('h2')
quotes.innerHTML = '<br>Quotes'
form.appendChild(quotes)


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
  quoteLi.className = 'quote-card'

  const blockquote = document.createElement('blockquote')
  blockquote.id = quote.id
  blockquote.className = 'blockquote'
  quoteLi.appendChild(blockquote)

  const quoteP = document.createElement('li')
  quoteP.className = 'mb-0'
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
