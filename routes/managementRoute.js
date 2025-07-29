// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const managementValidate = require("../utilities/management-validation")
const utilities = require("../utilities/")

// Route to management view
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to build add-classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Route to build add-inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))


router.post("/add-classification",
    managementValidate.addClassificationRules(),
    managementValidate.checkClassificationData,
    utilities.handleErrors(invController.processAddClassification)
)

module.exports = router;