/**
 *
 */

(function(global) {

  var React = require('react');
  var ReactNative = require('react-native');
  var {
    AsyncStorage,
  } = ReactNative;

  var Route = require('../class/Route.js')
  var Message = require('../class/Message.js')
  var config = require('../../config.json')

  var Store = function() {};

  module.exports = {

    postUserDetails(formData) {

      return new Promise((RESOLVE, REJECT) => {

        var form = new FormData();
        form.append('username', formData.Username);
        form.append('email', formData.email);
        form.append('name', "");
        form.append('dateOfBirth', "");
        form.append('gender', "");
        form.append('Weight', 0);
        form.append('height', 0);
        console.log("form", form);

        //fetch("http://localhost/users.php",
        fetch(config.hostURL+"/users.php",
        {
          method: 'POST',
          body: form
        }).then((response) => {

          console.log("response", response);

          response.json().then((respObj) => {

            if(respObj.status == 404) {

              return REJECT(false);
            }
            else if(respObj.status == 200) {

              return RESOLVE(true);
            };
          });
        }, (error) => {
          return REJECT(error);
        });
      });
    },


    postUpdateUserDetails(formData) {

      return new Promise((RESOLVE, REJECT) => {

        var form = new FormData();
        form.append('username', formData.Username);
        form.append('email', formData.email);
        form.append('name', formData.Name);
        form.append('dateOfBirth', formData.DateOfBirth);
        form.append('gender', formData.Gender);
        form.append('Weight', formData.WeightKg);
        form.append('height', formData.HeightCm);
        console.log("form", form);

        fetch(config.hostURL+"/updateUser.php",
        {
          method: 'POST',
          body: form
        }).then((response) => {

          console.log("response", response);

          response.json().then((respObj) => {


            if(respObj.status == 404) {

              return REJECT(false);
            }
            else if(respObj.status == 200) {

              return RESOLVE(true);
            };
          });
        }, (error) => {
          return REJECT(error);
        });
      });
    },


    uploadRoute: function(email, username, formData, routeCoordinates, difficulty) {
      return new Promise((RESOLVE, REJECT) => {

        console.log("email---------->", email);
        console.log("email---------->", username);

        var jsonString = JSON.stringify(routeCoordinates);

        var form = new FormData();
        form.append('email', email);
        form.append('username', username);
        form.append('title', formData.Title);
        form.append('description', formData.Description);
        form.append('address', formData.Address);
        form.append('distance', formData.DistanceKm);
        form.append('duration', formData.Duration);
        form.append('avg_speed', formData.AverageSpeedKmh);
        form.append('difficulty', difficulty);
        form.append('routeCoordinates', jsonString);

        fetch(config.hostURL+"/register_route.php",
        //fetch("http://localhost/register_route.php",
        {
          method: 'POST',
          body: form
        }).then((response) => {
          console.log("respObj", response);


          response.json().then((respObj) => {

            if(respObj.status == 404) {

              return REJECT(false);
            }
            else if(respObj.status == 200) {

              return RESOLVE(true);
            };
          });
        }, (error) => {

          return REJECT(error);
        });
      });
    },


    getRoutes: function() {

      return new Promise((RESOLVE, REJECT) => {

        fetch(config.hostURL+"/register_route.php?route_id=57",
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }).then((response) => {

          response.json().then((routes) => {
            console.log("getRoutes()routes", routes);

            var routesArray = [];
            for (var i = 0, len = routes.length; i < len; i++) {

              routesArray.push(new Route(routes[i]));
            };
            return RESOLVE(routesArray);
          });
        }, (error) => {

          return REJECT(error);
        });
      });
    },

    getRouteCoordinates: function(route_id) {

      return new Promise((RESOLVE, REJECT) => {

        //fetch("http://trackmyroute.azurewebsites.net/register_route.php?route="+route_id,
        fetch(config.hostURL+"/register_route.php?route="+route_id,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }).then((response) => {
          //console.log("getRouteCoordinates=======>", response);
          response.json().then((routes) => {

            var routesArray = [];
            for (var i = 0, len = routes.length; i < len; i++) {

              routesArray.push(new Route(routes[i]));
            };
            //console.log(routesArray);
            return RESOLVE(routesArray);
          });
        }, (error) => {

          return REJECT(error);
        });
      });
    },



    postRouteMessage: function(route_id, username, messageBody, datetime) {
      return new Promise((RESOLVE, REJECT) => {

        var form = new FormData();
        form.append('route_id', route_id);
        form.append('username', username);
        form.append('messageBody', messageBody);
        form.append('datetime', datetime);

        //fetch("http://localhost/messages.php",
        fetch(config.hostURL+"/messages.php",
        {
          method: 'POST',
          body: form
        }).then((response) => {
          //console.log("respObj", response);

          response.json().then((respObj) => {


            if(respObj.status == 404) {

              return REJECT(false);
            }
            else if(respObj.status == 200) {

              return RESOLVE(true);
            };
          });
        }, (error) => {
          return REJECT(error);
        });
      });
    },


    getRouteMessages: function(route_id) {

      return new Promise((RESOLVE, REJECT) => {

        //fetch("http://localhost/messages.php?route_id="+route_id,
        fetch(config.hostURL+"/messages.php?route_id="+route_id,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }).then((response) => {
          //console.log("getRouteMessages=======>response", response);

          response.json().then((messages) => {

            var messageArray = [];
            for (var i = 0, len = messages.length; i < len; i++) {

              messageArray.push(new Message(messages[i]));
            };
            return RESOLVE(messageArray);
          });
        }, (error) => {
          return REJECT(error);
        });
      });
    },


};

})(typeof window === 'undefined' ? this : window);
