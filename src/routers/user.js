const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = express.Router()

router.get('/profile', auth.loginRequired, (req, res) => {
    res.send('Hey! Welcome user')
})

module.exports = router