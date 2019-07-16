const { Router } = require('express');
const { omit, merge } = require('lodash');

const sessionWrapper = require('./session-wrapper');

module.exports = class Page {

  constructor(route, settings) {
    this.route = route;
    this.settings = settings;
    this.tree = settings.tree;
    this.components = (this.settings.components || []).map(c => this.validateComponent(c));

    this.router = Router();
    this.router.get('/', this.get());
    this.router.post('/', this.post());
    this.router.use(this.error());
  }

  validateComponent(component) {
    const settings = omit(component, 'type');
    if (!settings.name) {
      throw new Error('`name` is a required property');
    }
    return {
      settings,
      constructor: component.type
    };
  }

  get() {
    const router = Router();
    router.use(this.buildComponents());
    router.use((req, res, next) => {
      Promise.resolve()
        .then(() => {
          return Promise.all(req.form.components.map(c => c.render()));
        })
        .then(html => {
          res.locals.html = `<form method="post" action="">
            ${html.join('\n')}
            <input type="submit" value="Submit"/>
          </form>`;
          next();
        })
        .catch(next);
    });
    return router;
  }

  post() {
    const router = Router();
    router.use(this.buildComponents());
    router.use((req, res, next) => {
      Promise.resolve()
        .then(() => {
          return Promise.all(req.form.components.map(c => c.process(req.body)));
        })
        .then(() => {
          const next = this.tree.resolve(req.session).pop();
          res.redirect(next);
        })
        .catch(next);
    })
    return router;
  }

  error() {
    return (err, req, res, next) => {
      res.locals.html = `<pre>${err.stack}</pre>`;
      next();
    };
  }

  buildComponents() {
    return (req, res, next) => {
      req.form = req.form || {};
      req.form.components = this.components.map(c => {
        const settings = c.settings;
        settings.session = this.sessionWrapper(req.session, settings);
        const component = new c.constructor(settings);
        return component;
      });
      next();
    }
  }

  sessionWrapper(session, settings) {
    const name = settings.name;
    const key = `${settings.name}${this.route}`;
    return sessionWrapper(session, name, key);
  }

}
