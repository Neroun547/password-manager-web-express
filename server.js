require('dotenv').config();

const { engine } = require("express-handlebars");
const { resolve } = require("path");

const express = require("express");
const app = express();

/* Controllers */
const mainController = require("./controllers/main/main.controller");
const authController = require("./controllers/auth/auth.controller");
const signupController = require("./controllers/signup/signup.controller");
const passwordsController = require("./controllers/passwords/passwords.controller");

/* Validators */
const {signupValidation} = require("./validations/signup/signup.validation");
const {authGuard} = require("./guards/auth.guard");
const {authRedirectGuard} = require("./guards/auth-redirect.guard");
const {createPasswordValidation} = require("./validations/passwords/create-password.validation");
const { deletePasswordValidation } = require("./validations/passwords/delete-password.validation");
const {loadMorePasswordsValidation} = require("./validations/passwords/load-more-passwords.validation");

app.use(express.static(resolve("static")));
app.use(express.json());

app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(authGuard);
app.use(mainController);

app.post("/auth", signupValidation);
app.use("/auth", authController);

app.post("/signup", signupValidation);
app.use("/signup", signupController);

app.use("/passwords", authRedirectGuard);
app.get("/passwords/load-more", loadMorePasswordsValidation);
app.post("/passwords", createPasswordValidation);
app.delete("/passwords/:id", deletePasswordValidation);
app.use("/passwords", passwordsController);

app.listen(Number(process.env.APP_PORT), () => {
    console.log("Server started on port: " + process.env.APP_PORT);
});
