const utilities = require(".")
const managementModel = require("../models/inventory-model")
const {
    body,
    validationResult
} = require("express-validator")
const validate = {}

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.addClassificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("A valid classification name is required.")
        .custom(async (classification_name) => {
            const classificationExists = await managementModel.checkExistingClassification(classification_name)
            if (classificationExists) {
                throw new Error ("classification already exists")
            }
        }),
    ]
}


/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const {
        classification_name
    } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name
        })
        return
    }
    next()
}

module.exports = validate