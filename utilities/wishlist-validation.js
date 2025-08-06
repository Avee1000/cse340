const utilities = require(".")
const invModel = require("../models/inventory-model")
const {
    body,
    validationResult
} = require("express-validator")
const validate = {}

/*  **********************************
 *  Add to Wishlist Validation Rules
 * ********************************* */
validate.addToWishlistRules = () => {
    return [
        body("inv_id")
        .custom(async (inv_id) => {
            const inventoryExists = await invModel.checkExistingInventory(inv_id)
            if (inventoryExists) {
                throw new Error ("This inventory already exists")
            }
        }),
    ]
}



validate.checkAddData = async (req, res, next) => {
    const {
        inv_id
    } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("notice", errors)
       return res.redirect("/")
    }
    next()
}

module.exports = validate