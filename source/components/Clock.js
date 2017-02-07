/*
 *
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

import { Stopwatch, Timer } from 'react-native-stopwatch-timer';

class Clock extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  };


  render() {

    if(this.props.displayStopwatch == true) {

      return (
        <View>

          <Stopwatch msecs start={this.props.stopwatchStart}
            reset={this.props.stopwatchReset}
            options={options}/>
        </View>
      );
    }
    else {

      return null;
    };
  };
};


const options = {
  container: {
    //margin: 100,
    backgroundColor: '#FFF',
    padding: 5,
    borderRadius: 5,
    width: 220,
    borderWidth: 2,
    borderColor: '#000',
  },
  text: {
    fontSize: 30,
    color: '#000',
    marginLeft: 7,
  }
};

module.exports = Clock;
