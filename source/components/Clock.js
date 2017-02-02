import React, { Component } from 'react';
import { AppRegistry, StyleSheet,Text,View, TouchableHighlight } from 'react-native';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timerStart: false,
      stopwatchStart: false,
      totalDuration: 90000,
      timerReset: false,
      stopwatchReset: false,
    };
    this.toggleTimer = this.toggleTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.toggleStopwatch = this.toggleStopwatch.bind(this);
    this.resetStopwatch = this.resetStopwatch.bind(this);
  }

  toggleTimer() {
    this.setState({timerStart: !this.state.timerStart, timerReset: false});
  }

  resetTimer() {
    this.setState({timerStart: false, timerReset: true});
  }

  toggleStopwatch() {
    this.setState({stopwatchStart: !this.state.stopwatchStart, stopwatchReset: false});
  }

  resetStopwatch() {
    this.setState({stopwatchStart: false, stopwatchReset: true});
  }


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
    }
  }
}

const handleTimerComplete = () => alert("custom completion function");

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
//AppRegistry.registerComponent('TestApp', () => TestApp);
