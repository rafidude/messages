(function() {
  exports.testSomething = function(test) {
    test.expect(1);
    test.ok(true, "this assert should pass");
    return test.done();
  };
  exports.testSomethingElse = function(test) {
    test.ok(false, "this assert should fail");
    return test.done();
  };
}).call(this);
