const express = require('express')
const Razorpay = require('razorpay')
const Cart = require('../models/cart')
const Product = require('../models/product')
const User = require('../models/user')
const auth = require('../middleware/auth')
const Item = require('../models/item')
const Order = require('../models/order')

const router = express.Router()

var razorPay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

router.post('/order/:id', auth.loginRequired, async (req, res) => {
    try {
        const cart = await Cart.findOne({ _id: req.params.id, user: req.user._id })
        if(!cart) {
            return res.redirect('/')
        }

        if ( 0 > cart.items.length) {
            return res.redirect('/')
        }

        const order = new Order({ user: req.user._id })
        order.items = cart.items
        cart.items = []
        let amount = 0
        const results = await Item.find({ cart: cart._id }).populate('product')
        results.forEach(async (item) => {
            item.cart = undefined
            item.order = order._id
            item.amount = item.qty*item.product.price
            amount += item.amount
            await item.save()
        })
        order.amount = amount
        await order.save()
        await cart.save()
        res.redirect('/payment?orderId='+order._id)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/payment', auth.loginRequired, async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.query.orderId, user: req.user._id })

        if (!order) {
            return res.status(400).send({ error: 'Something went wrong!' })
        }

        if (order.razorpayOrderId) {
            razorPay.orders.fetch(order.razorpayOrderId, async(err, data) => {
                if (err) {
                    return res.status(500).send({
                        error: 'Something went wrong'
                    })
                }

                const options = {
                    key: process.env.RAZORPAY_KEY_ID,
                    amount: data.amount,
                    order_id: data.id,
                    name: "Estore",
                    description: "Purchase Description",
                    image: "https://colorlib.com/preview/theme/estore/assets/img/logo/logo.png",
                    prefill: {
                        name: req.user.name,
                        email: req.user.email
                    },
                    notes: {
                        address: "Street 123, Colony - A"
                    },
                    theme: {
                        color: "#F37254"
                    }
                }
                res.render('order/payment', { options, orderId: req.query.orderId, amount: order.amount })
            })
        } else {
            const newRazorpayOrder = {
                amount: order.amount * 100,
                currency: "INR",
                receipt: `${order._id}`,
                payment_capture: 0,
                notes: { payment: "Estore payment order"}
            }

            razorPay.orders.create(newRazorpayOrder, async (err, data) => {
                if (err) {
                    return res.status(500).send({
                        error: 'Something went wrong'
                    })
                }

                const options = {
                    key: process.env.RAZORPAY_KEY_ID,
                    amount: data.amount,
                    order_id: data.id,
                    name: "Estore",
                    description: "Purchase Description",
                    image: "https://colorlib.com/preview/theme/estore/assets/img/logo/logo.png",
                    prefill: {
                        name: req.user.name,
                        email: req.user.email
                    },
                    notes: {
                        address: "Street 123, Colony - A"
                    },
                    theme: {
                        color: "#F37254"
                    }
                }
                order.razorpayOrderId = data.id
                await order.save()
                res.render('order/payment', { options, orderId: req.query.orderId, amount: order.amount })
            })
        }
    } catch(e) {
        res.status(400).send(e.message)
    }
})

router.post("/payments/:id/capture", auth.loginRequired, async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.body.orderId, user: req.user._id })

        if (!order) {
            res.status(500).send({ error: 'Something went wrong' })
        }

        razorPay.payments.capture(req.params.id, order.amount*100, "INR", async (err, payment) => {
            if (err) {
                return res.status(500).send({
                    error: 'Something went wrong'
                })
            }

            if (payment.captured) {
                console.log('captured')
                res.redirect('/thankyou')
            } else {
                console.log('Failed')
            }
        })
    } catch (e) {
      return res.status(500).send({
        message: "Something Went Wrong"
     })
    }
})

router.get('/thankyou', (req, res) => {
    res.render('order/thankyou')
})

module.exports = router