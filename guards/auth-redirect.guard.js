function authRedirectGuard(req, res, next) {
    if(!req.auth) {
        res.redirect("/auth");
    } else {
        next();
    }
}

module.exports = { authRedirectGuard };
