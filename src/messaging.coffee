db = require "./basedb"
client = db.client

processInterval = 4000
refreshChannelsInterval = 10000

sendMessageToUserMessageBox = (msgKey, userKey) ->
  client.sadd 'MB.' + userKey, msgKey, (err, result) ->
    console.log err if err

pushMessageToAllSubscribedUsersOfChannel = (msgKey, channel) ->
  channel.replace /^\s+|\s+$/g, ""
  client.smembers channel, (err, subscribed_users) ->
    # console.log "For channel #{channel} the subscribed users are #{subscribed_users}"
    for userKey in subscribed_users
      console.log "Sending message #{msgKey} to user #{userKey}" unless process.env.REDISTOGO_URL
      sendMessageToUserMessageBox msgKey, userKey

processMessage = (msgKey) ->
  client.hget msgKey, 'channels', (err, channelStr) ->
    console.log err if err
    return if err
    channels = channelStr.split(',') if channelStr
    for channel in channels
      pushMessageToAllSubscribedUsersOfChannel msgKey, channel

processMessageQueue = ->
  client.lpop 'messageQ', (err, msgKey) ->
    console.log err if err
    return if err
    return unless msgKey
    # console.log "Processing message: #{msgKey}"
    processMessage msgKey

addSubscribersToChannels = (sub) ->
  client.smembers sub, (err, subscribed_channels) ->
    for channel in subscribed_channels
      # console.log "Adding #{sub.substring(5)} to channel #{channel}"
      client.sadd channel, sub.substring(5)

refreshChannelsWithSubscribedUsers = ->
  client.keys "subs.user*", (err, subscriptions) ->
    console.log err if err
    return if err
    for sub in subscriptions
      addSubscribersToChannels sub

refreshChannelsWithSubscribedUsers()

setInterval ->
    console.log "Tick #{processInterval/1000} secs.."
    client.llen "messageQ", (err, count) ->
      while count > 0
        processMessageQueue()
        count -= 1
  , processInterval

setInterval ->
    console.log "Tick #{refreshChannelsInterval/1000} secs.."
    refreshChannelsWithSubscribedUsers()
  , refreshChannelsInterval