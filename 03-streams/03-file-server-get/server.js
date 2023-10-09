const http = require('http');
const path = require('path');
const fs = require('node:fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  let rr;

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end();
    return;
  }

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      rr = fs.createReadStream(filepath);
      rr.pipe(res);
      rr.on('error', (err) => {
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
        } else {
          res.statusCode = 500;
        }
        res.end();
      });


      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }

  req.on('aborted', () => {
    rr.destroy();
  });
});

module.exports = server;
