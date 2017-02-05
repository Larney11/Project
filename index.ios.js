/**
 * @flow
 */

 var React = require('react');
 var ReactNative = require('react-native');
 var Login = require('./source/components/Login.js');
 var MapV = require('./source/components/MapV.js');
 var RouteList = require('./source/components/RouteList.js');
 var Clock = require('./source/components/Clock.js');
 var AnimatedViews = require('./source/components/test/AnimatedViews.js');


class Project extends React.Component {
  render() {
    return (
      <ReactNative.NavigatorIOS
        style={styles.container}
        initialRoute={{
          //title: 'Login',
          //component: Login
          title: 'MapV',
          component: MapV
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
