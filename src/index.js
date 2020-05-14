const express = require('express')
const config = require('../config')

const app = express()
require('./db/db')()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(require('./routes'))

app.listen(config.port, () => {
  console.log(`server on port ${config.port}`)
})