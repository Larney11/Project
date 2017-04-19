/*
 *
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  ListView,
  View,
  Text,
  Image,
  Dimensions,
  TouchableHighlight,
  AsyncStorage
} from 'react-native'

var Store = require('./../store/Store.js');
var RouteMap = require('./RouteMap.js');
var RouteDetails = require('./RouteDetails.js');
var Route = require('../class/Route.js')



const { width, height } = Dimensions.get('window');
import haversine from 'haversine'

class RouteList extends Component {

  constructor(props) {

    super(props);
    this._pressRow = this._pressRow.bind(this);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      routesArray: null,
      distanceArray: [],
      dataSource: ds.cloneWithRows([]),
      selectedRowID: null,
      savedRouteList: false
    };
  };


  componentDidMount() {

    this._viewRoutesList();
  };


  // Calculates distance travelled
  calcDistance(currentLocation, routeLocation) {

     return (haversine(currentLocation, routeLocation) || 0)
  };


  viewRouteMap() {

    this.props.navigator.push({
      title: "RouteMap",
      component: RouteMap,
    });
  };

  _viewRoutesList() {

    this.setState({savedRouteList: false});
    Store.getRoutes().then((routesArray) => {

      var currentLocation = this.props.currentLocation;
      for (var i = 0, len = routesArray.length; i < len; i++) {

        routeLocation = {};
        longitude = routesArray[i].get("longitude");
        latitude = routesArray[i].get("latitude");
        longitudeDelta = routesArray[i].get("longitudeDelta");
        latitudeDelta = routesArray[i].get("latitudeDelta");
        routeLocation = {longitude: longitude, latitude: latitude, longitudeDelta: longitudeDelta, latitudeDelta: latitudeDelta}
        this.state.distanceArray[i] = 0;
      }

      this.setState({
        routesArray: routesArray,
        dataSource: this.state.dataSource.cloneWithRows(routesArray)
      });
    },(resaon) => {

      console.log("getRoutes():", resaon);
    });
  };


  _viewSavedRoutesList() {

    this.setState({savedRouteList: true});
    AsyncStorage.getItem('result', (err, result) => {
      var route = new Route(JSON.parse(result));
      var routeArray = [route];
      this.setState({
        routesArray: routeArray,
        dataSource: this.state.dataSource.cloneWithRows(routeArray)
      });
    });
  };


  _renderSeperator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: adjacentRowHighlighted ? 4 : 1,
          backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC'
        }}
      />
    );
  };


  _pressRow(rowID: number) {

    var route = this.state.routesArray[rowID];
    var savedRouteList = this.state.savedRouteList;
    this.props.navigator.push({
      title: "RouteDetails",
      component: RouteDetails,
      passProps: {
        routeDetails: route,
        savedRouteList: savedRouteList,
      }
    });
  };


  _renderRow(rowData: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {

    return (
      <View>
        <TouchableHighlight onPress={() => {
          this._pressRow(rowID);
          highlightRow(sectionID, rowID);
        }}>
          <View style={styles.rowContainer}>

            <Image style={styles.thumb} source={require('../../Resources/img/loginBackground.jpg')} />
            <View style={styles.rowContents}>

              <Text style={styles.subtext}>
                {rowData.get("title")}
              </Text>
              <Text style={styles.text}>
                {rowData.get("description")}
              </Text>
              <Text style={styles.text}>
                {this.state.distanceArray[rowID]} m
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    )
  };

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.menuBar}>
          <TouchableHighlight
            underlayColor='#70db70'
            onPress={this._viewSavedRoutesList.bind(this)}
            style={styles.buttonContainer}>
            <View style={styles.menuButton}>
              <Text>Saved</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor='#70db70'
            onPress={this._viewRoutesList.bind(this)}
            style={styles.buttonContainer}>
            <View style={styles.menuMiddleButton}>
              <Text>List</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor='#70db70'
            onPress={this.viewRouteMap.bind(this)}
            style={styles.buttonContainer}>
            <View style={styles.menuButton}>
              <Text>Map</Text>
            </View>
          </TouchableHighlight>
        </View>
        <ListView style={styles.listview}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderSeparator={this._renderSeperator}
          automaticallyAdjustContentInsets={false}
          enableEmptySections={true}
        />
      </View>
    )
  };
};


var styles = StyleSheet.create({
  container: {
    marginTop: 60,
    flex: 1,
    flexDirection: 'column'
  },
  menuBar: {
    position: 'absolute',
    right: 5,
    top: 5,
    flex : 0.1,
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
  headerContainer: {
    height: 50,
    backgroundColor: "#FFF"
  },
  listview: {
    flex: 0.9,
    height: height - 200,
    marginTop: 60
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 5,
    backgroundColor: 'white',
  },
  thumb: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'grey',
    marginRight: 5,
    marginBottom: 5,
  },
  rowContents: {
    flexDirection: 'column',
  },
  text: {
    //width: (width * 0.5),
    //fontSize: 16,
    //fontWeight: '600',
    //color: '#ffffff',
  },
  subtext: {

  },
  datetime: {

  },
  deleteButton: {

  },
  mapBtn: {
    width: 40,
    height: 20,
    position: 'absolute',
    right: 5,
    top: 5,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "blue",
    paddingLeft: 5,
    backgroundColor:"white",
  }
});

module.exports = RouteList;
