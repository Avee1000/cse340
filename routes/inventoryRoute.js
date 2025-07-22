// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Detail view route
router.get('/detail/:invId', invController.buildByInventoryId)


module.exports = router;