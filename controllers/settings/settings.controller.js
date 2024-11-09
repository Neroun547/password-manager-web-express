const express = require("express");
const router = express.Router();

const connection = require("../../db/connect.js");
const {createHmac} = require("crypto");

router.get("/", (req, res) => {
    res.render("settings/settings", {
        auth: req.auth,
        styles: ["/css/settings/settings.css", "/css/components/response-message.component.css"],
        scripts: ["/js/settings/settings.js"],
        username: req.user.username
    });
});

router.patch("/username", async (req, res) => {
    const [usersWithTheSameUsername] = await connection.query("SELECT * FROM users WHERE username = ?", [req.body.username])

    if(usersWithTheSameUsername && usersWithTheSameUsername.length > 0) {
        res.status(400).send({ message: "Користувач з таким ім'ям вже існує" });
    } else {
        await connection.query("UPDATE users SET username = ? WHERE id = ?", [req.body.username, req.user.id]);

        res.send({ message: "Ім'я користувача оновлено успішно" });
    }
});

router.patch("/password", async (req, res) => {
    const passwordHash = createHmac("sha512", process.env.HASH_KEY);
    passwordHash.update(req.body.password);

    await connection.query("UPDATE users SET password = ? WHERE id = ?", [passwordHash.digest("hex"), req.user.id]);

    res.send({ message: "Пароль користувача оновлено успішно" });
});

module.exports = router;

