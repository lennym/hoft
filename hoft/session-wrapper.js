const { clone, merge } = require('lodash');

module.exports = (session, name, key) => {
  return {
    values: () => {
      // get all values
      session._values = session._values || {};
      return clone(session._values);
    },
    value: (val) => {
      // get/set component's value
      session._values = session._values || {};
      if (typeof val !== 'undefined') {
        session._values[name] = val;
      }
      return clone(session._values[name]);
    },
    state: (s) => {
      // get/set component state
      session._states = session._states || {};
      if (typeof s !== 'undefined') {
        session._states[key] = merge(session._states[key], s);
      }
      return clone(session._states[key] || {});
    },
    dirty: (k) => {
      // set a component to be dirty
      session._clean = session._clean || {};
      k = k || key;
      session._clean[k] = false;
    },
    clean: () => {
      // set *this* component to be clean
      session._clean = session._clean || {};
      session._clean[key] = true;
    }
  };
};
