testCase = require('nodeunit').testCase

module.exports = testCase({
    setUp: (callback) ->
        this.foo = 'bar'
        callback()
    tearDown: (callback) ->
        callback();
    test1: (test) ->
        test.equals(this.foo, 'bar')
        test.done()
});