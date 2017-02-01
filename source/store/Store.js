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
            //form.append('username', username);
            //form.append('password', password);
            form.append('username', 'Lar');
            form.append('password', '1234');

            fetch("http://localhost/login.php",
            {
               method: 'POST',
               body: form
            }).then((response) => {

               response.json().then((respObj) => {
                  console.log("-----------",respObj);

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


      uploadRoute: function(formData, routeCoordinates) {

         return new Promise((RESOLVE, REJECT) => {
            console.log("formData", formData);

            var form = new FormData();
            form.append('title', formData.Title);
            form.append('description', formData.Description);
            form.append('routeCoordinates', routeCoordinates);
            form.append('username', 'Lar');

            fetch("http://localhost/register_route.php",
            {
               method: 'POST',
               body: form
            }).then((response) => {

               response.json().then((respObj) => {
                  console.log("-----------",respObj);

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

};

})(typeof window === 'undefined' ? this : window);
