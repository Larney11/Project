import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';


class StopWatch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: null,
      started: false,
      elapsed: null,
      changedPropsCount: 0,
    };
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.reset = this.reset.bind(this);
    this.getTime = this.reset.bind(this);
    this.formatTime = this.formatTime.bind(this);
  }

  componentDidMount() {
    if(this.props.stopwatchStart) {
      this.start();
    }
  }

  componentWillReceiveProps(newProps) {

    if(!newProps.stopwatchFinish) {

      const {changedPropsCount} = this.state;
      if(changedPropsCount < 1) {
        if(newProps.stopwatchStart) {
          this.start();
        }
        else {
          this.stop();
        }
      }
      else {
        this.setState({changedPropsCount: 0})
      }
    }
  }

  start() {
    this.setState({startTime: this.state.startTime ? this.state.startTime :
      new Date(), started: true});
    this.interval = this.interval ? this.interval : setInterval(() => {
      this.setState({
        elapsed: new Date() - this.state.startTime
      });
    }, 1);
  }

  stop() {
    if(this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.setState({started: false, changedPropsCount: 1});
    this.props.onChange(this.formatTime());
  }

  reset() {
    this.setState({elapsed: null, startTime: null});
  }


  formatTime() {
    let now = this.state.elapsed;
    let msecs = now % 1000;

    if(msecs < 10) {
      msecs = `00${msecs}`;
    } else if(msecs < 100) {
      msecs = `0${msecs}`;
    }

    let seconds = Math.floor(now / 1000);
    let minutes = Math.floor(now / 60000);
    let hours = Math.floor(now / 3600000);
    seconds = seconds - (minutes * 60);
    minutes = minutes - (hours * 60);
    let formatted;
    //if(this.props.msecs) {
      formatted = `${hours < 10 ? 0 : ""}${hours}:${minutes < 10 ?
        0 : ""}${minutes}:${seconds < 10 ?
          0 : ""}${seconds}:${msecs}`;
    // Without milliseconds
    /*} else {
      formatted = `${hours < 10 ? 0 : ""}${hours}:${minutes < 10 ?
        0 : ""}${minutes}:${seconds < 10 ? 0 : ""}${seconds}`;
    }*/
    return formatted;
  }


  render() {

    if(this.props.stopwatchStart) {
      return(
        <View style={styles.container}>
          <Text style={styles.text}>{this.formatTime()}</Text>
        </View>
      );
    }
    else {

      return null;
    }
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 5,
    borderWidth: 2,
    borderRadius: 5,
    width: 220, //150,
  },
  text: {
    fontSize: 30,
    color: 'black',
    marginLeft: 7,
  }
});

module.exports = StopWatch;
