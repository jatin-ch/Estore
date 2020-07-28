const express = require('express')
const Cart = require('../models/cart')
const Product = require('../models/product')
const User = require('../models/user')
const auth = require('../middleware/auth')
const Item = require('../models/item')
const router = express.Router()

router.post('/cart', auth.loginRequired, async (req, res) => {
    const product = await Product.findById(req.body.item)
    let cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
        cart = new Cart({ user: req.user._id })
    }
    
    const item = new Item({
        cart: cart._id,
        product: product._id,
        qty: req.body.qty,
        amount: product.price*req.body.qty
    })

    try {
       await item.save()
       cart.items.push(item._id)
       await cart.save()
       res.redirect('/')
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/cart', auth.loginRequired, async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id })
    const items = await Item.find({ cart:  cart._id}).populate('product')
    res.render('cart', { items })
})

module.exports = router