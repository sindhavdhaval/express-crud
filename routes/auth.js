const express = require('express'),
router = express.Router(),
tokencheck  = require("../middleware/tokencheck"),
Validation  = require("../middleware/validation");

//Define controller
const {
 signup,
 changePassword,
 linkExpired,
 resetPassword,
 forgotPassword
} = require("../controller/auth.controller")


//Define routes
router.post('/login',Validation(["email","password"]),signup)
router.post('/changePassword',tokencheck(),Validation(["password","oldPassword"]),changePassword)
router.post('/forgotPassword',Validation(["email"]),forgotPassword)
router.post('/linkExpired',Validation(["token"]),linkExpired)
router.post('/resetPassword',Validation(["token","password"]),resetPassword)

module.exports = router