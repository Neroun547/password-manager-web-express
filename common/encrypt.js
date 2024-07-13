const { createCipheriv } = require("crypto");

function encrypt(text, iv, key) {
    const cipher = createCipheriv('aes-256-cbc', Buffer.from(key, "hex"), Buffer.from(iv, "hex"));
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return encrypted.toString('hex');
}

module.exports = { encrypt };
