/**
 *
 */

module.exports = function Route(init) {
   var data = init || {};

   return {

      get: function(field) {

         return data[field];
      }
   };
};
