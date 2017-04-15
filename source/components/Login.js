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
  TouchableHighlight
} from 'react-native'

var windowSize = Dimensions.get('window');
var Store = require('../store/Store.js');
var RecordRouteMap = require('./RecordRouteMap.js');

class Login extends React.Component {

   constructor(props) {

      super(props);
      this.state = {
         username: "",
         password: "",
         errorText: "",
         showErrorText: false
      }
   };

   onLoginPressed() {

      var username = this.state.username;
      var password = this.state.password;
      if((username == "") || (password == "")) {

         this.setState({
            errorText: "Must enter username and password.",
            showErrorText: true
         });
      }
      else {

         Store.login(username, password).then((success) => {

            this.setState({
               errorText: "",
               showErrorText: false
            });
            this.props.navigator.push({
               title: "RecordRouteMap",
               component: RecordRouteMap
            });
         },(reason) => {
            this.setState({
               errorText: "Incorrect username or password.",
               showErrorText: true
            });
         });
      };
   };


   focusNextField = (nextField) => {
      this.refs[nextField].focus();
   };


   _renderErrorMessage() {

      if(this.state.showErrorText) {

         return (
            <Text style={styles.errorText}>{this.state.errorText}</Text>
         )
      }
      else {
         null;
      }
   };


   render() {

      return (
         <View style={styles.container}>

         <Image style={styles.background} source={require('../../Resources/img/loginBackground.jpg')} />
            <View style={styles.header}>

               <Image style={styles.mark} source={require('../../Resources/img/running-feet.jpg')} />
            </View>
            <View style={styles.inputs}>

               <View style={styles.inputContainer}>

                  <TextInput
                     ref="1"
                     style={styles.singleLine}
                     placeholder="User"
                     onChangeText={(username) => this.setState({username})}
                     value = {this.state.username}
                     returnKeyType="next"
                     blurOnSubmit={false}
                     onSubmitEditing={() => this.focusNextField('2')}
                  />
               </View>
               <View style={styles.inputContainer}>

                  <TextInput
                     ref="2"
                     style={styles.singleLine}
                     placeholder="Password"
                     onChangeText={(password) => this.setState({password})}
                     value = {this.state.password}
                     returnKeyType="next"
                     blurOnSubmit={false}
                     onSubmitEditing={() => this.focusNextField('2')}
                  />
               </View>
               {this._renderErrorMessage()}
               <View style={styles.forgotContainer}>

                  <Text style={styles.greyFont}>Forgot Password</Text>
               </View>
            </View>
            <TouchableHighlight style={styles.button}
               underlayColor='#70db70'
               onPress={this.onLoginPressed.bind(this)}
            >
               <View style={styles.signin}>

                  <Text style={styles.whiteFont}>Sign In</Text>
               </View>
            </TouchableHighlight>
            <View style={styles.signup}>

               <Text style={styles.greyFont}>"Don't have an account?"<Text style={styles.whiteFont}>  Sign Up</Text></Text>
            </View>
         </View>
      );
   };
};


var styles = StyleSheet.create({
   container: {
      flexDirection: 'column',
      flex: 1,
      backgroundColor: 'transparent'
   },
   background: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: windowSize.width,
      height: windowSize.height
   },
   header: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: .5,
      backgroundColor: 'transparent'
   },
   mark: {
      width: 150,
      height: 150
   },
   signin: {
      backgroundColor: '#FF3366',
      padding: 20,
      alignItems: 'center'
   },
   signup: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: .15
   },
   inputs: {
      marginTop: 10,
      marginBottom: 10,
      flex: .25
   },
   inputPassword: {
      //marginLeft: 15,
      width: 20,
      height: 21
   },
   inputUsername: {
      //marginLeft: 15,
      width: 20,
      height: 20
   },
   inputContainer: {
      padding: 10,
      borderWidth: 1,
      borderBottomColor: '#CCC',
      borderColor: 'transparent',
      backgroundColor: 'white'
   },
   input: {
      position: 'absolute',
      left: 61,
      top: 12,
      right: 0,
      height: 20,
      fontSize: 14
   },
   forgotContainer: {
      alignItems: 'flex-end',
      padding: 15,
   },
   greyFont: {
      color: '#D8D8D8'
   },
   singleLine: {
      fontSize: 16,
      padding: 4,
      height: 20,
      backgroundColor: 'white',
   },
   errorText: {
      color: "#e62e00", //red
      fontSize: 14,
      paddingLeft: 15,
      paddingTop: 5
    }
})

module.exports = Login;
