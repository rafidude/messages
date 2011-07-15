(function() {
  var app, count, express, messaging, port;
  express = require("express");
  app = express.createServer(express.logger());
  count = 0;
  messaging = require("./messaging");
  app.get("/", function(request, response) {
    return response.send("Hello IBG! Processed " + count + " messages.");
  });
  port = process.env.PORT || 3000;
  app.listen(port, function() {
    return console.log("Listening on " + port);
  });
}).call(this);
