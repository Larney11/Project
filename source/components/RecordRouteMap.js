
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableHighlight,
  AsyncStorage
} from 'react-native'
var TimerMixin = require('react-timer-mixin');
import Geocoder from 'react-native-geocoder';

var MapView = require('react-native-maps');
var RegisterRoute = require('./RegisterRoute.js');
var RouteList = require('./RouteList.js');
var Clock = require('./StopWatch.js');
var Store = require('../store/Store.js');
var RegisterUser = require('./RegisterUser.js');
var config = require('../../config.json')

require('../dispatcher/AppDispatcher.js');

var Auth0Lock = require('react-native-lock');
var lock = new Auth0Lock({clientId: "YVxlRSk3KdKTpsx6pAOGNHMP3L8mcPNl", domain: "trackmyroute.eu.auth0.com"});

// Calculates the distance travelled
// Calculates the shortest distance between two points on the earths surface
import haversine from 'haversine'
const { width, height } = Dimensions.get('window');

class RecordRouteMap extends Component {
  mixins: [TimerMixin];

  constructor(props) {

    super(props);
    this.state = {
      region: new MapView.AnimatedRegion ({
        longitude:-122.03036811,
        latitude:37.33045921,
        latitudeDelta:0,
        longitudeDelta:0
      }),
      //initialPosition: {longitude:-122.03036811, latitude:37.33045921, latitudeDelta:0.0922, longitudeDelta:0.0421},
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      stopwatchStart: false,
      stopwatchFinish: false,
      stopwatchReset: false,
      displayStopwatch: false,
      intervalId: null,
      coordinateCount: 0,
      routeAddress: null,
      speedArray: [],
      totalTime: '0',
      stopUploadButton: null,
      displayStopButton: false,
      recordingNewRoute: true,
      moreButtonOpen: null,
      email: "",
      username: "",
    }
    this.toggleStopwatch = this.toggleStopwatch.bind(this);
    this.followUserPosition = this.followUserPosition.bind(this);
    this.setTime = this.setTime.bind(this);
    this.registerUser = this.registerUser.bind(this);
    //this.startTracking = this.startTracking.bind(this);
  }


  watchID: ?number = null;

  componentDidMount() {

    this.login();

    navigator.geolocation.getCurrentPosition((position) => {

      var region = {longitude:position.coords.longitude,latitude:position.coords.latitude,latitudeDelta: 0.0041,longitudeDelta: 0.0021};
      this.setState({region: region});
      this.followUserPosition();

    },(error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 1000, maximumAge: 1000, distanceFilter: 10}
    );
  };


  componentDidUnMount() {

    this.setState({stopwatchReset: true});
    navigator.geolocation.clearWatch(this.watchID);
    this.stopTracking();
    this.setState({
      routeCoordinates: [],
      distanceTravelled: 0,
      prevLatLng: {},
      stopwatchStart: false,
      stopwatchFinish: false,
      stopwatchReset: false,
      displayStopwatch: false,
      intervalId: null,
      coordinateCount: 0,
      routeAddress: null,
      speedArray: [],
      totalTime: null,
      stopUploadButton: null,
      displayStopButton: false,
      recordingNewRoute: true,
      email: "",
      username: "",
    })
  }


