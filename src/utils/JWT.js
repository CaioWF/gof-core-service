const jwt = require('jsonwebtoken');

class JWT {
  constructor(secret) {
    this.secret = secret;
  }

  encrypt(value) {
    const accessToken = jwt.sign({ username: value }, this.secret);

    return accessToken;
  }
}

module.exports = new JWT('gof-online-key');