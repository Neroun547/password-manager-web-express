const express = require("express");
const router = express.Router();
const { createHmac } = require("crypto");

const connect = require("../../db/connect");

router.get("/", (req, res) => {
    res.render("signup/signup", {
        styles: ["/css/components/form.component.css", "/css/components/response-message.component.css"],
        scripts: ["/js/signup/signup.js"]
    });
});

router.post("/", async (req, res) => {
    const [rows] = await connect.query("SELECT * FROM users WHERE username = ?", [req.body.username]);

    if(!rows || rows.length > 0) {
        res.status(400);
        res.send({ message: "Користувач з таким ім'ям вже існує" });
    } else {
        const passwordHash = createHmac("sha512", process.env.HASH_KEY);
        passwordHash.update(req.body.password);

        await connect.query("INSERT INTO users (username, password) VALUES (?, ?)", [req.body.username, passwordHash.digest("hex")]);

        res.status(200);
        res.send({ message: "Реєстрація успішна" });
    }
});

module.exports = router;
