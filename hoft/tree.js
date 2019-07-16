const { Router } = require('express');
const { clone } = require('lodash');

const Page = require('./page');

class Tree {

  constructor(flow) {
    if (!Object.keys(flow).length) {
      throw new Error('at least one step must be defined');
    }
    this.flow = this.normalise(flow);
    this.entry = flow['/'] ? '/' : Object.keys(flow)[0];
  }

  normalise(flow) {
    flow = clone(flow);
    Object.keys(flow).forEach(key => {
      if (key[0] !== '/') {
        throw new Error(`path '${key}' must start with '/'`);
      }
    });
    Object.values(flow).forEach(step => {
      step.components = step.components || [];
    });
    return flow;
  }

  router() {
    const router = Router();

    if (this.entry !== '/') {
      router.get('/', (req, res) => res.redirect(req.baseUrl + this.entry));
    }

    router.use((req, res, next) => {
      if (this.canAccess(req.url, req.session)) {
        next();
      } else {
        next(new Error('Unauthorised'));
      }
    });

    Object.keys(this.flow).forEach(route => {
      const settings = Object.assign({}, this.flow[route], { tree: this });
      const page = new Page(route, settings);
      router.use(route, page.router);
    });

    return router;
  }

  canAccess(path, session) {
    return this.resolve(session).includes(path);
  }

  resolve(session) {
    let path = this.entry;
    const routes = [path];
    while (this.isComplete(path, session) && this.getNext(path, session)) {
      path = this.getNext(path, session);
      routes.push(path);
    }
    return routes;
  }

  isComplete(path, session) {
    session._clean = session._clean || {};
    return this.flow[path].components.reduce((complete, component) => {
      return complete && (component.type.isStatic() || session._clean[`${component.name}${path}`])
    }, true);
  }

  getNext(path, session) {
    session._values = session._values || {};
    if (typeof this.flow[path].next === 'string') {
      return this.flow[path].next;
    } else if (typeof this.flow[path].next === 'function') {
      return this.flow[path].next(clone(session._values));
    }
  }

}

module.exports = Tree;
