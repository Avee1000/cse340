/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const cookieParser = require("cookie-parser")

const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const bodyParser = require("body-parser")

const route = require("./routes/inventoryRoute") 
const accountRoute = require("./routes/accountRoute")
const managementRoute = require("./routes/managementRoute")

const utilities = require("./utilities/")

const baseController = require("./controllers/baseController")
const errorController = require("./controllers/errorController")

const session = require("express-session")
const pool = require('./database/')


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root
app.use(session({
store: new (require('connect-pg-simple')(session))({
  createTableIfMissing: true,
  pool,
}),
secret: process.env.SESSION_SECRET,
resave: true,
saveUninitialized: true,
name: 'sessionId',
}))
// Express Messages Middleware  
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser()) // for parsing cookies

/* ***********************
 * Routes
 *************************/
app.use(static)
//Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Management route
app.use("/inv", managementRoute)
// Inventory routes
app.use("/inv", route)
// Account routes
app.use("/account", accountRoute)
// Error route for testing
// This route is used to trigger a 500 error for testing purposes
app.get('/error', utilities.handleErrors(errorController.triggerError))               
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})


/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  const status = err.status || 500
  const message = status === 404
    ? err.message
    : err.message || 'Oh no! There was a crash. Maybe try a different route?'
  res.status(status).render("errors/error", {
    title: `${status} Error`,
    message,
    nav
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})


