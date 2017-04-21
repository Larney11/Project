/**
 * @flow
 */

 var React = require('react');
 var ReactNative = require('react-native');
 var Login = require('./source/components/Login.js');
 var RecordRouteMap = require('./source/components/RecordRouteMap.js');
 var RouteList = require('./source/components/RouteList.js');
 var RouteMap = require('./source/components/RouteMap.js');

class Project extends React.Component {
  render() {
    return (
      <ReactNative.NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'RecordRouteMap',
          component: RecordRouteMap
        }}/>
    );
  }
}

var styles = ReactNative.StyleSheet.create({
  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
  },
  container: {
    flex: 1
  }
});


ReactNative.AppRegistry.registerComponent('Project', function() { return Project });
