express = require "express"
app = express.createServer(express.logger())

count = 0

messaging = require "./messaging"

app.get "/", (request, response) ->
  response.send "Hello IBG! Processed #{count} messages."

port = process.env.PORT or 3000
app.listen port, ->
  console.log "Listening on " + port