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

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))


module.exports = router;