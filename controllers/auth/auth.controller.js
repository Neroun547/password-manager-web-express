const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const connect = require("../../db/connect");
const {createHmac} = require("crypto");

router.get("/", (req, res) => {
   res.render("auth/auth", {
      styles: ["/css/components/form.component.css", "/css/components/response-message.component.css"],
      scripts: ["/js/auth/auth.js"]
   });
});

router.get("/exit", (req, res) => {
   res.cookie("auth_token", "");
   res.redirect("/auth");
});

router.post("/", async (req, res) => {
   const [rows] = await connect.query("SELECT * FROM users WHERE username = ?", [req.body.username]);

   if(!rows || rows.length === 0) {
      res.status(404);
      res.send({ message: "Користувача не знайдено" });
   } else {
      const passwordHash = createHmac("sha512", process.env.HASH_KEY);
      passwordHash.update(req.body.password);

      if(passwordHash.digest("hex") === rows[0].password) {
         const token = jwt.sign({ username: rows[0].username, id: rows[0].id }, process.env.JWT_SECRET, { expiresIn: "6h" });

         res.cookie("auth_token", token);
         res.status(200);
         res.send({ message: "Авторизація успішна" });
      } else {
         res.status(400);
         res.send({ message: "Невірний пароль" });
      }
   }
});

module.exports = router;
