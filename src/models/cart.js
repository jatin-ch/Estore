const mongoose = require('mongoose')
const validator = require('validator')

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
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
        price: {
            type: Number,
            require: true,
            validate(value) {
                if (value < 0) {
                    throw new Error('price must be a positive number')
                }
            }
        }
    }]
}, {
    timestamps: true
})

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart