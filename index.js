require('dotenv').config();
const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')

const port = 8080
// 随笔路由
const diary = require('./diary')
// 设置路由
const setting = require('./setting')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/diary', diary)
app.use('/setting', setting)

app.get('/health', (req, res) => {
  res.send('status: 200');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
