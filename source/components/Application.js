import {
  StackNavigator,
} from 'react-navigation';


var Login = require('./source/components/Login.js');
var RecordRouteMap = require('./source/components/RecordRouteMap.js');
var RouteList = require('./source/components/RouteList.js');
var RouteMap = require('./source/components/RouteMap.js');
var RegisterUser = require('./source/components/RegisterUser.js');


const App = StackNavigator({
  Main: {screen: MainScreen},
  RecordRouteMap: {screen: RecordRouteMap},
});


class MainScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Button
        title="Go to Jane's profile"
        onPress={() =>
          navigate('RecordRouteMap', { name: 'Jane' });
        }
      />
    );
  }
}
