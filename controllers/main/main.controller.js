const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("main", {
        styles: ["/css/main/main.css"],
        auth: req.auth
    });
});

module.exports = router;

