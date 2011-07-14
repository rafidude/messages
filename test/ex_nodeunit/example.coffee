exports.testSomething = (test)->
  test.expect 1
  test.ok true, "this assert should pass"
  test.done()

exports.testSomethingElse = (test)->
  test.ok false, "this assert should fail"
  test.done()
