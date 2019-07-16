const session = require('express-session');
const RedisStore = require('connect-redis')(session);

module.exports = config => {

  let store;

  // if session config looks like a middleware just use that
  if (typeof config === 'function') {
    return config;
  }

  if (config.store) {
    store = config.store;
  } else {
    store = new RedisStore(config.redis);
  }

  return session({
    saveUninitialized: false,
    resave: true,
    secret: config.secret,
    store
  });

}
