const mongoose = require('mongoose')
const config = require('../../config')

module.exports = async function () {
  try {
    await mongoose.connect(config.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('db is connected')
  } catch (err) {
    console.error('error: ', err)
  } 
}