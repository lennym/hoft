const { h } = require('preact');
const Component = require('../component');

class Input extends Component {

  template(props) {
    return <div>
      { props.state.errors && props.state.errors[props.name] && <p>{ props.state.errors[props.name] }</p> }
      <label>{ props.name }</label>
      <input type="text" name={ props.name } value={ props.value } />
    </div>
  }

}

module.exports = Input;
