const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build the registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to handle user registration
router.post("/register", utilities.handleErrors(accountController.buildRegisterAccount))

module.exports = router