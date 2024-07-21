const {decrypt} = require("../../common/decrypt");

function parsePasswordsData(rows) {
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

    return parseData;
}

module.exports = { parsePasswordsData };
