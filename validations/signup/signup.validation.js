function signupValidation(req, res, next) {
    if(!req.body.username || req.body.username.length > 30 || req.body.username.length < 3) {
        res.status(400);
        res.send({ message: "Ім'я користувача має містити від 3 до 30 символів" });

        return;
    }
    if(!req.body.password || req.body.password.length < 6 || req.body.password.length > 30) {
        res.status(400);
        res.send({ message: "Пароль користувача має містити від 6 до 30 символів" });

        return;
    }
    next();
}

module.exports = { signupValidation };
