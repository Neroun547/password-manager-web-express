function deletePasswordValidation(req, res, next) {
    if(!isNaN(Number(req.params.id))) {
        next();
    } else {
        res.sendStatus(400);
    }
}

module.exports = { deletePasswordValidation };