  login() {

    var loggedIn;
    AsyncStorage.getItem('loggedIn', (err, result) => {
      console.log("loggedIn==>result", result);

      if(result !== null){
        loggedIn = result;
        console.log("if(result !== null){", result);
      }
      else {
        loggedIn = "false";
      }
      if(loggedIn == "false") {
        lock.show({}, (err, profile, token) => {
          if (err) {
            console.log(err);
            return;
          }
          else {

            var email;
            var username;
            var loginType = profile.identities[0].provider;
            if(loginType == 'facebook') {

              this.setState({email: profile.email, username: profile.nickname});
            }
            else {

              var email = profile.email;
              var username = profile.nickname;
              AsyncStorage.getItem('email', (err, result) => {
                if(result !== null) {
                  if(result !== email) {
                    AsyncStorage.setItem('registered', "false", () => { console.log("jkjkjj3")});
                    AsyncStorage.setItem('username', "username", () => { console.log("jkjkjj3")});
                    AsyncStorage.setItem('email', "email", () => { console.log("jkjkjj3")});
                  }
                }
              });


              if(typeof email !== "undefined") {
                this.setState({email: email});
              }
              if(typeof username !== "undefined") {
                this.setState({username: username});
              }
            }
            AsyncStorage.setItem('loggedIn', "true", () => {});

            AsyncStorage.getItem('registered', (err, result) => {

              if(result == null || result == "false") {

                Store.postUserDetails({email: email, username: username}).then((success) => {

                  AsyncStorage.setItem('username', username, () => {

                    AsyncStorage.setItem('email', email, () => { console.log()});
                  });


                  AsyncStorage.setItem('registered', "true", () => {});
                }, (reason) => { console.log("", reason); });
              }
            });

            //    postUserDetails(formData) {
            AsyncStorage.getItem('registered', (err, result) => {
              if(result == null || result == "false") {

                this.registerUser();
              }
            });
          }
        });
      }
      else {
        console.log("Not logged in", loggedIn)
      }
    });
  }


  logout() {
/*
    AsyncStorage.setItem('registered', "false", () => {});
    AsyncStorage.setItem('loggedIn', "false", () => {});
    AsyncStorage.setItem('email', "", () => {});
    AsyncStorage.setItem('username', "", () => {});
*/
    AsyncStorage.setItem('loggedIn', "false", () => {
      AsyncStorage.getItem('loggedIn', (err, result) => {
        console.log("loggedOut result", result);
        this.login();
      });
    });
  }

  registerUser() {
    this.props.navigator.push({
      title: "RegisterUser",
      component: RegisterUser,
      passProps: {
        email: this.state.email,
        username: this.state.username,
      }
    });
  }



  setTime(time) {
    var totalTime = time;
    this.setState({ totalTime: totalTime});
  }

  followUserPosition() {

    this.watchID = navigator.geolocation.watchPosition((position) => {

      var region = {longitude:position.coords.longitude,latitude:position.coords.latitude,latitudeDelta: 0.0041,longitudeDelta: 0.0021};
      this.setState({region: region});
    });
  }

  startTracking() {

    navigator.geolocation.getCurrentPosition((position) => {

      var longitude = position.coords.longitude;
      var latitude = position.coords.latitude;
      var currentCoordinate = {longitude: longitude, latitude: latitude, latitudeDelta: 0, longitudeDelta: 0};
      var coordinateCount = this.state.coordinateCount;
      var speedArray = this.state.speedArray;
      speedArray.push(position.coords.speed);
      if(coordinateCount == 0) {
        Geocoder.geocodePosition({lat:latitude, lng:longitude}).then(res => {
          this.setState({routeAddress: res[0].formattedAddress})
        })
        .catch(err => console.log(err))
      }
      this.setState({
        region: {longitude: longitude, latitude: latitude, latitudeDelta: 0,longitudeDelta: 0},
        routeCoordinates: this.state.routeCoordinates.concat([currentCoordinate]),
        distanceTravelled: this.state.distanceTravelled + this.calcDistance(currentCoordinate),
        prevLatLng: currentCoordinate,
        coordinateCount: coordinateCount+1,
        speedArray: speedArray
      });
    },(error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 1000, maximumAge: 1000, distanceFilter: 10}
    );
  };


  stopTracking() {

    // Stops trackng position when closed
    navigator.geolocation.clearWatch(this.watchID);
    this.setState({coordinateCount: 0});
  };


  displayStopButton() {

    if(this.state.dislpayStop) {

      var stopUploadButton =
      <TouchableHighlight
        onPress={this.displayUploadButton.bind(this)}
        style={styles.buttonContainer}
        >
        <View style={styles.routeButton}>
          <Text style={styles.routeButtonText}>{"Stop"}</Text>
        </View>
      </TouchableHighlight>;
      this.setState({stopUploadButton: stopUploadButton});
    }
    else {

      var stopUploadButton = <View style={styles.blankButton}><Text style={styles.blankButtonText}>{"Stop"}</Text></View>;
      this.setState({stopUploadButton: stopUploadButton});
    }
  }


