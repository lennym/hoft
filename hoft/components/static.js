const Component = require('../component');

class StaticComponent extends Component {

  static isStatic() {
    return true;
  }

}

module.exports = StaticComponent;
