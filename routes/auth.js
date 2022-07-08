const express = require('express')
const { body, validationResult } = require('express-validator');
const router = express.Router() 
const {signout, signup, signin, isSignedIn} = require('../controllers/auth')

router.post('/signup', 
    body('name').isLength({ min: 5 }), 
    body('email').isEmail(), 
    body('password').isLength({ min: 5 }), 
    signup
)

router.post('/signin', 
    body('email').isEmail(), 
    body('password').isLength({ min: 5 }), 
    signin
)

router.get('/signout', signout)

router.get('/testroute',isSignedIn, (req, res) => {
    res.send("Protected Route!!")
})

module.exports = router