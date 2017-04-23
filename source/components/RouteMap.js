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
  Alert
} from 'react-native'

var MapView = require('react-native-maps');
var RouteList = require('./RouteList.js');
var Store = require('../store/Store.js');
var Clock = require('./StopWatch.js');


import haversine from 'haversine'
const { width, height } = Dimensions.get('window');

class RouteMap extends Component {

  constructor(props) {
    super(props);
    this.map = null;
    this.state = {
      initialPosition: {longitude:-122.03255055, latitude:37.33517518, latitudeDelta:0, longitudeDelta:0},
      markers: [],
      routeCoordinates: [],
      routeStartPosition: {},
      routeEndPosition: {},
      routeCoordIndex: 0,
      routeViewCoordinates: [],
      distanceTravelled: 0,
      stopwatchStart: false,
      stopwatchFinish: false,
      stopwatchReset: false,
      displayStopwatch: false,
      intervalId: null,
      routeAddress: null,
      speedArray: [],
      avgSpeed: 0,
      totalTime: 0,
      finishButton: null,
      displayStopButton: false,
      recordingNewRoute: false,
      dislpayStop: false,
    };
    this.startRoute = this.startRoute.bind(this);
    this.toggleStopwatch = this.toggleStopwatch.bind(this);
    this.setTime = this.setTime.bind(this);
  };

  watchID: ?number = null;

