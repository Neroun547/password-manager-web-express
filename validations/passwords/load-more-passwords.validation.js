function loadMorePasswordsValidation(req, res, next) {

    if(!req.query["take"] || !req.query["skip"] || isNaN(Number(req.query["take"])) || isNaN(Number(req.query["skip"]))) {
        res.status(400);
        res.send({ message: "Хибні параметри" });

        return;
    }
    req.query["take"] = Number(req.query["take"]);
    req.query["skip"] = Number(req.query["skip"]);

    if(req.query["take"] > 10) {
        res.status(400);
        res.send({ message: "Хибні параметри" });

        return;
    }
    next();
}

module.exports = { loadMorePasswordsValidation };
