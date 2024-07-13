const express = require("express");
const router = express.Router();

const connection = require("../../db/connect");

const {encrypt} = require("../../common/encrypt");
const { decrypt } = require("../../common/decrypt");

router.get("/", async (req, res) => {
    const [rows] = await connection.query("SELECT * FROM passwords WHERE user_id = ?", [req.user.id]);
    const parseData = [];

    if(rows && rows.length > 0) {
        for(let i = 0; i < rows.length; i++) {
            parseData.push({
                description: rows[i].description,
                password: decrypt(rows[i].password, process.env.SECRET_IV_FOR_PASSWORDS, process.env.SECRET_KEY_FOR_PASSWORDS),
                id: rows[i].id
            });
        }
    }
    res.render("passwords/passwords", {
        auth: req.auth,
        styles: ["/css/passwords/passwords.css", "/css/components/form.component.css", "/css/components/response-message.component.css"],
        scripts: ["/js/passwords/passwords.js"],
        passwords: parseData
    });
});

router.post("/", async (req, res) => {
    const hash = encrypt(req.body.password, process.env.SECRET_IV_FOR_PASSWORDS, process.env.SECRET_KEY_FOR_PASSWORDS);

    const data = await connection.query("INSERT INTO passwords (user_id, description, password) VALUES (?, ?, ?)", [req.user.id, req.body.description, hash]);

    res.send({ message: "Пароль створено", id: data[0].insertId });
});

router.delete("/:id", async (req, res) => {
    await connection.query("DELETE FROM passwords WHERE id = ?", [Number(req.params.id)]);

    res.sendStatus(200);
});

module.exports = router;

