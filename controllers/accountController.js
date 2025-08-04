const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null
    })
}


/* ****************************************
*  Process Registration
* *************************************** */
async function buildRegisterAccount(req, res) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password
  } = req.body

  
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }


  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve registered ${account_firstname}. Please log in.`
    )
    let nav = await utilities.getNav()
    res.status(201).render("./account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("./account/register", {
      title: "Registration",
      nav,
    })
  }
}


/************************************************
*  Deliver account management view
* *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()

  if (res.locals.loggedin) {
    const firstname = res.locals.accountData.account_firstname
    res.render("./account/account-management", {
      title: "Account Management",
      nav,
      firstname,
      errors: null
    })
  }

  // if (res.locals.loggedin && res.locals.accountData.account_type === 'Client') {
  //   res.render("./account/account-management", {
  //     title: "Account Management",
  //     nav,
  //     firstname,
  //     errors: null
  //   })
    
  // }
}

/* ****************************************
*  Process login request
* *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}


async function logOut(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  return res.redirect("/")
}


/* ****************************************
*  Build update account view
* *************************************** */
async function buildUpdateAccount(req, res) {
  let nav = await utilities.getNav()
  const accountData = res.locals.accountData
  res.render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  })
}

async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const existingEmail = res.locals.accountData.account_email
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  const hashedPassword = await bcrypt.hashSync(account_password, 10)

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword,
    existingEmail
  )

    // 🔁 Step 2: Create new token with updated info
  delete updateResult.account_password
  const newToken = jwt.sign(updateResult, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 3600 * 1000
  })

  // 🔁 Step 3: Set new token in cookie
  res.cookie("jwt", newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    maxAge: 3600 * 1000
  })


  if (updateResult) {
    req.flash("notice", "Your account has been updated successfully.")
    res.redirect("/")
  } else {
    req.flash("notice", "Sorry, the update failed. Please try again.")
    res.status(501).render("account/update", {
      title: "Update Account",
      nav
    })
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  buildRegisterAccount,
  accountLogin,
  buildAccountManagement,
  logOut,
  buildUpdateAccount,
  updateAccount
}