  displayUploadButton() {

      var stopUploadButton =
      <TouchableHighlight
        onPress={this.onSubmitRoutePressed.bind(this)}
        style={styles.buttonContainer}
        >
        <View style={styles.routeButton}>
          <Text style={styles.routeButtonText}>{"Upload"}</Text>
        </View>
      </TouchableHighlight>;
      this.setState({stopUploadButton: stopUploadButton});
  }

  _onPressMoreButton() {
    var moreMenu;
    if(this.state.moreButtonOpen == null) {
      moreMenu =
      <TouchableHighlight
        onPress={this.logout.bind(this)}
        underlayColor={'#b3b3b3'}
        >
        <View style={styles.moreMenu}>
          <Text>Log out</Text>
        </View>
      </TouchableHighlight>;
    }
    else {
      moreMenu = null;
    }

      this.setState({moreButtonOpen: moreMenu});
  }


  onSubmitRoutePressed() {

    this.setState({stopwatchFinish: true})
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

    var passProps = {
      routeCoordinates: this.state.routeCoordinates,
      distanceTravelled: this.state.distanceTravelled.toFixed(2),
      avgSpeed: avgSpeed.toFixed(2),
      duration: totalTime.slice(0, 8),
      address: this.state.routeAddress
    }


    this.props.navigator.push({
      title: "RegisterRoute",
      component: RegisterRoute,
      passProps: {
        routeCoordinates: this.state.routeCoordinates,
        distanceTravelled: this.state.distanceTravelled.toFixed(2),
        avgSpeed: avgSpeed.toFixed(2),
        duration: totalTime.slice(0, 8),
        address: this.state.routeAddress
      }
    });

  };


  onViewRoutePressed() {

    var lastPos = this.state.region.lenght;
    this.props.navigator.push({
      title: "RouteList",
      component: RouteList,
      passProps: {
        currentLocation: this.state.region[lastPos]
      }
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

    var intervalId;

    if(this.state.stopwatchStart) {

      clearInterval(this.state.intervalId);
      this.setState({dislpayStop: false});
      this.displayStopButton();
    }
    else {

      var intervalId = setInterval( () => { this.startTracking() }, 2000);
      this.setState({intervalId: intervalId, stopwatchFinish: false, dislpayStop: true});
      this.setState({dislpayStop: !this.state.dislpayStop});
      this.displayStopButton();
    }
  };

  render() {

    AppDispatcher.addEventListener('setTime_RecordRouteMap', this.setTime, this);

    const { totalTime } = this.state;
    return (
      <View style={styles.container}>

        <MapView.Animated
          style={styles.map}
          region={this.state.region}
          showsUserLocation={true}
          >
          <MapView.Polyline
            coordinates={this.state.routeCoordinates}
            strokeColor="#000"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={4}
          />
        </MapView.Animated>

        <View style={styles.bottomBar}>

          <View style={styles.bottomButtonGroup}>
            <TouchableHighlight
              onPress={this.toggleStopwatch}
              style={styles.buttonContainer}>

              <View style={styles.routeButton}>
                <Text style={styles.routeButtonText}>{!this.state.stopwatchStart ? "Start" : "Pause"}</Text>
              </View>
            </TouchableHighlight>
            {this.state.stopUploadButton}
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
          {this.state.moreButtonOpen}
          <View style={styles.menuBar}>
            <TouchableHighlight
              underlayColor='#70db70'
              onPress={this.onViewRoutePressed.bind(this)}
              style={styles.buttonContainer}>
              <View style={styles.menuButton}>
                <Text>Routes</Text>
              </View>
            </TouchableHighlight>
            <View style={styles.menuMiddleButton}>
              <Text>Profile</Text>
            </View>
            <TouchableHighlight
              underlayColor='#70db70'
              style={styles.buttonContainer}
              onPress={this._onPressMoreButton.bind(this)}>
              <View style={styles.menuButton}>
                <Text>More</Text>
              </View>
            </TouchableHighlight>
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
  },
  moreMenu: {
    position: 'absolute',
    bottom: 29,
    right: 0,
    width: (width /3 ),
    height: 40,
    backgroundColor: 'white',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',

  }
});

module.exports = RecordRouteMap;
