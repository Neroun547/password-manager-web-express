function updatePasswordValidation(req, res, next) {
    if(!req.body.password || req.body.password.length < 6 || req.body.password.length > 30) {
        res.status(400);
        res.send({ message: "Пароль користувача має містити від 6 до 30 символів" });

        return;
    }
    next();
}

module.exports = { updatePasswordValidation };
