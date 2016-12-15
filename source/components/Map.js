/***************************************************************************************
*    Title: Run-Rabbit-Run
*    Author: LennyBoyatzis
*    Date: 12/Nov/2016
*    Availability: https://github.com/LennyBoyatzis/Run-Rabbit-Run/blob/master/index.ios.js
***************************************************************************************/
/**
 * @flow
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  MapView,
  Dimensions,
} from 'react-native'

// Calculates the distance travelled
// Calculates the shortest distance between two points on the earths surface
import haversine from 'haversine'
// Picks specified values out of JSON
import pick from 'lodash/pick'


const { width, height } = Dimensions.get('window')

class Map extends Component {

  constructor(props) {
    super(props)

    this.state = {
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {}
    }
  }

  componentDidMount() {
    // Gets current location
    navigator.geolocation.getCurrentPosition((position) => {

    },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    )
    // Invokes whenever location changes
    this.watchID = navigator.geolocation.watchPosition((position) => {

      const { routeCoordinates, distanceTravelled } = this.state
      const newLatLngs = {latitude: position.coords.latitude, longitude: position.coords.longitude }

      this.setState({
        routeCoordinates: routeCoordinates.concat(newLatLngs),
        distanceTravelled: distanceTravelled + this.calcDistance(newLatLngs),
        prevLatLng: newLatLngs
      })
    });
  }

  // Stops trackng position when closed
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  // Calculates distance travelled
  calcDistance(newLatLng) {
    const { prevLatLng } = this.state
    return (haversine(prevLatLng, newLatLng) || 0)
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          mapType='satellite'
          showsUserLocation={true}
          followUserLocation={true}
          overlays={[{
            coordinates: this.state.routeCoordinates,
            strokeColor: '#19B5FE',
            lineWidth: 10,
          }]}
        />
        <View style={styles.navBar}><Text style={styles.navBarText}>Route Tracker</Text></View>
        <View style={styles.bottomBar}>
          <View style={styles.bottomBarGroup}>
            <Text style={styles.bottomBarHeader}>DISTANCE</Text>
            <Text style={styles.bottomBarContent}>{parseFloat(this.state.distanceTravelled).toFixed(2)} km</Text>
          </View>
        </View>
      </View>
    )
  }
}

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
    flex: 0.7,
    width: width,
    height: height
  },
  bottomBar: {
    position: 'absolute',
    height: 100,
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
})

module.exports = Map;
