redis = require "redis"
REDISTOGO_URL = 'redis://redistogo:50413146199119e2b7f2eca2c1e87f9e@catfish.redistogo.com:9465/'
if (process.env.REDISTOGO_URL)
  # redistogo connection
  rtg   = require("url").parse(REDISTOGO_URL)
  client = module.exports.client = redis.createClient(rtg.port, rtg.hostname)
  client.auth(rtg.auth.split(":")[1])
else
  client = module.exports.client = redis.createClient()

client.on "error", (err) ->
  console.log "Error " + err

# returns a object given the unique key
get = module.exports.get = (key, fn) ->
  client.get key, (err, obj_str) ->
    fn err, null if err
    object = JSON.parse obj_str
    fn null, object