const mongoose = require('mongoose')
const validator = require('validator')

const productSchema = new mongoose.Schema({
    category: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
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
    specifications: {
        type: Map,
        of: [{
            type: String,
            trim: true
        }]
    },
    images: [{
        image: {
            type: Buffer
        }
    }]
}, {
    timestamps: true
})

productSchema.pre('save', async function(next) {
    const product = this
    if(product.isModified('category')) {
        product.category = product.category.replace(/ /g, '-')
    }
    next()
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product