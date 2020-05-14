const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs')

const user = new Schema({
  username: String,
  email: String,
  password: String
})

user.methods.encruptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

user.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password)
}

module.exports = model('User', user)