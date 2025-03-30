const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => {
  if (req.method === "POST") {
    return "ms " + JSON.stringify(req.body)
  }
  return "ms"
})

app.use(morgan(':method :url :status :req[content-length] - :total-time :body'))

let phonebook = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/info', (request, response) => {
  const currTime = new Date()
  response.send(`<p>Phonebook has info for ${phonebook.length} people</p><p>${currTime}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = phonebook.find(p => p.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  phonebook = phonebook.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => String(Math.ceil(Math.random()*100000))

const checkName = name => phonebook.find(person => person.name === name)

app.post('/api/persons', (request, response) => {
  const { name, number } = request.body

  if (name && number) {
    if (checkName(name)) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    }
    const person = {
      id: generateId(),
      name,
      number
    }
    phonebook = [...phonebook, person]

    response.json(person)

  } else {
    response.status(400).json({
      error: 'Requested for empty name or number'
    })
  }

})

const PORT = 3001
app.listen(PORT, () => {
  console.log("Server running on port", PORT)
})
