/*
 *
 *
 */

(function(global) {

var Observers = {};

global.AppDispatcher = {

   dispatch: function(event) {

      var args = [];
      var numOfArgs = arguments.length;

      for(var i=0; i<numOfArgs; i++) {
         args.push(arguments[i]);
      }

      args = args.length > 1 ? args.splice(1, args.length-1) : [];

      if(typeof Observers[event] != "undefined") {

         var numOfCallbacks = Observers[event].length;

         for(var i=0; i<numOfCallbacks; i++) {

            var observer = Observers[event][i];
            if(observer && observer.callback) {
               var concatArgs = args.concat(observer.args);
               observer.callback.apply(observer.scope, concatArgs);
            }
         }
      }
   },

   addEventListener: function (event, callback) {

      var args = [];
      var numOfArgs = arguments.length;

      for(var i=0; i<numOfArgs; i++) {
         args.push(arguments[i]);
      }

      args = args.length > 2 ? args.splice(2, args.length-1) : [];

      if(typeof(Observers[event] == "undefined")) {

         return (Observers[event] = [{ callback:callback, args:args }]);
      }
      else {

         return (Observers[event].push({ callback:callback, args:args }));
      }
   }
}

})(typeof window === 'undefined' ? this : window);
