// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to display Wishlist
router.get("/view", utilities.handleErrors(invController.buildWishlist))

// Route to add to Wishlist
router.post(
    "/add",
    utilities.handleErrors(invController.addToWishlist))

// Route to delete from Wishlist
router.post(
    "/delete",
    utilities.handleErrors(invController.deleteFromWishlist))

module.exports = router;