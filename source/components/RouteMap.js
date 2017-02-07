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

const { width, height } = Dimensions.get('window');

class RouteMap extends Component {

  constructor(props) {

    super(props);
    this.state = {
      initialPosition: {longitude:-122.03036811, latitude:37.33045921, latitudeDelta:0, longitudeDelta:0},
      markers: []
    };
  };


  componentDidMount() {

    navigator.geolocation.getCurrentPosition((position) => {

      var initialPosition = {longitude:position.coords.longitude,latitude:position.coords.latitude,latitudeDelta: 0,longitudeDelta: 0};
      this.state.markers.push({coordinate:{longitude: -122.03036811, latitude: 37.33045921}, key: 1, color: "#000"});
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
