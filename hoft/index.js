require('babel-core/register')({
  presets: ['preact'],
  extensions: ['.js'],
  plugins: [
    ['transform-react-jsx', { 'pragma':'h' }]
  ]
});

const express = require('express');
const bodyparser = require('body-parser');

const Session = require('./server/session');

const Component = require('./component');
const Tree = require('./tree');
const Page = require('./page');

const Hoft = config => {
  const app = express();

  app.use(config.theme);
  app.use(Session(config.session));

  app.use(bodyparser.urlencoded({ extended: true }));

  // mounting point for user middleware
  const middleware = express.Router();
  app.use(middleware);

  const tree = new Tree(config.flow);
  app.use(tree.router());
  app.use((req, res, next) => {
    if (res.locals.html) {
      return config.theme.render(res.locals.html)
        .then(html => {
          res.type('html');
          res.send(html);
        })
        .catch(next);
    }
    next();
  });

  app.use((req, res, next) => {
    throw new Error('Not found');
  });

  return {
    app,
    use: m => middleware.use(m),
    start: () => {
      return new Promise((resolve, reject) => {
        app.listen(config.port, err => err ? reject(err) : resolve(config));
      });
    }
  }
}

Hoft.Component = Component;

Hoft.components = {
  Input: require('./components/input')
};

module.exports = Hoft;
