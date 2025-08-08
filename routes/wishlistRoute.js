// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to add to Wishlist
router.post(
    "/add",
    utilities.handleErrors(invController.addToWishlist))


module.exports = router;