const QUOTES_URL = "http://localhost:3000/quotes" 

let populateQuotes = function() {
  fetch(QUOTES_URL)
    .then(response => response.json())
    .then(quotesJson => renderQuotes(quotesJson))
}

let renderQuotes = function(quotes) {
  for(const quote of quotes) {
    renderQuote(quote)
  }
}

let renderQuote = function(quote) {

  let card = document.createElement('li')
  card.className = 'quote-card'
  card.dataset.quoteId = quote.id

  let blockquote = document.createElement('blockquote')
  blockquote.className = 'blockquote'

  let quoteP = document.createElement('p')
  quoteP.className = "mb-0"
  quoteP.innerText = quote.quote

  let author = document.createElement('footer')
  author.className = "blockquote-footer"
  author.innerText = quote.author

  let likeButton = document.createElement('button')
  likeButton.className = "btn-success"
  let likeCount = document.createElement('span')
  likeCount.innerText = quote.likes
  likeButton.innerText = `Likes: `
  likeButton.appendChild(likeCount)
  likeButton.addEventListener('click', onLikeClick)

  let deleteButton = document.createElement('button')
  deleteButton.className = 'btn-danger'
  deleteButton.innerText = "Delete"
  deleteButton.addEventListener('click', onDeleteClick)

  card.appendChild(blockquote)
  card.appendChild(quoteP)
  card.appendChild(author)
  card.appendChild(document.createElement('br'))
  card.appendChild(likeButton)
  card.appendChild(deleteButton)

  document.querySelector("#quote-list").appendChild(card)
}

function onDeleteClick(event) {
  fetch(QUOTES_URL + `/${getQuoteId(event)}`, {
    method: "DELETE"
  })
    .then(event.target.parentElement.remove())
}

function onLikeClick(event) {
  let likeCount = ++(event.target.children[0].innerText)

  fetch(QUOTES_URL + `/${getQuoteId(event)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ likes: likeCount })
  })
}

function getQuoteId(event) {
  return event.target.parentElement.dataset.quoteId
}

function onNewQuoteSubmit(event) {
  event.preventDefault()
  
  fetch(QUOTES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(parseQuote())
  })
    .then(response => response.json())
    .then(quote => renderQuote(quote))
}

function parseQuote() {
  let quote = document.querySelector("#new-quote").value
  let author = document.querySelector("#author").value
  return {
    quote: quote,
    author: author,
    likes: 0
  }
}

document.addEventListener('DOMContentLoaded', () => {
  populateQuotes();
  document.querySelector("#new-quote-form").addEventListener('submit', onNewQuoteSubmit)
})