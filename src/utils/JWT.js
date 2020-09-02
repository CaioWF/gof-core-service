const jwt = require('jsonwebtoken');

class JWT {
  constructor(secret) {
    this.secret = secret;
  }

  encrypt(payload) {
    const accessToken = jwt.sign(payload, this.secret);
    
    return accessToken;
  }

  decrypt(token) {
    const decoded = jwt.verify(token, this.secret);
    
    return decoded;
  }
}

module.exports = new JWT('gof-online-key');