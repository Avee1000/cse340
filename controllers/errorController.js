const utilities = require("../utilities/")
const errorController = {}

errorController.triggerError = async function (req, res, next) {
  // Create a new error and pass it to next()
  const err = new Error("Intentional Server Error")
  err.status = 500
  next(err)
}

module.exports = errorController