(function() {
  var REDISTOGO_URL, client, redis, rtg;
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
}).call(this);
