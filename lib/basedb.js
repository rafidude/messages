(function() {
  var REDISTOGO_URL, client, get, redis, rtg;
  redis = require("redis");
  REDISTOGO_URL = 'redis://redistogo:50413146199119e2b7f2eca2c1e87f9e@catfish.redistogo.com:9465/';
  if (process.env.REDISTOGO_URL) {
    rtg = require("url").parse(REDISTOGO_URL);
    client = module.exports.client = redis.createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(":")[1]);
  } else {
    client = module.exports.client = redis.createClient();
  }
  client.on("error", function(err) {
    return console.log("Error " + err);
  });
  get = module.exports.get = function(key, fn) {
    return client.get(key, function(err, obj_str) {
      var object;
      if (err) {
        fn(err, null);
      }
      object = JSON.parse(obj_str);
      return fn(null, object);
    });
  };
}).call(this);
