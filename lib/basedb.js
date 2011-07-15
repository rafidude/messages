(function() {
  var REDISTOGO_URL, client, redis, rtg;
  redis = require("redis");
  REDISTOGO_URL = process.env.REDISTOGO_URL;
  if (REDISTOGO_URL) {
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
