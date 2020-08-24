const express = require('express')
const Cart = require('../models/cart')
const Product = require('../models/product')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = express.Router()

router.post('/cart', auth.loginRequired, async (req, res) => {
    const product = await Product.findById(req.body.pid)
    let cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
        cart = new Cart({ user: req.user._id })
    }

    const item = {
        product: product._id,
        qty: 1,
        price: product.price
    }

    try {
       cart.items.push(item)
       await cart.save()
       res.redirect('/cart')
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/cart', auth.loginRequired, async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id })
    let items = []
    let cartId = undefined
    if (cart) {
        const data = await cart.populate('items.product').execPopulate()
        items = data.items
        cartId = cart.id
    }

    res.render('cart', { items, cartId })
})

router.post('/cart/:id/:action', auth.loginRequired, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
     
        if(!cart) {
            return res.status(400).send()
        }

        const item = cart.items.find(e => e.id === req.params.id)
        
        if(!item) {  
            return res.status(400).send()
        }

        if (req.params.action === 'up'){
            item.qty += 1
        } else if (req.params.action === 'down') {
            item.qty -= 1
        } else if (req.params.action === 'delete') {
            cart.items = cart.items.filter(e => e.id !== req.params.id)
        }

        cart.save()
        res.redirect('/cart')
    } catch(e) {
        res.status(400).send(e)
    }
})

module.exports = router