const express = require('express')
const Cart = require('../models/cart')
const Product = require('../models/product')
const User = require('../models/user')
const auth = require('../middleware/auth')
const Item = require('../models/item')
const router = express.Router()

router.post('/items/:id', auth.loginRequired, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })        
        if(!cart) {
            return res.status(400).send()
        }

        const item = await Item.findOne({ _id: req.params.id, cart: cart._id   })
        if(!item) {
            return res.status(400).send()
        }

        item.qty = req.body.qty
        item.save()
        res.redirect('/cart')
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/items/:id/delete', auth.loginRequired, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })        
        if(!cart) {
            return res.status(400).send()
        }

        const item = await Item.findOneAndDelete({ _id: req.params.id, cart: cart._id   })
        if(!item) {
            return res.status(400).send()
        }

        cart.items = cart.items.filter((e) => e._id !== item._id)
        cart.save()
        res.redirect('/cart')
    } catch(e) {
        res.status(400).send(e)
    }
})

module.exports = router