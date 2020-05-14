const { Router } = require('express')
const router = Router()
const { home, signup, emailAvailable, signin, logout, verifyToken } = require('../controllers')

router
  .get('/home', verifyToken, home)
  .get('logout', logout)
  .post('/signup', emailAvailable, signup)
  .post('/signin', signin)

module.exports = router