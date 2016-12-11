/**
 * @flow
 */

 var React = require('react');
 var ReactNative = require('react-native');
 var Login = require('./source/components/Login.js');

class Project extends React.Component {
  render() {
    return (
      <ReactNative.NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Login',
          component: Login
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
