// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const wishlistValidate = require("../utilities/wishlist-validation")

// Route to add to Wishlist
router.post(
    "/add",
    wishlistValidate.addToWishlistRules(),
    wishlistValidate.checkAddData,
    utilities.handleErrors(invController.addToWishlist))


module.exports = router;