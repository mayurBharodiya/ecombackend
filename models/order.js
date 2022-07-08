const mongoose = require('mongoose');
const { Schema, ObjectId } = mongoose;
// const {ObjectId} = Schema

const productCartSchema = Schema({
    product: {
        type: ObjectId,
        ref: 'Product'
    },
    name: String,
    count: Number,
    price: Number
})
const ProductCart = mongoose.model("ProductCart", productCartSchema)

const orderSchema = Schema({
    products: [productCartSchema],
    transaction_id: {},
    amount: Number,
    addres: String,
    updated: Date,
    user: {
        type: ObjectId,
        ref: 'User'
    } 
}, {timestamps: true})
const Order = mongoose.model("Order", orderSchema)

module.exports = {Order, ProductCart}