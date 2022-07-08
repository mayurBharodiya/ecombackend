const mongoose = require('mongoose');
const crypto = require('crypto')
// const { createHmac } = await import('node:crypto');
const { v4: uuidv4 } = require('uuid');
const { Schema } = mongoose;

const userSchema = Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    userinfo: {
        type: String,
        trim: true
    },
    // TODO come back here
    encry_password: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    purchases: {
        type: Array,
        default: []
    }
}, {timestamps: true})

userSchema.virtual("password")
    .set(function(password) {
        this._password = password
        this.salt = uuidv4()
        this.encry_password = this.securePassword(password)
    })
    .get(function() {
        return this._password
    })

userSchema.methods = {
    securePassword: function(plainPassword) {
        if(!plainPassword) return ""
        try {
            return crypto.createHmac('sha256', this.salt)
                   .update(plainPassword)
                   .digest('hex');            
        } catch (error) {
            return ""
        }
    },
    authenticate: function(plainPassword) {
        return this.securePassword(plainPassword) === this.encry_password 
    }
}

module.exports = mongoose.model("User", userSchema)