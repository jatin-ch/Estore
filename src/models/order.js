const mongoose = require('mongoose')
const validator = require('validator')

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Item'
    }],
    amount: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('amount must be non negative')
            }
        }
    },
    razorpayOrderId: {
        type: String
    }
}, {
    timestamps: true
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order