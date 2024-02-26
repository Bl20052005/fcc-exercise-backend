const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')

const users = {}

const exercises = {}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', function(req, res) {
  const userId = crypto.randomUUID()
  users[userId] = {"username": req.body.username, "_id": userId}
  exercises[userId] = []
  res.json({"username": req.body.username, "_id": userId})
})

app.get("/api/users", function(req, res) {
  res.json(Object.values(users))
})

app.post("/api/users/:_id/exercises", function(req, res) {
  resObj = {
    description: req.body.description,
    duration: parseInt(req.body.duration),
    date: req.body.date ? new Date(req.body.date).toDateString() : new Date().toDateString()
  }
  exercises[req.params._id].push(resObj)
  res.json({...users[req.params._id], ...resObj})
})

app.get('/api/users/:_id/logs', function(req, res) {
  const userId = req.params._id
  starterObj = {...users[userId], count: exercises[userId].length, log: exercises[userId]}
  if(req.query.from) {
    starterObj = {...starterObj, log: starterObj.log.filter((exer) => new Date(exer.date).getTime() >= new Date(req.query.from).getTime())}
  }
  if(req.query.to) {
    starterObj = {...starterObj, log: starterObj.log.filter((exer) => new Date(exer.date).getTime() <= new Date(req.query.to).getTime())}
  }
  if(req.query.limit) {
    starterObj = {...starterObj, log: starterObj.log.slice(0,parseInt(req.query.limit))}
  }
  res.json(starterObj)
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
