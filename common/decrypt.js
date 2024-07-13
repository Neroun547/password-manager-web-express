const { createDecipheriv } = require("crypto");

function decrypt(encryptedData, iv, key) {
    let encryptedText = Buffer.from(encryptedData, 'hex');
    let decipher = createDecipheriv('aes-256-cbc', Buffer.from(key, "hex"), Buffer.from(iv, "hex"));
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

module.exports = { decrypt };
