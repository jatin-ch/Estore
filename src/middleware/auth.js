module.exports = {
    loginRequired(req, res, next) {
        if (!req.user) {
            req.flash('error', 'Please Login First')
            return res.redirect('/auth/login')
        }
        next()
    }
}