const uuid = require('uuid').v4;

class Uuid {
  generate() {
    const generated = uuid();

    return generated;
  }
}

module.exports = new Uuid();