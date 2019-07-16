const { h, Component } = require('preact');
const render = require('preact-render-to-string');

const ValidationError = require('./validation-error');

class ServerComponent {

  static isStatic() {
    return false;
  }

  constructor(opts) {
    this.settings = opts;
    this.name = this.settings.name;
    this.session = this.settings.session;
  }

  async process(body) {
    return Promise.resolve()
      .then(() => {
        this.session.dirty();
        this.session.state({
          errors: null
        });
      })
      .then(() => {
        const value = body[this.name];
        this.session.value(value);
      })
      .then(() => {
        return this.validate();
      })
      .then(() => {
        return this.success();
      })
      .catch(err => {
        if (err instanceof ValidationError) {
          this.session.state({
            errors: {
              [err.field]: err.type
            }
          });
        } else {
          throw err;
        }
      });
  }

  async validate() {
    const value = await this.getValue();
    if (!value) {
      return Promise.reject(new ValidationError(`Validation for field ${this.name} failed`, this.name, 'required'));
    }
    return Promise.resolve();
  }

  async success() {
    this.session.clean();
    return Promise.resolve();
  }

  async getValue() {
    return Promise.resolve(this.session.value());
  }

  async getState() {
    return Promise.resolve(this.session.state());
  }

  async render() {
    const Component = this.template;
    const value = await this.getValue();
    const state = await this.getState();
    const props = {
      name: this.settings.name,
      value,
      state
    };
    return render(<Component {...props} />);
  }

  template() {
    return;
  }

}

module.exports = ServerComponent;
