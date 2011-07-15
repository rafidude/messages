redis = require "redis"
# REDISTOGO_URL = 'redis://redistogo:340cd13dbde7f93e1cf84a4e440ffa01@catfish.redistogo.com:9487/'
REDISTOGO_URL = process.env.REDISTOGO_URL
if (REDISTOGO_URL)
  # redistogo connection
  rtg   = require("url").parse(REDISTOGO_URL)
  client = module.exports.client = redis.createClient(rtg.port, rtg.hostname)
  console.log "Connected to RedisToGo instance..."
  client.auth(rtg.auth.split(":")[1])
else
  client = module.exports.client = redis.createClient()

client.on "error", (err) ->
  console.log "Error " + err
