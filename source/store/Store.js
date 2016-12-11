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
        var username = "Lar";

        var form = new FormData();
        form.append('username', 'Lar');
        form.append('password', 1234);

        fetch("http://localhost/login.php",
         {
            method: 'POST',
            body: form
         }).then((response) => {

               response.json().then((respObj) => {
                  if(respObj.success == 1){

                     return RESOLVE(true);
                  };
               });
          //  }
         }, (error) =>{
            return REJECT(error);
         });
      });
   },

};

})(typeof window === 'undefined' ? this : window);