  componentDidMount() {

    if(this.props.routesCoordinates == null) {

      Store.getRouteCoordinates(this.props.route_id).then((routeCoordinates) => {

        this.sortRouteCoordinates(routeCoordinates);
      }, (reason) => {})
    }
    else {
      this.sortRouteCoordinates(this.props.routeCoordinates);
    }


    this.watchID = navigator.geolocation.watchPosition((position) => {

      var initialPosition = {longitude:position.coords.longitude,latitude:position.coords.latitude,latitudeDelta: 0,longitudeDelta: 0};
      var curentPosition = {longitude:position.coords.longitude,latitude:position.coords.latitude};

      this.map.fitToCoordinates([curentPosition, this.state.routeStartPosition], {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    });
  };



  sortRouteCoordinates(routeCoordinates) {

    var longitude, latitude, longitudeDelta, latitudeDelta;
    var coordArray = [];
    var coordObj = {};
    var key = 0;
    for (var i = 0, len = routeCoordinates.length; i < len; i++) {

      coordObj = {};
      longitude = routeCoordinates[i].get("longitude");
      latitude = routeCoordinates[i].get("latitude");
      coordObj = {longitude: longitude, latitude:latitude, latitudeDelta: 0, longitudeDelta: 0}
      coordArray.push(coordObj)
      if(i == 0) {

        this.setState({ routeStartPosition: {longitude: longitude, latitude: latitude} });
        this.state.markers.push({coordinate:{longitude: longitude, latitude: latitude}, key: key, color: "#000"});
        key ++;
      }
      if(i == len-1) {

        this.setState({ routeEndPosition: {longitude: longitude, latitude: latitude} });
        this.state.markers.push({coordinate:{longitude: longitude, latitude: latitude}, key: key, color: "#FFF"});
      }
    }
    this.setState({routeCoordinates: coordArray});
  }


  componentWillUnmount() {

    this.clearWatch();
  }


  clearWatch() {

    navigator.geolocation.clearWatch(this.watchID);
  }

  componentWillUnmount() {

    this.clearWatch();
  }


  viewRouteList() {

    this.props.navigator.push({
      title: "RouteList",
      component: RouteList,
    });
  };


  calculateAverageSpeed() {

    const {speedArray, totalTime} = this.state;

    // Calculate Average Speed
    var totalSpeed = 0;
    var maxSpeed;
    var speedArrayLength = speedArray.length;
    var i;
    for(i = 0; i < speedArrayLength; i++) {

      totalSpeed += speedArray[i];
      if(speedArray[i] > maxSpeed){
        maxSpeed = speedArray[i];
      }
    }
    var avgSpeed = totalSpeed / speedArrayLength;
    this.setState({avgSpeed: avgSpeed})

  }


  startRoute() {

    navigator.geolocation.getCurrentPosition((position) => {

      var currentLocation = {longitude:position.coords.longitude,latitude:position.coords.latitude,latitudeDelta: 0,longitudeDelta: 0};
      var distanceFromRoute = this.calcDistance(currentLocation, this.state.routeStartPosition);
      navigator.geolocation.clearWatch(this.watchID);
      this.setState({initialPosition: currentLocation});

      if(distanceFromRoute <= 20) {
        this.toggleStopwatch();
        Alert.alert('Go!', "Route has begun!");
        var intervalId = setInterval( () => { this.routeChecker() }, 2000);
        this.setState({intervalId: intervalId});
        //this.toggleStopwatch();
      }
      else {
        Alert.alert('Alert', "Must be at starting point! " + distanceFromRoute + " meters away");
      }
    },(error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 20}
    );
  };


  routeChecker() {
    console.log("-----------ROUTECHECKER!!!!!!-------");

    navigator.geolocation.getCurrentPosition((position) => {

      var currentLocation = {longitude:position.coords.longitude,latitude:position.coords.latitude};
      var currentLocationa = {longitude:position.coords.longitude,latitude:position.coords.latitude,latitudeDelta: 0,longitudeDelta: 0};
      this.setState({initialPosition: currentLocationa});
      var routeCoordinates = this.state.routeCoordinates;
      var distanceFromRoute = 0;
      var exit = false;
      var routeHasPassed = false;
      var speedArray = this.state.speedArray;
      speedArray.push(position.coords.speed);
      this.setState({speedArray: speedArray})

      var routeCoordinate;
      var routeCoordIndex = this.state.routeCoordIndex;

      for (var i = this.state.routeCoordIndex; i < routeCoordinates.length && exit == false; i++) {

        routeCoordinate = {longitude: routeCoordinates[i].longitude, latitude: routeCoordinates[i].latitude}
        distanceFromRoute = this.calcDistance(currentLocation, routeCoordinate);

        if((distanceFromRoute <= 20) && (i == routeCoordinates.length-1)) {
          clearInterval(this.state.intervalId);
          exit = true;
          this.toggleStopwatch();
          this.calculateAverageSpeed();
          Alert.alert('Finito!', "Time: "+this.state.totalTime+" \nAverageSpeed: "+this.state.avgSpeed + " km/h");
        }
        if(distanceFromRoute <= 20) {

          console.log("passed", this.state.routeCoordIndex + " i:" + i );
          routeHasPassed = true;
          this.setState({routeCoordIndex: routeCoordIndex+1});
        }
        else {

          if(routeHasPassed == false) {

            Alert.alert('Return to red marker!', "Go back to the route!");
          }
          console.log("EXIT@", this.state.routeCoordIndex);
          exit = true;
        }
      }
    },(error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 20}
    );
  };


  setTime(time) {
    var totalTime = time;
    this.setState({totalTime: totalTime});
  }


  onViewRoutePressed() {

    //var lastPos = this.state.region.lenght;
    this.props.navigator.push({
      title: "RouteList",
      component: RouteList,
      passProps: {
        //currentLocation: this.state.region[lastPos]
      }
    });
  };


  // Calculates distance travelled
  calcDistance(currentLocation, routeLocation) {

     return (haversine(currentLocation, routeLocation, {unit: 'meter'}) || 0)
  };


  toggleStopwatch() {

    this.setState({
      stopwatchStart: !this.state.stopwatchStart,
      stopwatchReset: false,
      displayStopwatch: true
    });

    var intervalId;

    if(this.state.stopwatchStart) {

      clearInterval(this.state.intervalId);
      this.setState({dislpayStop: false});
    }
    else {

      //var intervalId = setInterval( () => { this.startTracking() }, 2000);
      this.setState({/*intervalId: intervalId,*/ stopwatchFinish: false, dislpayStop: true});
      this.setState({dislpayStop: !this.state.dislpayStop});
    }
  };


  displayStopButton() {

    if(this.state.dislpayStop) {

      var finishButton =
      <TouchableHighlight
        style={styles.buttonContainer}
        >
        <View style={styles.routeButton}>
          <Text style={styles.routeButtonText}>{"Stop"}</Text>
        </View>
      </TouchableHighlight>;
      this.setState({finishButton: finishButton});
    }
    else {

      var finishButton = <View style={styles.blankButton}><Text style={styles.blankButtonText}>{"Stop"}</Text></View>;
      this.setState({finishButton: finishButton});
    }
  }


  render() {

    AppDispatcher.addEventListener('setTime_RouteMap', this.setTime, this);

    return (
      <View style={styles.container}>

        <MapView
          ref={ref => { this.map = ref; }}
          style={styles.map}
          region={this.state.initialPosition}
          showsUserLocation={true}
        >
          {this.state.markers.map(marker => (
            <MapView.Marker
              key={marker.key}
              coordinate={marker.coordinate}
              pinColor={marker.color}
              centerOffset={{ x: -42, y: -60 }}
            >
              <MapView.Callout style={styles.markerText}>
                <TouchableHighlight
                  onPress={this.startRoute.bind(this)}
                >
                  <View>
                    <Text>Start Route</Text>
                  </View>
                </TouchableHighlight>
              </MapView.Callout>
            </MapView.Marker>
          ))}
          <MapView.Polyline
            coordinates={this.state.routeCoordinates}
            strokeColor="#000"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={4}
          />
        </MapView>
        <View style={styles.bottomBar}>

          <View style={styles.bottomButtonGroup}>
            <TouchableHighlight
              onPress={this.startRoute.bind(this)}
              style={styles.buttonContainer}>

              <View style={styles.routeButton}>
                <Text style={styles.routeButtonText}>{!this.state.stopwatchStart ? "Start" : "Pause"}</Text>
              </View>
            </TouchableHighlight>
            {this.state.finishButton}
            <View style={styles.clockContainer}>
              <Clock
                displayStopwatch={this.state.displayStopwatch}
                stopwatchStart={this.state.stopwatchStart}
                stopwatchReset={this.state.stopwatchReset}
                stopwatchFinish={this.state.stopwatchFinish}
                recordingNewRoute={this.state.recordingNewRoute}
                style={styles.clock}
              />
            </View>
          </View>
          <View style={styles.menuBar}>
            <TouchableHighlight
              underlayColor='#70db70'
              style={styles.buttonContainer}
              >
              <View style={styles.menuButton}>
                <Text>Routes</Text>
              </View>
            </TouchableHighlight>
            <View style={styles.menuMiddleButton}>
              <Text>Profile</Text>
            </View>
            <View style={styles.menuButton}>
              <Text>More</Text>
            </View>
          </View>
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
  },
  markerText: {
    width: 85
  },


  bottomBar: {
    position: 'absolute',
    height: 250,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0)',
    width: width,
    padding: 20,
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  bottomButtonGroup: {
    flex: 1
  },
  bottomBarContent: {
    color: '#fff',
    fontWeight: "700",
    fontSize: 18,
    marginTop: 10,
    color: '#19B5FE',
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  routeButton: {
    width: width * 0.3,
    height: 25,
    marginTop: 5,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    backgroundColor: 'white'
  },
  routeButtonText: {
    color: 'black',
    fontWeight: "400",
    textAlign: 'center',
  },
  blankButton: {
    width: width * 0.3,
    height: 25,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  blankButtonText: {
    color: 'rgba(0, 0, 0, 0)',
    fontWeight: "400",
    textAlign: 'center',
  },
  clockContainer: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  clock: {
  },
  menuBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 50,
    width: width,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'green',
    borderWidth: 1
  },
  menuButton: {
    height: 50,
    width: (width /3 ),
    alignItems: 'center',
    paddingTop: 15
  },
  menuMiddleButton: {
    height: 50,
    width: (width /3 ),
    alignItems: 'center',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'black',
    paddingTop: 15
  }
});

module.exports = RouteMap;
