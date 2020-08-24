const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const passport = require('passport')
const session = require('express-session')
//const flash = require('express-flash')
const flash = require('connect-flash')

require('./db/mongoose')
require('./middleware/passport')

const authRouter = require('./routers/auth')
const userRouter = require('./routers/user')
const productRouter = require('./routers/product')
const cartRouter = require('./routers/cart')
const itemRouter = require('./routers/item')
const orderRouter = require('./routers/order')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../views'))

app.use(expressLayouts)
app.use(express.static(path.join(__dirname, '../public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use('/auth', authRouter)
app.use(function(req, res, next){
  if (req.user) {
    res.locals.user = { name: req.user.name, email: req.user.email }
  }
  next()
})
app.use(userRouter)
app.use(productRouter)
app.use(cartRouter)
app.use(itemRouter)
app.use(orderRouter)

module.exports = app