'use strict';

var React = require('react');
var ReactNative = require('react-native');
var t = require('tcomb-form-native');

var Store = require('../store/Store.js');

var {
   AppRegistry,
   StyleSheet,
   View,
   Text,
   TouchableHighlight
} = ReactNative;

var {
   Component
} = React;


var Form = t.form.Form;

// here we are: define your domain model
var Person = t.struct({
  Title: t.String,              // a required string
  Description: t.String,
});

var options = {}; // optional rendering options (see documentation)

//var AwesomeProject = React.createClass({
class RegisterRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    // give focus to the name textbox
    this.refs.form.getComponent('Title').refs.input.focus();
  }


  onPress() {

    var value = this.refs.form.getValue();
    if (value) { // if validation fails, value will be null

      Store.uploadRoute(value, this.props.routeCoordinates, this.props.distanceTravelled).then((success) => {

      console.log("SUCCEEEEEEEEEEEEEES!!");
      }, (reason) => {

        console.log("FAAAAAAIIIILLLLLLL!!", reason);
      });
    }
  }


  render() {
    return (
      <View style={styles.container}>
        {/* display */}
        <Form
          ref="form"
          type={Person}
          options={options}
        />
        <TouchableHighlight style={styles.button} onPress={this.onPress.bind(this)} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableHighlight>
      </View>
    );
  }
};

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});

module.exports = RegisterRoute;
