const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const Product = require('../models/product')
const User = require('../models/user')
const auth = require('../middleware/auth')
const Cart = require('../models/cart')
const router = express.Router()

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('Please upload an image'))
        }

        callback(undefined, true)
    }
})

router.get('/products/new', (req, res) => {
    res.render('product/new')
})

// https://stackoverflow.com/questions/57538533/uploading-multiple-files-via-multer
router.post('/products', upload.single('image'), async (req, res) => {
    const product = new Product(req.body)
    const buffer = await sharp(req.file.buffer).png().toBuffer()
    product.images = product.images.concat({ image: buffer })
    await product.save()
    res.redirect('/')
}, (err, req, res, next) => {
    res.status(400).send({ error: err.message })
})

router.get('/', async (req, res) => {
    const products = await Product.find()
    let items = []

    if (req.user) {
        const cart = await Cart.findOne({ user: req.user._id })
        if (cart) {
            const data = await cart.populate('items').execPopulate()
            items = data.items.map((item) => item.product)
        }
    }

    res.render('product', { products, items })
})

router.get('/jatin', (req, res) => {
    options = { prefill: {}, address: {}, notes: {}, theme: {} }
    res.render('order/payment', { options, orderId: 12, amount: 10999 })
})

module.exports = router