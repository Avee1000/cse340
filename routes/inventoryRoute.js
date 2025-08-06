// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")
const managementValidate = require("../utilities/management-validation")


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Detail view route
router.get('/detail/:invId', invController.buildByInventoryId)

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to all allow editing of the item's information
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventory))

// Route to build delete view
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteInventory))

// Route to delete inventory from the database
router.post("/delete/",
    utilities.handleErrors(invController.deleteInventory))

// Route to update the inventory item
router.post("/update/",
    managementValidate.addInventoryRules(),
    managementValidate.checkUpdateData, 
    invController.updateInventory)



module.exports = router;