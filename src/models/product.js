const mongoose = require('mongoose')
const validator = require('validator')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        require: true,
        validate(value) {
            if (value < 0) {
                throw new Error('price must be a positive number')
            }
        }
    },
    quantity: {
        type: Number,
        required: true,
        validate(value) {
            if (value < 0) {
                throw new Error('quantity must be a positive number')
            }
        }
    },
    description: {
        type: String,
        trim: true,
        minlength: 10,
    },
    images: [{
        image: {
            type: Buffer
        }
    }]
}, {
    timestamps: true
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product