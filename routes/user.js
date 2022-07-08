const express = require('express')
const { body, validationResult } = require('express-validator');
const router = express.Router() 
const {isSignedIn, isAuthenticated, isAdmin} = require("../controllers/auth")
const {getUserById, getUser, getAllUsers, updateUser} = require("../controllers/user")

router.param("userId", getUserById)

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser)
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser)


// getting all users
router.get("/users", isSignedIn, getAllUsers)

module.exports = router