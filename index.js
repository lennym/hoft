const hoft = require('./hoft');

const settings = {
  port: 8080,
  theme: require('./theme'),
  session: {
    secret: 'abc123'
  },
  flow: {
    '/start': {
      components: [
        {
          type: hoft.components.Input,
          name: 'first-name'
        },
        {
          type: hoft.components.Input,
          name: 'last-name'
        }
      ],
      next: '/next'
    },
    '/next': {
      components: [
        {
          type: hoft.components.Input,
          name: 'age'
        }
      ],
      next: '/end'
    },
    '/end': {

    }
  }
};

module.exports = hoft(settings);
