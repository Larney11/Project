/*
 *
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableHighlight,
  PickerIOS,
  ScrollView

} from 'react-native'

var t = require('tcomb-form-native');

var Store = require('../store/Store.js');
var RecordRouteMap = require('./RecordRouteMap.js');

var Form = t.form.Form;
var Person = t.struct({
  Username: t.String,
  email: t.String,
  Name: t.String,
  DateOfBirth: t.String,
  Gender: t.String,
  WeightKg: t.Number,
  HeightCm: t.Number,
});


var options = {};


class RegisterUser extends Component {

  constructor(props) {

    super(props);
    this.state = {
      selectedDifficulty: 'Moderate',
      value: {
        Username: '',
        email: this.props.email,
        Name: '',
        DateOfBirth: '',
        Gender: '',
        WeightKg: '',
        HeightCm: '',
      },
      options: options
    }
    this.onChange = this.onChange.bind(this);
  };


  componentDidMount() {
    // give focus to textbox
    this.refs.form.getComponent('Username').refs.input.focus();
  };

  onChange(value) {

    this.setState({value: value});
  };



  onPress() {

    var value = this.refs.form.getValue();
    // if validation fails, value will be null
    if (value) {
      Store.postUserDetails(value).then((success) => {

      }, (reason) => {

        console.log("onPress() uploadRoute:", reason);
      });
    }
  };


  render() {

    return (
      <View style={styles.container}>
      <ScrollView
        ref={(scrollView) => { _scrollView = scrollView; }}
        automaticallyAdjustContentInsets={false}
        onScroll={() => { console.log('onScroll!'); }}
        scrollEventThrottle={200}
        style={styles.scrollView}>
          <Form
            ref="form"
            type={Person}
            options={this.state.options}
            value={this.state.value}
            onChange={this.onChange}
          />

          <TouchableHighlight style={styles.button} onPress={this.onPress.bind(this)} underlayColor='#99d9f4'>

            <Text style={styles.buttonText}>Save</Text>
          </TouchableHighlight>
        </ScrollView>
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

module.exports = RegisterUser;
