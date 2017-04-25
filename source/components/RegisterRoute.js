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
  ScrollView,
  AsyncStorage

} from 'react-native'

var t = require('tcomb-form-native');

var Store = require('../store/Store.js');

var Form = t.form.Form;
var Person = t.struct({
  Title: t.String,   // a required string
  Description: t.String,
  Address: t.String,
  DistanceKm: t.Number,
  Duration: t.String,
  AverageSpeedKmh: t.Number,
});

var PickerItemIOS = PickerIOS.Item;

var ROUTE_DIFFICULTY = {
  Family: {
    name: 'Family',
  },
  Easy: {
    name: 'Easy',
  },
  Moderate: {
    name: 'Moderate',
  },
  Hard: {
    name: 'Hard',
  },
  Extreme: {
    name: 'Extreme',
  },
};

var options = {
  fields: {
    Address: {
      editable: false
    },
    DistanceKm: {
      editable: false
    },
    Duration: {
      editable: false
    },
    AverageSpeedKmh: {
      editable: false
    },
  }
};


class RegisterRoute extends Component {

  constructor(props) {

    super(props);
    this.state = {
      selectedDifficulty: 'Moderate',
      value: {
        Title: '',
        Description: '',
        Address: props.address,
        DistanceKm: props.distanceTravelled,
        Duration: props.duration,
        AverageSpeedKmh: props.avgSpeed,
      },
      options: options
    }
    this.onChange = this.onChange.bind(this);
  };


  componentDidMount() {
    // give focus to textbox
    this.refs.form.getComponent('Title').refs.input.focus();
  };

  onChange(value) {

    this.setState({value: value});
  };



  onPress() {

    var value = this.refs.form.getValue();
    // if validation fails, value will be null
    if (value) {
      AsyncStorage.getItem('email', (err, result) => {
        var email = result;
        AsyncStorage.getItem('username', (err, result) => {

          var username = result;
          Store.uploadRoute(email, username, value, this.props.routeCoordinates, this.state.selectedDifficulty).then((success) => {

          }, (reason) => {

            console.log("onPress() uploadRoute:", reason);
          });
        });
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
          <Text>Please choose a make for your car:</Text>
          <PickerIOS
            selectedValue={this.state.selectedDifficulty}
            onValueChange={(difficulty) => this.setState({selectedDifficulty: difficulty, modelIndex: 0})}>
            {Object.keys(ROUTE_DIFFICULTY).map((difficulty) => (
              <PickerItemIOS
                key={difficulty}
                value={difficulty}
                label={ROUTE_DIFFICULTY[difficulty].name}
              />
            ))}
          </PickerIOS>

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

module.exports = RegisterRoute;
