/**
 * @flow
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableHighlight
} from 'react-native'

// Picks specified values out of JSON
import pick from 'lodash/pick'

var MapView = require('react-native-maps');
var RegisterRoute = require('./RegisterRoute.js');
var RouteList = require('./RouteList.js');
var Clock = require('./Clock.js');


const { width, height } = Dimensions.get('window');
// Calculates the distance travelled
// Calculates the shortest distance between two points on the earths surface
import haversine from 'haversine'

class MapV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialPosition: {longitude:-122.03036811, latitude:37.33045921, latitudeDelta:0.0922, longitudeDelta:0.0421},
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      stopwatchStart: false,
      stopwatchReset: false,
      displayStopwatch: false
      /*[
            { longitude: -122.08732093, latitude: 37.3396502 },
            { longitude: -122.08856086, latitude: 37.34031484 },
            { longitude: -122.08983097, latitude: 37.34092739 },
            { longitude: -122.09108423, latitude: 37.34154237 },
            { longitude: -122.092223, latitude:  37.34229154},
            { longitude: -122.09320284, latitude: 37.34312416 },
      ],*/
    }
    this.toggleStopwatch = this.toggleStopwatch.bind(this);

  }

  watchID: ?number = null;

  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      var initialPosition = {longitude:position.coords.longitude,latitude:position.coords.latitude,latitudeDelta: 0.0922,longitudeDelta: 0.0421};
      var routeCoordinatess = {longitude:position.coords.longitude,latitude:position.coords.latitude};

      this.setState({
        initialPosition: initialPosition,
        routeCoordinates: this.state.routeCoordinates.concat(routeCoordinatess)
      });
    },(error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );

    this.watchID = navigator.geolocation.watchPosition((position) => {

      var currentCoordinate = {longitude: position.coords.longitude, latitude: position.coords.latitude};

      this.setState({
        routeCoordinates: this.state.routeCoordinates.concat(currentCoordinate),
        distanceTravelled: this.state.distanceTravelled + this.calcDistance(currentCoordinate),
        prevLatLng: currentCoordinate
      });
    });
  }


  // Stops trackng position when closed
  componentWillUnmount() {

    navigator.geolocation.clearWatch(this.watchID);
  }


  onSubmitRoutePressed() {
    this.props.navigator.push({
      title: "RegisterRoute",
      component: RegisterRoute,
      passProps: {
        routeCoordinates: this.state.routeCoordinates,
        distanceTravelled: this.state.distanceTravelled
      }
    });
  };


  onViewRoutePressed() {
    this.props.navigator.push({
      title: "RouteList",
      component: RouteList
    });
  };


  // Calculates distance travelled
  calcDistance(newLatLng) {
     const { prevLatLng } = this.state
     return (haversine(prevLatLng, newLatLng) || 0)
  };


  toggleStopwatch() {
    this.setState({
      stopwatchStart: !this.state.stopwatchStart,
      stopwatchReset: false,
      displayStopwatch: true
    });
  };


  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          region={this.state.initialPosition}
          followUserLocation={true}
          showsUserLocation={true}
        >
          <MapView.Polyline
            coordinates={this.state.routeCoordinates}
            strokeColor="#000"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={4}
          />
        </MapView>
        <View style={styles.bottomBar}>
          <View style={styles.bottomBarGroup}>
          <Clock
            displayStopwatch={this.state.displayStopwatch}
            stopwatchStart={this.state.stopwatchStart}
            stopwatchReset={this.state.stopwatchReset}
            />
            <TouchableHighlight
              onPress={this.toggleStopwatch}>
              <Text style={styles.bottomBarHeader}>{!this.state.stopwatchStart ? "Start" : "Stop"}</Text>
            </TouchableHighlight>

            <TouchableHighlight style={styles.bottomBarGroup}
              underlayColor='#70db70'
              onPress={this.onSubmitRoutePressed.bind(this)}
              >
              <Text style={styles.bottomBarHeader}>Upload</Text>
            </TouchableHighlight>

            <TouchableHighlight style={styles.bottomBarGroup}
              underlayColor='#70db70'
              onPress={this.onViewRoutePressed.bind(this)}
              >
              <Text style={styles.bottomBarHeader}>Routes</Text>
            </TouchableHighlight>

          </View>
        </View>
      </View>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  navBar: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    height: 64,
    width: width,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  navBarText: {
    color: '#19B5FE',
    fontSize: 16,
    fontWeight: "700",
    textAlign: 'center',
    paddingTop: 30
  },
  map: {
    flex: 0.6,
    width: width,
    height: height
  },
  bottomBar: {
    position: 'absolute',
    height: 200,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: width,
    padding: 20,
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  bottomBarGroup: {
    flex: 1
  },
  bottomBarHeader: {
    color: '#fff',
    fontWeight: "400",
    textAlign: 'center'
  },
  bottomBarContent: {
    color: '#fff',
    fontWeight: "700",
    fontSize: 18,
    marginTop: 10,
    color: '#19B5FE',
    textAlign: 'center'
  },
});

module.exports = MapV;

/*
2017-01-19 14:17:46.165 [info][tid:com.facebook.react.JavaScript]
'=======lastPosition',
'{
   "coords":{
      "speed":5.8,
      "longitude":-122.03036811,
      "latitude":37.33045921,
      "accuracy":5,
      "heading":103.28,
      "altitude":0,
      "altitudeAccuracy":-1
   },
   "timestamp":1484835466161.885
}'

2017-01-19 14:20:15.434 [info][tid:com.facebook.react.JavaScript]
'=======lastPosition',
'{
   "coords":{
      "speed":5.05,
      "longitude":-122.02355883,
      "latitude":37.33292302,
      "accuracy":10,
      "heading":348.03,
      "altitude":0,
      "altitudeAccuracy":-1
   },
   "timestamp":1484835615429.096
}'
*/
