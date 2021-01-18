module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()){
            return next()
        }
        req.flash('error_msg', 'Morate se ponovo prijaviti.')
        res.redirect('/users/login')     
    }
}