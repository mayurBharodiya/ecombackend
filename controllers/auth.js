const { validationResult } = require('express-validator');
var jwtoken = require('jsonwebtoken')
var { expressjwt: jwt } = require("express-jwt")
const User = require("../models/user")

exports.signup = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let ErrorFields = []
        errors.array().map((value, index) => {
            ErrorFields.push(value.param)
        })
        console.log(ErrorFields)

        ErrorFields.map((v) => {
            switch (v) {
                case 'name':
                    return console.log('Name should be atleast 5 character long')            
                case 'email':
                    return console.log('please type valid Email')
            
                case 'password':
                    return console.log('Password should be atleast 5 character long')            
                default:
                    break;
            }
        })

        return res.status(400).json({
            ManualErrorMSG: 'User not saved !!! Please Enter valid information.'
        })
    }
    const user = new User(req.body)
    user.save( (err, user) => {
        if(err) {
            console.log('GOT ERROR : ', err)
            res.status(400).json({ManualMSG : `Error while saving user data - ${err}`})
        }
        else {
            console.log('GOT RESPONSE : ', user)
            res.json({
                "name" : user.name,
                "email" : user.email,
                "id" : user._id
            })
        }
    })
}

exports.signin = (req, res) => {
    const { email, password } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        let ErrorFields = []
        errors.array().map((value, index) => {
            ErrorFields.push(value.param)
        })
        console.log(ErrorFields)

        ErrorFields.map((v) => {
            switch (v) {
                case 'name':
                    return console.log('Name should be atleast 5 character long')            
                case 'email':
                    return console.log('please type valid Email')
            
                case 'password':
                    return console.log('Password should be atleast 5 character long')            
                default:
                    break;
            }
        })

        return res.status(400).json({
            ManualErrorMSG: 'Please Enter valid Email and Password'
        })
    }

    User.findOne({ email }, (err, user) => {
        if (err) {
          return res.status(400).json({
            error: "Error in finding your acccount!!"
          });
        }

        if (!user) {
          return res.status(400).json({
            error: "Email Id doesn't Exists!!"
          });
        }
    
        if (!user.authenticate(password)) {
          return res.status(401).json({
            error: "Email and password do not match!!"
          });
        }
    
        //create token
        const token = jwtoken.sign({ _id: user._id }, process.env.SECRET);
        //put token in cookie
        res.cookie("token", token, { expire: new Date() + 9999 });
    
        //send response to front end
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, name, email, role } });
    })
}

exports.signout = (req, res) => {
    res.clearCookie("token")
    res.json({
        message: "user signout successfully!"
    })
}

// protected routes
exports.isSignedIn = jwt({
    secret: process.env.SECRET,
    // userProperty: "auth",    
    algorithms: ["HS256"]
})

// custom middlewares
exports.isAuthenticated = (req, res, next) => {
    console.log('isAuthenticated', req.profile, '\n',req.auth)
    let checker = req.profile && req.auth && req.profile._id == req.auth._id
    if(!checker) {
        return res.status(403).json({
            ManualMSG : 'ACCESS DENIED!!'
        })
    }
    next()
}

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0) {
        return res.status(403).json({
            ManualMSG : 'You are not Admin. ACCESS DENIED!!'
        })
    }
    next()
}