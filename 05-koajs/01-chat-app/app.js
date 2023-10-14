const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

function eventBus() {
  const events = {};

  const subscribe = (eventName, cb) => {
    if (eventName && cb) {
      if (!events[eventName]) {
        events[eventName] = [];
      }
      events[eventName].push(cb);
    }
  };

  const addEvent = (eventName, data) => {
    if (data && events[eventName] && events[eventName].length) {
      events[eventName].forEach((listener) => listener(data));
    }
  };

  return {
    addEvent,
    subscribe,
  };
}

const events = eventBus();

router.get('/subscribe', async (ctx, next) => {
  return new Promise((resolve) => {
    events.subscribe('message', (msg) => {
      resolve(msg);
    });
  }).then((message) => {
    ctx.status = 200;
    ctx.body = message;
  });
});

router.post('/publish', async (ctx, next) => {
  const {message} = ctx.request.body;
  events.addEvent('message', message);
  ctx.status = 201;
  ctx.body = 'ok';
});

app.use(router.routes());

module.exports = app;
