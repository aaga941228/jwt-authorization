require('dotenv').config()

module.exports = {
  secret: process.env.SECRET,
  port: process.env.PORT
}