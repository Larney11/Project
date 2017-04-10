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
  TouchableHighlight
} from 'react-native'

//var Store = require('./../store/Store.js');

const { width, height } = Dimensions.get('window');
import haversine from 'haversine'

var Message = require('../class/Message.js');

class RouteMessages extends Component {

  constructor(props) {

    super(props);
    this._pressRow = this._pressRow.bind(this);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      routesArray: null,
      distanceArray: [],
      dataSource: ds.cloneWithRows([]),
      selectedRowID: null
    };
  };


  componentDidMount() {

    var routes = [{"username":"Lar", "text": "Hello there!Hello there! Hello there! Hello there! Hello there! Hello there! Hello there! Hello there! Hello there! Hello there! Hello there!", "datetime": "01/01/99 01:20"}]
    var routesArray = [];
    for (var i = 0, len = routes.length; i < len; i++) {

      routesArray.push(new Message(routes[i]));
    };
    this.setState({
      routesArray: routesArray,
      dataSource: this.state.dataSource.cloneWithRows(routesArray)
    });
  };


  viewRouteMap() {

    this.props.navigator.push({
      title: "RouteMap",
      component: RouteMap,
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
  };


  _renderRow(rowData: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {

    return (
      <View>
        <View style={styles.rowContainer}>

          <Image style={styles.thumb} source={require('../../Resources/img/loginBackground.jpg')} />
          <View style={styles.rowContents}>
            <Text style={styles.subtext}>
              {rowData.get("username")}
            </Text>
            <Text style={styles.text}>
              {rowData.get("text")}
            </Text>
            <Text style={styles.text}>
              {rowData.get("datetime")}
            </Text>
          </View>
        </View>
      </View>
    )
  };

  render() {

    if(this.props.displayMessages == true) {

      return (
        <View style={styles.container}>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderRow.bind(this)}
            renderSeparator={this._renderSeperator}
            automaticallyAdjustContentInsets={false}
            enableEmptySections={true}
          />
        </View>
      )
    }
    else {
      return null;
    }
  };
};


var styles = StyleSheet.create({
  container: {
    marginTop: 2,
    flex: 1
  },
  headerContainer: {
    height: 30,
    backgroundColor: "#FFF"
  },
  listviewContainer: {
    flex: 0.9
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
});


module.exports = RouteMessages;
