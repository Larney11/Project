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

var Store = require('./../store/Store.js');
var RouteMap = require('./RouteMap.js');
var RouteDetails = require('./RouteDetails.js');


const { width, height } = Dimensions.get('window');

class RouteList extends Component {

  constructor(props) {

    super(props);
    this._pressRow = this._pressRow.bind(this);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      routesArray: null,
      dataSource: ds.cloneWithRows([]),
      selectedRowID: null
    };
  };


  componentDidMount() {

    Store.getRoutes().then((routesArray) => {

      this.setState({
        routesArray: routesArray,
        dataSource: this.state.dataSource.cloneWithRows(routesArray)
      });
    },(resaon) => {

      console.log("getRoutes():", resaon);
    });
  };


  viewRouteMap() {

    this.props.navigator.push({
      title: "RouteMap",
      component: RouteMap,
    });
  };


  handleSelectedRow() {

    //console.log("lllllll[[[---------]]]", rowId);
    var route = this.state.routesArray[0];
    this.props.navigator.push({
      title: "RouteDetails",
      component: RouteDetails,
      passProps: {
        routeDetails: route,
        //distanceTravelled: this.state.distanceTravelled
      }
    });
/*
    var selectedRowID = this.state.selectedRowID;
    if(selectedRowID == rowID) {
      this.setState({ selectedRowID: null })
    }
    else if(selectedRowID != rowID) {
      this.setState({selectedRowID: rowID})
    }
    */
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
    this.props.navigator.push({
      title: "RouteDetails",
      component: RouteDetails,
      passProps: {
        routeDetails: route,
      }
    });
  };


  _renderRow(rowData: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {

    var route_id = rowData.route_id;
    var title = rowData.title;
    var description = rowData.description;

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
            </View>
          </View>
        </TouchableHighlight>
      </View>
    )
  };

  render() {
    return (
      <View style={styles.container}>

        <TouchableHighlight
          onPress={this.viewRouteMap.bind(this)}
          >
          <View style={styles.headerContainer}>

            <Text style={styles.mapBtn}>Map</Text>
          </View>
        </TouchableHighlight>
        <ListView
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
    marginTop: 65,
    flex: 1
  },
  headerContainer: {
    height: 30,
    //flex: 0.1,
    backgroundColor: "#FFF"
  },
  listviewContainer: {
    flex: 0.9
  },
  rowContainer: {
    flexDirection: 'row',
    //justifyContent: 'center',
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
