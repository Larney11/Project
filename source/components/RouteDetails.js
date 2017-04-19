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
  TouchableHighlight,
  ScrollView,
  TouchableOpacity,
  AsyncStorage
} from 'react-native'

var windowSize = Dimensions.get('window');
var RouteMap = require('./RouteMap.js');
var RouteMessages = require('./RouteMessages.js')


class RouteDetails extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      displayMessages: false,
    }
  };


  componentDidMount() {

  };


  routeImagePressed() {

    var routeCoordinates;
    if(this.props.savedRouteList) {
      routesCoordinates= this.props.routeDetails.get("routeCoordinates");
    }
    else {
      routesCoordinates = null
    }

    this.props.navigator.push({
      title: "RouteMap",
      component: RouteMap,
      passProps: {
        route_id: this.props.routeDetails.get('route_id'),
        //savedRouteList: this.props.savedRouteList,
        routesCoordinates: this.props.routeDetails.get("routeCoordinates"),
      }
    });
  };


  _saveRoute() {

    if(!this.props.savedRouteList) {

      const {routeDetails} = this.props;
      var routeCoordinates = [];

      Store.getRouteCoordinates(routeDetails.get("route_id")).then((routeCoord) => {

        var longitude, latitude, longitudeDelta, latitudeDelta;
        var key = 0;
        for (var i = 0, len = routeCoord.length; i < len; i++) {

          coordObj = {};
          longitude = routeCoord[i].get("longitude");
          latitude = routeCoord[i].get("latitude");
          coordObj = {longitude: longitude, latitude:latitude, latitudeDelta: 0, longitudeDelta: 0}
          routeCoordinates.push(coordObj)
        }
      }, (reason) => {

      })

      var route = {
        route_id: routeDetails.get('route_id'),
        title: routeDetails.get('title'),
        description: routeDetails.get('description'),
        address: routeDetails.get('address'),
        duration: routeDetails.get('duration'),
        distance: routeDetails.get('distance'),
        avg_speed: routeDetails.get('avg_speed'),
        difficulty: routeDetails.get('difficulty'),
        longitude: routeDetails.get('longitude'),
        latitude: routeDetails.get('latitude'),
        longitudeDelta: routeDetails.get('longitudeDelta'),
        latitudeDelta: routeDetails.get('latitudeDelta'),
        routeCoordinates: routeCoordinates
      }
      AsyncStorage.setItem('result', JSON.stringify(route), () => {
        AsyncStorage.getItem('result', (err, result) => {
          console.log("result", result);
        });
      });
    }
    else {
      console.log("route already saved");
    }
  };


  _handlePress() {
    if(!this.state.displayMessages) {
      this.setState({displayMessages: true});
    }
    else {
      this.setState({displayMessages: false});
    }
  };


  render() {
    var _scrollView: ScrollView;

    return (
      <View style={styles.container}>
          <ScrollView
            ref={(scrollView) => { _scrollView = scrollView; }}
            automaticallyAdjustContentInsets={false}
            onScroll={() => { console.log('onScroll!'); }}
            scrollEventThrottle={200}
            style={styles.scrollView}>

            <TouchableHighlight onPress={this.routeImagePressed.bind(this)} >

              <Image style={styles.routeImage} source={require('../../Resources/img/gpsRouteSample.jpg')} />
            </TouchableHighlight>
            <View style={{flexDirection: 'row'}}>
              <TouchableHighlight underlayColor={'#e7e7e7'} onPress={this.routeImagePressed.bind(this)}>
                <Text style={styles.startButton}>Start Route</Text>
              </TouchableHighlight>
              <TouchableHighlight underlayColor={'#e7e7e7'} onPress={this._saveRoute.bind(this)}>
                <Text style={styles.saveButton}>Save</Text>
              </TouchableHighlight>
            </View>
            <View style={styles.routeDetails}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.detailLabel}>User: </Text>
                <Text style={styles.detail}>{this.props.routeDetails.get('username')}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.detailLabel}>Title: </Text>
                <Text style={styles.detail}>{this.props.routeDetails.get('title')}</Text>
              </View>
              <Text style={styles.detailLabel}>Address: </Text>
              <Text style={styles.detail}>{this.props.routeDetails.get('address')}</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.detailLabel}>Duration: </Text>
                <Text style={styles.detail}>{this.props.routeDetails.get('duration')}</Text>
                <View style={{flexDirection: 'row', alignSelf: 'flex-end', marginRight: 5}}>
                  <Text style={styles.detailLabel}>   Difficulty: </Text>
                  <Text style={styles.detail}>{this.props.routeDetails.get('difficulty')}</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.detailLabel}>Distance: </Text>
                <Text style={styles.detail}>{this.props.routeDetails.get('distance')} km</Text>
                <View style={{flexDirection: 'row', alignSelf: 'flex-end', marginRight: 4}}>
                  <Text style={styles.detailLabel}>    Avg Speed: </Text>
                  <Text style={styles.detail}>{this.props.routeDetails.get('avg_speed')} km/h</Text>
                </View>
              </View>
              <TouchableHighlight underlayColor={'#e7e7e7'} onPress={this._handlePress.bind(this)}>
                <Text style={styles.viewStatsBtton}>Comments</Text>
              </TouchableHighlight>
              <RouteMessages displayMessages={this.state.displayMessages} route_id={this.props.routeDetails.get('route_id')}/>
            </View>
          </ScrollView>
          <TouchableOpacity
            style={styles.button}
            onPress={() => { _scrollView.scrollTo({y: 0}); }}>
            <Text>Scroll to top</Text>
          </TouchableOpacity>
      </View>
    )
  };
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
    padding: 5
  },
  routeImage: {
    alignItems: 'center',
    marginTop: 20,
    height: windowSize.height * 0.2,
    width: windowSize.width - 10
  },
  startButton: {
    alignItems: 'center',
    height: 35,
    width: (windowSize.width * 0.5) - 10,
    color: 'black',
    borderWidth: 2,
    borderColor: '#00CC66',
    borderRadius: 2,
    paddingTop: 6,
    textAlign: 'center',
    fontSize: 20,
    marginTop: 5,
    marginRight: 2,
  },
  saveButton: {
    alignItems: 'center',
    height: 35,
    width: (windowSize.width * 0.5) - 4,
    color: 'black',
    borderWidth: 2,
    borderColor: '#00CC66',
    borderRadius: 2,
    paddingTop: 6,
    textAlign: 'center',
    fontSize: 20,
    marginTop: 5,
    marginLeft: 2,
  },
  routeDetails: {
    flex: 0.8
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  detail: {
    fontSize: 15,
  },
  viewStatsBtton: {
  alignItems: 'center',
  height: 35,
  width: windowSize.width - 10,
  color: 'black',
  borderWidth: 2,
  borderColor: '#00CC66',
  borderRadius: 2,
  paddingTop: 6,
  textAlign: 'center',
  fontSize: 20,
  marginTop: 5,
  },
  viewStatsBttonPress: {
    alignItems: 'center',
    marginTop: 20,
    height: 35,
    width: windowSize.width,
    color: '#e7e7e7',
    borderWidth: 2,
    borderRadius: 2,
    paddingTop: 5,
  }
});

module.exports = RouteDetails;
