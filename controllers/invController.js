const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null
  })
}

/* ***************************
 *  Build add-classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null
  })
}

/* ***************************
 *  Process classification addition
 * ************************** */
invCont.processAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", `Successfully added ${classification_name} classification.`)
    let nav = await utilities.getNav()
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the classification addition failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
    })
  }
}

/* ***************************
 *  Build add-inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationOptions = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationOptions,
    errors: null
  })
}


/* ***************************
 *  Process inventory addition
 * ************************** */
invCont.processAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body
  const numericId = parseInt(classification_id);

  const result = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, numericId)

    if (result) {
    req.flash("notice", `Successfully added ${inv_make} inventory.`)
    let nav = await utilities.getNav()
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the inventory addition failed.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add inventory",
      nav,
    })
  }
}


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
