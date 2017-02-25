/*
 *
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableHighlight
} from 'react-native'

var t = require('tcomb-form-native');

var Store = require('../store/Store.js');

var Form = t.form.Form;
var Person = t.struct({
  Title: t.String,   // a required string
  Description: t.String,
});
var options = {};

class RegisterRoute extends Component {

  constructor(props) {

    super(props);
    this.state = {}
  };

  componentDidMount() {

    // give focus to textbox
    this.refs.form.getComponent('Title').refs.input.focus();
  };


  onPress() {

    var value = this.refs.form.getValue();
    // if validation fails, value will be null
    if (value) {
      console.log("o-o-o-oo-o-o-o-o=-BEFORE UPLOAD-=-0-0-0-0-0-0-0-0-0-0-", this.props.routeCoordinates);
      Store.uploadRoute(value, this.props.routeCoordinates, this.props.distanceTravelled).then((success) => {

      }, (reason) => {

        console.log("onPress() uploadRoute:", reason);
      });
    }
  };


  render() {

    return (
      <View style={styles.container}>

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
