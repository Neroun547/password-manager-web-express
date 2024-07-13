const jwt = require("jsonwebtoken");
const {getAuthTokenFromRequest} = require("../common/get-auth-token-from-request");

function authGuard(req, res, next) {
    const authToken = getAuthTokenFromRequest(req);

    if(!authToken) {
        req.auth = false;
    } else {
        req.user = jwt.verify(authToken, process.env.JWT_SECRET);
        req.auth = true;
    }
    next();
}

module.exports = { authGuard };
