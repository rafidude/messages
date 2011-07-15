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

setInterval ->
    console.log "Tick 1 secs.."
    client.rpush "messageQ", "M#1"
    client.rpush "messageQ", "M#2"
    process.exit(0) 
  , 1000