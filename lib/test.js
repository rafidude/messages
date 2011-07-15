(function() {
  var client, db;
  db = require("./basedb");
  client = db.client;
  client.del("c1");
  client.del("c2");
  client.del("c3");
  client.del("MB.user#1");
  client.del("MB.user#2");
  client.del("MB.user#3");
  client.rpush("messageQ", "M#1");
  client.rpush("messageQ", "M#2");
  setInterval(function() {
    console.log("Tick 1 secs..");
    return process.exit(0);
  }, 1000);
}).call(this);
