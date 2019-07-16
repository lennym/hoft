const app = require('./');

app.use(require('morgan')('dev'));

app
  .start()
  .then(settings => console.log(`app running on port ${settings.port}`));
