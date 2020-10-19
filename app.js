// =======================================
//              DEPENDENCIES
// =======================================
require("dotenv").config();
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const session = require('express-session')
const usersController = require('./controllers/UsersController')
const app = express();
const port = 5000;

// =======================================
//              MONGOOSE
// =======================================

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`
// mongoose.set('useFindAndModify', false)
// mongoose.connect( mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } )

const coinsController = require('./controllers/coinsController')

// =======================================
//              EXPRESS SETUP
// =======================================
// sets template engine to use
app.set('view engine', 'ejs')

// tells Express app where to find our static assets
app.use(express.static('public'))

// tells Express app to make use of the imported method-override library
app.use(methodOverride('_method'))

// tells Express app to parse incoming form requests,
// and make it available in req.body
app.use(express.urlencoded({
  extended: true
}))
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: "app_session",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 3600000 } // 3600000ms = 3600s = 60mins, cookie expires in an hour
}))

// =======================================
//              ROUTES
// =======================================


// app.get('/', (req, res) => {
//     res.send('Hello cruel World!')
//   })

// index route
app.get('/', coinsController.listCoins)

// show route
app.get('/coin-portfolio/', coinsController.showCoins)

// user registration form route
app.get('/users/register', usersController.showRegistrationForm)

// user registration
app.post('/users/register', usersController.register)

// user login form route
app.get('/users/login', usersController.showLoginForm)

app.post('/users/login', usersController.login)


// user dashboard
app.get('/users/dashboard', usersController.dashboard)


/**
 * USER ON-BOARDING ROUTES
 */

// // user registration form route
// app.get('/users/register', guestOnlyMiddleware, usersController.showRegistrationForm)

// // user registration
// app.post('/users/register', guestOnlyMiddleware, usersController.register)

// // user login form route
// app.get('/users/login', guestOnlyMiddleware, usersController.showLoginForm)

// // user login route
// app.post('/users/login', guestOnlyMiddleware, usersController.login)

// /**
//  * USER-ONLY ROUTES
//  */

//  // user dashboard
//  app.get('/users/dashboard', usersController.dashboard)


// / =======================================
//              LISTENER
// =======================================
console.log(mongoURI)
mongoose.connect( mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } )
.then(response => {

  console.log('DB connection successful')
app.listen(port, () => {
  console.log(`Tokofolio listening on port: ${port}`)
})
})
.catch(err => {
  console.log(err)
})

