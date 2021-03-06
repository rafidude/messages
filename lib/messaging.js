(function() {
  var addSubscribersToChannels, client, db, processInterval, processMessage, processMessageQueue, pushMessageToAllSubscribedUsersOfChannel, refreshChannelsInterval, refreshChannelsWithSubscribedUsers, sendMessageToUserMessageBox;
  db = require("./basedb");
  client = db.client;
  processInterval = 4000;
  refreshChannelsInterval = 10000;
  sendMessageToUserMessageBox = function(msgKey, userKey) {
    return client.sadd('MB.' + userKey, msgKey, function(err, result) {
      if (err) {
        return console.log(err);
      }
    });
  };
  pushMessageToAllSubscribedUsersOfChannel = function(msgKey, channel) {
    channel = channel.replace(/^\s+|\s+$/g, "");
    return client.smembers(channel, function(err, subscribed_users) {
      var userKey, _i, _len, _results;
      if (err) {
        console.log(err);
      }
      if (err) {
        return;
      }
      _results = [];
      for (_i = 0, _len = subscribed_users.length; _i < _len; _i++) {
        userKey = subscribed_users[_i];
        _results.push(sendMessageToUserMessageBox(msgKey, userKey));
      }
      return _results;
    });
  };
  processMessage = function(msgKey) {
    return client.hget(msgKey, 'channels', function(err, channelStr) {
      var channel, channels, _i, _len, _results;
      if (err) {
        console.log(err);
      }
      if (err) {
        return;
      }
      if (channelStr) {
        channels = channelStr.split(',');
      }
      _results = [];
      for (_i = 0, _len = channels.length; _i < _len; _i++) {
        channel = channels[_i];
        _results.push(pushMessageToAllSubscribedUsersOfChannel(msgKey, channel));
      }
      return _results;
    });
  };
  processMessageQueue = function() {
    return client.lpop('messageQ', function(err, msgKey) {
      if (err) {
        console.log(err);
      }
      if (err) {
        return;
      }
      if (!msgKey) {
        return;
      }
      console.log("Processing message: " + msgKey);
      return processMessage(msgKey);
    });
  };
  addSubscribersToChannels = function(sub) {
    return client.smembers(sub, function(err, subscribed_channels) {
      var channel, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = subscribed_channels.length; _i < _len; _i++) {
        channel = subscribed_channels[_i];
        _results.push(client.sadd(channel, sub.substring(5)));
      }
      return _results;
    });
  };
  refreshChannelsWithSubscribedUsers = function() {
    return client.keys("subs.user*", function(err, subscriptions) {
      var sub, _i, _len, _results;
      if (err) {
        console.log(err);
      }
      if (err) {
        return;
      }
      _results = [];
      for (_i = 0, _len = subscriptions.length; _i < _len; _i++) {
        sub = subscriptions[_i];
        _results.push(addSubscribersToChannels(sub));
      }
      return _results;
    });
  };
  refreshChannelsWithSubscribedUsers();
  setInterval(function() {
    console.log("Tick " + (processInterval / 1000) + " secs..");
    return client.llen("messageQ", function(err, count) {
      var _results;
      _results = [];
      while (count > 0) {
        processMessageQueue();
        _results.push(count -= 1);
      }
      return _results;
    });
  }, processInterval);
  setInterval(function() {
    console.log("Tick " + (refreshChannelsInterval / 1000) + " secs..");
    return refreshChannelsWithSubscribedUsers();
  }, refreshChannelsInterval);
}).call(this);
