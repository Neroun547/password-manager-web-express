function getAuthTokenFromRequest(req) {
    if(req.headers.cookie) {
        const headersCookieToArr = req.headers.cookie.split("=");
        const authTokenKeyIndex = headersCookieToArr.findIndex(el => el === "auth_token");

        if(authTokenKeyIndex === -1) {
            return "";
        } else {
            return headersCookieToArr[authTokenKeyIndex + 1];
        }
    } else {
        return "";
    }
}

module.exports = { getAuthTokenFromRequest };
