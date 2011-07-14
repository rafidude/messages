(function() {
  var client, db, processInterval, processMessage, processQueue, refreshChannelsInterval, refreshChannelsWithSubscribedUsers;
  db = require("./basedb");
  client = db.client;
  processInterval = 2000;
  refreshChannelsInterval = 8000;
  processMessage = function(msgKey) {
    return client.hget(msgKey, 'channels', function(err, channelStr) {
      var channel, channels, _i, _len, _results;
      if (err) {
        console.log(err);
      }
      if (!err) {
        console.log(channelStr);
      }
      channels = channelStr.split(',');
      _results = [];
      for (_i = 0, _len = channels.length; _i < _len; _i++) {
        channel = channels[_i];
        channel.replace(/^\s+|\s+$/g, "");
        console.log('Channel: ' + channel);
        _results.push(client.smembers(channel, function(err, subscribed_users) {
          var user_key, _j, _len2, _results2;
          console.log('subscribed_users: ' + subscribed_users);
          _results2 = [];
          for (_j = 0, _len2 = subscribed_users.length; _j < _len2; _j++) {
            user_key = subscribed_users[_j];
            _results2.push(client.sadd('MB.' + user_key, msgKey, function(err, result) {
              if (err) {
                return console.log(err);
              }
            }));
          }
          return _results2;
        }));
      }
      return _results;
    });
  };
  processQueue = function() {
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
      console.log(msgKey);
      return processMessage(msgKey);
    });
  };
  refreshChannelsWithSubscribedUsers = function() {
    return client.keys("subs.user*", function(err, subscriptions) {
      var sub, userKey, _i, _len, _results;
      if (err) {
        console.log(err);
      }
      if (err) {
        return;
      }
      console.log(subscriptions);
      _results = [];
      for (_i = 0, _len = subscriptions.length; _i < _len; _i++) {
        sub = subscriptions[_i];
        userKey = sub.substring(5);
        console.log(userKey);
        _results.push(client.smembers(sub, function(err, subscribed_channels) {
          var channel, _j, _len2, _results2;
          _results2 = [];
          for (_j = 0, _len2 = subscribed_channels.length; _j < _len2; _j++) {
            channel = subscribed_channels[_j];
            _results2.push(client.sadd(channel, userKey));
          }
          return _results2;
        }));
      }
      return _results;
    });
  };
  refreshChannelsWithSubscribedUsers();
}).call(this);
