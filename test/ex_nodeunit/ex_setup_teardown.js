(function() {
  var testCase;
  testCase = require('nodeunit').testCase;
  module.exports = testCase({
    setUp: function(callback) {
      this.foo = 'bar';
      return callback();
    },
    tearDown: function(callback) {
      return callback();
    },
    test1: function(test) {
      test.equals(this.foo, 'bar');
      return test.done();
    }
  });
}).call(this);
