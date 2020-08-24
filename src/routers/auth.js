const express = require('express')
const passport = require('passport')
const router = express.Router()

const User = require('../models/user')

// https://github.com/kharbanda14/youtube-tutorials/blob/master/node.js/authentication/passport-local-example
router.get('/login', (req, res) => {
    res.render('auth/login', { messages: req.flash('info') })
})

router.get('/signup', (req, res) => {
    res.render('auth/signup')
})

router.post('/signup', async (req, res, next) => {
    const existingUser = await User.findOne({ email: req.body.email })
    if (existingUser) {
        return res.redirect('/auth/login')
    }

    try {
        const user = new User(req.body)
        await user.save()

        req.logIn(user, () => {
            res.redirect('/')
        })
    } catch(e) {
        next(e)
    }
})

router.post('/login', passport.authenticate('local-login', { 
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}))

router.get('/logout', (req, res, next) => {
    req.logout()
    res.redirect('/auth/login')
})

module.exports = router