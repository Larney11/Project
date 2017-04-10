/*
 *
 */

module.exports = function Message(init) {

  var data = init || {};

  return {

    get: function(field) {

      return data[field];
    }
  };
};
