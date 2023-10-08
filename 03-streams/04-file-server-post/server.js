const http = require('http');
const path = require('path');
const fs = require('node:fs');
const LSStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);
  let writableStrem;
  let limitStream;

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end();
    return;
  }

  const removeFile = (file) => {
    fs.rmSync(file, {force: true});
  };

  switch (req.method) {
    case 'POST':
      fs.stat(filepath, (err) => {
        if (!err) {
          res.statusCode = 409;
          res.end();
        } else {
          writableStrem = fs.createWriteStream(filepath);
          limitStream = new LSStream(({limit: 1024 * 1024}));

          req.on('data', (chunk) => {
            limitStream.write(chunk);
          });

          limitStream.on('data', (chunk) => {
            writableStrem.write(chunk);
          });

          req.on('end', () => {
            limitStream.end();
          });

          limitStream.on('end', () => {
            writableStrem.end();
            res.statusCode = 201;
            res.end();
          });

          limitStream.on('error', () => {
            removeFile(filepath);
            writableStrem && writableStrem.destroy();
            res.statusCode = 413;
            res.end();
          });
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }

  req.on('aborted', () => {
    writableStrem && writableStrem.destroy();
    limitStream && limitStream.destroy();
    removeFile(filepath);
  });
});

module.exports = server;
