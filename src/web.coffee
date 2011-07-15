express = require("express")
app = express.createServer(express.logger())
count = 0

setInterval ->
    count += 1
  , 1000
    
app.get "/", (request, response) ->
  response.send "Hello IBG#{count}!"

port = process.env.PORT or 3000
app.listen port, ->
  console.log "Listening on " + port