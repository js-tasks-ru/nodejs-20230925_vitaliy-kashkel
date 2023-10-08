const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  total = 0;

  constructor(options) {
    super(options);
    const {limit} = options;
    this.limit = limit;
  }

  _transform(chunk, encoding, callback) {
    if ((this.total + chunk.length) > this.limit) {
      callback(new LimitExceededError(), null);
    } else {
      this.total += chunk.length;
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
