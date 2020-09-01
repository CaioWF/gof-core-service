const bcrypt = require('bcrypt');

class Encrypter {
  constructor(salt) {
    this.salt = salt;
  }

  async hash(value) {
    const hash = await bcrypt.hash(value, this.salt);

    return hash;
  }

  async compare(value, hash) {
    const isValid = await bcrypt.compare(value, hash);

    return isValid;
  }
}

module.exports = new Encrypter(16);