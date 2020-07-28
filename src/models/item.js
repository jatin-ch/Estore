const mongoose = require('mongoose')
const validator = require('validator')

const itemSchema = new mongoose.Schema({
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    qty: {
        type: Number,
        required: true,
        validate(value) {
            if (value <= 0) {
                throw new Error('quantity must be greter then zero')
            }
        }
    },
    amount: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('amount must be non negative')
            }
        }
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }
}, {
    timestamps: true
})

const Item = mongoose.model('Item', itemSchema)

module.exports = Item