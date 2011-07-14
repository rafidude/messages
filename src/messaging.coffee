db = require "./basedb"
client = db.client

processInterval = 2000
refreshChannelsInterval = 8000

processMessage = (msgKey) ->
  client.hget msgKey, 'channels', (err, channelStr) ->
    console.log err if err
    console.log channelStr if not err
    channels = channelStr.split(',')
    for channel in channels
      channel.replace /^\s+|\s+$/g, ""
      console.log 'Channel: ' + channel
      client.smembers channel, (err, subscribed_users) ->
        console.log 'subscribed_users: ' + subscribed_users
        for user_key in subscribed_users
          client.sadd 'MB.' + user_key, msgKey, (err, result) ->
            console.log err if err

processQueue = ->
  client.lpop 'messageQ', (err, msgKey) ->
    console.log err if err
    return if err
    return unless msgKey
    console.log msgKey
    processMessage msgKey

refreshChannelsWithSubscribedUsers = ->
  client.keys "subs.user*", (err, subscriptions) ->
    console.log err if err
    return if err
    console.log subscriptions
    for sub in subscriptions
      userKey = sub.substring(5)
      console.log userKey
      client.smembers sub, (err, subscribed_channels) ->
        for channel in subscribed_channels
          client.sadd channel, userKey

# processQueue()
refreshChannelsWithSubscribedUsers()

# setInterval ->
#     processQueue()
#   , processInterval
# 
# setInterval ->
#     refreshChannelsWithSubscribedUsers()
#   , refreshChannelsInterval