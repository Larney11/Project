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
  TouchableOpacity
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
    var _scrollView: ScrollView;

    return (
      <View style={styles.container}>
        <View>
          <ScrollView
            ref={(scrollView) => { _scrollView = scrollView; }}
            automaticallyAdjustContentInsets={false}
            onScroll={() => { console.log('onScroll!'); }}
            scrollEventThrottle={200}
            style={styles.scrollView}>

            <TouchableHighlight onPress={this.routeImagePressed.bind(this)} >

              <Image style={styles.routeImage} source={require('../../Resources/img/gpsRouteSample.jpg')} />
            </TouchableHighlight>
            <View style={styles.routeDetails}>

              <Text>Title: {this.props.routeDetails.get('title')}</Text>
              <Text>Description: {this.props.routeDetails.get('description')}</Text>
              <Text>Distance: {this.props.routeDetails.get('distance')}</Text>
              <TouchableHighlight underlayColor={'#e7e7e7'} onPress={this._handlePress}>
                <Text style={styles.viewStatsBtton}>Comments</Text>
              </TouchableHighlight>
            </View>
          </ScrollView>
          <TouchableOpacity
            style={styles.button}
            onPress={() => { _scrollView.scrollTo({y: 0}); }}>
            <Text>Scroll to top</Text>
          </TouchableOpacity>
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
  },
  viewStatsBtton: {
  alignItems: 'center',
  //marginTop: 20,
  height: 35,
  width: windowSize.width,
  color: 'black',
  //backgroundColor: 'green',
  borderWidth: 2,
  borderColor: '#00CC66',
  borderRadius: 2,
  paddingTop: 6,
  textAlign: 'center',
  fontSize: 20,
  //textDecoration: 'none',
  },
  viewStatsBttonPress: {
    alignItems: 'center',
    marginTop: 20,
    height: 35,
    width: windowSize.width,
    color: '#e7e7e7',
    //backgroundColor: 'green',
    borderWidth: 2,
    //borderColor: 'green',
    borderRadius: 2,
    paddingTop: 5,
  }
});

module.exports = RouteDetails;
