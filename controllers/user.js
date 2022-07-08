const User = require("../models/user")

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if(err) {
            return res.status(400).json({
                ManualMSG : 'error occured in getting user by id!!'
            })
        }
        if(!user) {
            return res.status(400).json({
                ManualMSG : 'user related to this id did not found!!'
            })            
        }

        // come back
        req.profile = user
        next()
    })
}

exports.getUser = (req, res) => {
    // get back gor password related
    req.profile.salt = undefined
    req.profile.encry_password = undefined
    req.profile.createdAt = undefined
    req.profile.updatedAt = undefined
    req.profile.__v = undefined
    return res.json(req.profile)
}

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true, useFindAndModify: false},
        (err, user) => {
            if(err) {
                return res.status(400).json({
                    ManualMSG : 'error occured in information updation!!' + "\n" + err
                })
            }
            if(!user) {
                return res.status(400).json({
                    ManualMSG : 'no user found with given id!!'
                })
            }
            user.salt = undefined
            user.encry_password = undefined
            user.createdAt = undefined
            user.updatedAt = undefined
            user.__v = undefined
            res.json({user})
        }
    )
}

// getting all users
exports.getAllUsers = (req, res) => {
    User.find().exec((err, users) => {
        if(err) {
            return res.status(400).json({
                ManualMSG : 'error occured in getting all users!!'
            })
        }
        if(!users) {
            return res.status(400).json({
                ManualMSG : 'users did not found!!'
            })            
        }
        res.json(users)
    })
}