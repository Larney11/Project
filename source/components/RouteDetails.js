/*
 *
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Dimensions,
  TouchableHighlight
} from 'react-native'

var windowSize = Dimensions.get('window');
var RouteMap = require('./RouteMap.js');


class RouteDetails extends React.Component {

  constructor(props) {

    super(props);
    this.state = {

    }
  };


  componentDidMount() {


  };

  routeImagePressed() {

    this.props.navigator.push({
      title: "RouteMap",
      component: RouteMap,
      passProps: {
        route_id: this.props.routeDetails.get('route_id')
      }
    });
  };


  render() {

    return (
      <View style={styles.container}>

        <TouchableHighlight onPress={this.routeImagePressed.bind(this)} >

          <Image style={styles.routeImage} source={require('../../Resources/img/gpsRouteSample.jpg')} />
        </TouchableHighlight>
        <View style={styles.routeDetails}>

          <Text>Title: {this.props.routeDetails.get('title')}</Text>
          <Text>Description: {this.props.routeDetails.get('description')}</Text>
        </View>
      </View>
    )
  };
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  routeImage: {
    alignItems: 'center',
    marginTop: 20,
    flex: 0.2,
    //height: windowSize.height * 0.3,
    width: windowSize.width * 0.8
  },
  routeDetails: {
    flex: 0.8
  }
});

module.exports = RouteDetails;
