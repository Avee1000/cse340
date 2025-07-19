const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  console.log('Request Params:', req.params)
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByInventoryId = async function (req, res, next) {
  const invId = req.params.invId
  const data = await invModel.getInventoryById(invId)
  const nav = await utilities.getNav()
  if (data.length > 0) {
    const itemHTML = await utilities.buildDetailView(data[0])
    res.render("./inventory/details", {
      title: `${data[0].inv_make} ${data[0].inv_model}`,
      nav,
      itemHTML,
    })
  } else {
    next({ status: 404, message: "Vehicle not found" })
  }
}

module.exports = invCont
