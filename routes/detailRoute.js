// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")



// Route to build inventory by detail view
router.get("/type/:invId", invController.buildByInventoryId);

module.exports = router;