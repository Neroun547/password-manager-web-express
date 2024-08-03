const jwt = require("jsonwebtoken");
const {getAuthTokenFromRequest} = require("../common/get-auth-token-from-request");

function authGuard(req, res, next) {
    const authToken = getAuthTokenFromRequest(req);

    if(!authToken) {
        req.auth = false;
    } else {
        try {
            req.user = jwt.verify(authToken, process.env.JWT_SECRET);
            req.auth = true;
        } catch(e) {
            console.log(e);
            req.auth = false;
        }
    }
    next();
}

module.exports = { authGuard };
