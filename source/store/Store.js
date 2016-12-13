/**
 *
 */

(function(global) {

  var React = require('react');
  var ReactNative = require('react-native');
  var {
     AsyncStorage,
  } = ReactNative;


var Store = function() {};

module.exports = {

   login: function(username, password) {

      return new Promise((RESOLVE, REJECT) => {

        var form = new FormData();
        form.append('username', username);
        form.append('password', password);

        fetch("http://localhost/login.php",
         {
            method: 'POST',
            body: form
         }).then((response) => {

           response.json().then((respObj) => {

             if(respObj.status == 404) {

               return REJECT(false);
             }
             else if(respObj.status == 200){

               return RESOLVE(true);
             };
           });
         }, (error) =>{
            return REJECT(error);
         });
      });
   },

};

})(typeof window === 'undefined' ? this : window);
