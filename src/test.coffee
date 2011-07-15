db = require "./basedb"
client = db.client

count = 6
while count -= 1
  client.lpop "messageQ"
client.del "c1"
client.del "c2"
client.del "c3"
client.del "MB.user#1"
client.del "MB.user#2"
client.del "MB.user#3"
key = 'M#1'
client.hset key, 'from', "user#1"
client.hset key, 'title', "Dummy title"
client.hset key, 'description', "Dummy message description"
client.hset key, 'channels', "c2, c3"

setInterval ->
    console.log "Tick 1 secs.."
    client.sadd "subs.user#2", "c2"
    client.sadd "subs.user#3", "c3"
    client.rpush "messageQ", "M#1"
    process.exit(0) 
  , 1000