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

var MapView = require('react-native-maps');
var RouteList = require('./RouteList.js');
var Store = require('../store/Store.js');

const { width, height } = Dimensions.get('window');

class RouteMap extends Component {

  constructor(props) {

    super(props);
    this.state = {
      initialPosition: {longitude:-122.03036811, latitude:37.33045921, latitudeDelta:0, longitudeDelta:0},
      markers: [],
      routeCoordinates: []
    };
  };


  componentDidMount() {

    Store.getRouteCoordinates(this.props.route_id).then((routeCoordinates) => {

      var longitude;
      var latitude;
      var longitudeDelta;
      var latitudeDelta;
      var coordArray = [];
      var coordObj = {};
      var key = 0;
      for (var i = 0, len = routeCoordinates.length; i < len; i++) {

        coordObj = {};
        longitude = routeCoordinates[i].get("longitude");
        latitude = routeCoordinates[i].get("latitude");
        coordObj = {longitude: longitude, latitude:latitude, latitudeDelta: 0, longitudeDelta: 0}
        coordArray.push(coordObj)
        if((i == 0)||(i == len-1)) {

          this.state.markers.push({coordinate:{longitude: longitude, latitude: latitude}, key: key, color: "#000"});
          key ++;
        }
      }
      this.setState({routeCoordinates: coordArray});
    }, (reason) => {

    })

    navigator.geolocation.getCurrentPosition((position) => {

      var initialPosition = {longitude:position.coords.longitude,latitude:position.coords.latitude,latitudeDelta: 0,longitudeDelta: 0};
      this.setState({initialPosition: initialPosition});

    },(error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 20}
    );
  };


  viewRouteList() {

    this.props.navigator.push({
      title: "RouteList",
      component: RouteList,
    });
  };


  render() {

    return (
      <View style={styles.container}>

        <MapView
          style={styles.map}
          region={this.state.initialPosition}
          showsUserLocation={true}
        >
          {this.state.markers.map(marker => (
            <MapView.Marker
              key={marker.key}
              coordinate={marker.coordinate}
              pinColor={marker.color}

            />
          ))}
          <MapView.Polyline
            coordinates={this.state.routeCoordinates}
            strokeColor="#000"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={4}
          />
        </MapView>
        <View style={styles.topBar}>

          <TouchableHighlight
            onPress={this.viewRouteList.bind(this)}
            >
            <Text style={styles.listBtn}>List</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  };
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
  topBar: {
    position: 'absolute',
    height: 30,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: width,
    padding: 20,
    flexWrap: 'wrap',
    flexDirection: 'row'
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
  listBtn: {
    width: 40,
    height: 20,
    position: 'absolute',
    //right: 5,
    left: 345,
    top: 50,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "blue",
    paddingLeft: 5,
    backgroundColor:"white",
    //flexWrap: 'wrap',
    //flexDirection: 'row'
  },
});

module.exports = RouteMap;
