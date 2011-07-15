redis = require "redis"
# REDISTOGO_URL = 'redis://redistogo:140cb62ce4f977d55422275a87e7f9e8@catfish.redistogo.com:9487/'
REDISTOGO_URL = process.env.REDISTOGO_URL
if (REDISTOGO_URL)
  # redistogo connection
  rtg   = require("url").parse(REDISTOGO_URL)
  client = module.exports.client = redis.createClient(rtg.port, rtg.hostname)
  client.auth(rtg.auth.split(":")[1])
else
  client = module.exports.client = redis.createClient()

client.on "error", (err) ->
  console.log "Error " + err
