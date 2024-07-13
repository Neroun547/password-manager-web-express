function createPasswordValidation(req, res, next) {
    if(!req.body.description || req.body.description.length < 3 || req.body.description.length > 255) {
        res.status(400);
        res.send({ message: "Опис паролю повинен включати в себе від 3 до 255 символів" });

        return;
    }
    if(!req.body.password) {
        res.status(400);
        res.send({ message: "Пароль обов'язковий" });

        return;
    }
    next();
}

module.exports = { createPasswordValidation };
