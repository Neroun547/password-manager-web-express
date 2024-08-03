const express = require("express");
const router = express.Router();

const connection = require("../../db/connect");

const {encrypt} = require("../../common/encrypt");
const {parsePasswordsData} = require("./parse-passwords-data");

router.get("/", async (req, res) => {
    const [rows] = await connection.query("SELECT * FROM passwords WHERE user_id = ? ORDER BY id DESC LIMIT 10", [req.user.id]);
    const passwordsCountQueryResult = await connection.query("SELECT COUNT(*) FROM passwords WHERE user_id=?", [req.user.id]);

    res.render("passwords/passwords", {
        auth: req.auth,
        styles: ["/css/passwords/passwords.css", "/css/components/form.component.css", "/css/components/response-message.component.css"],
        scripts: ["/js/passwords/passwords.js"],
        passwords: parsePasswordsData(rows),
        loadMore: passwordsCountQueryResult[0][0]['COUNT(*)'] > 10
    });
});

router.get("/load-more", async (req, res) => {
    const [rows] = await connection.query("SELECT * FROM passwords WHERE user_id = ? ORDER BY id DESC LIMIT ? OFFSET ?", [req.user.id, req.query["take"], req.query["skip"]]);
    const passwordsCountQueryResult = await connection.query("SELECT COUNT(*) FROM passwords WHERE user_id=?", [req.user.id]);

    res.send({ data: parsePasswordsData(rows), loadMore: (passwordsCountQueryResult[0][0]['COUNT(*)'] - (req.query["skip"] + req.query["take"])) > 0 });
});

router.post("/", async (req, res) => {
    const hash = encrypt(req.body.password, process.env.SECRET_IV_FOR_PASSWORDS, process.env.SECRET_KEY_FOR_PASSWORDS);

    const data = await connection.query("INSERT INTO passwords (user_id, description, password) VALUES (?, ?, ?)", [req.user.id, req.body.description, hash]);

    res.send({ message: "Пароль створено", id: data[0].insertId });
});

router.delete("/:id", async (req, res) => {
    await connection.query("DELETE FROM passwords WHERE id = ? AND user_id = ?", [Number(req.params.id), req.user.id]);

    res.sendStatus(200);
});

router.patch("/:id", async (req, res) => {
    await connection.query("UPDATE passwords WHERE id = ? SET description = ? AND password = ?", [Number(req.params.id), req.body.description, req.body.password]);
});

module.exports = router;

