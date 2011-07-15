(function() {
  var app, count, express, messaging, port;
  express = require("express");
  app = express.createServer(express.logger());
  messaging = require("./messaging");
  count = 0;
  setInterval(function() {
    return count += 1;
  }, 1000);
  app.get("/", function(request, response) {
    return response.send("Hello IBG" + count + "!");
  });
  port = process.env.PORT || 3000;
  app.listen(port, function() {
    return console.log("Listening on " + port);
  });
}).call(this);
