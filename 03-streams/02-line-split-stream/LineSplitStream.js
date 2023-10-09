const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  endOfPreviousChunk = '';
  constructor(options) {
    super(options);
  }

  _transform(chunk, encoding, callback) {
    const chunkAsString = `${this.endOfPreviousChunk}${chunk.toString()}`;
    const splitChunk = chunkAsString.split(os.EOL);
    this.endOfPreviousChunk = splitChunk.slice(-1)[0];

    for (const letter of splitChunk.slice(0, -1)) {
      this.push(letter);
    }
    callback();
  }

  _flush(callback) {
    if (this.endOfPreviousChunk) {
      this.push(this.endOfPreviousChunk);
    }
    callback();
  }
}

module.exports = LineSplitStream;
