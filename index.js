require('dotenv').config();
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const port = 8080
const diary = require('./diary')

console.log(process.env);
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/diary', diary)

app.get('/health', (req, res) => {
  res.send('status: 200');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
