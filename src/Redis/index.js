var Logger = require("../logging");
var Redis = require("redis");
var ShioriConfig = require("../shiori/ShioriConfig");

var ClientInstance = null;
var SubscribedChannels = [];

function OnMessageEvent(channel, args) {
  Logger.Info(`Redis Message on channel '${channel}': ${args}`);
  SubscribedChannels.filter(x => x.channel == channel).forEach(s => s.callback(args));
}

function ErrorHandler(err) {
  Logger.Failure("REDIS:", err);
}

function Start() {
  if(ShioriConfig.redis.enabled == null) return;

  ClientInstance = Redis.createClient({
    host: ShioriConfig.redis.host,
    port: ShioriConfig.redis.port,
    password: ShioriConfig.redis.password == null || ShioriConfig.redis.password.length < 1 ? undefined : ShioriConfig.redis.password,
  });

  ClientInstance.on("error", ErrorHandler);

  ClientInstance.on("message", OnMessageEvent);

  ClientInstance.on("subscribe", function(channel, count) {
    Logger.Info(`Subscribed Redis Channel '${channel}'.`);
  });

  ClientInstance.on("unsubscribe", function(channel, count) {
    Logger.Info(`Unsubscribed Redis Channel '${channel}'.`);
    SubscribedChannels = SubscribedChannels.filter(x => x.channel != channel);
  });
}

function UnsubscribeChannel(channel) {
  ClientInstance.unsubscribe(channel);
}

function SubscribeToChannel(channel, callback) {
  if(ShioriConfig.redis.enabled == null) return;

  if(SubscribedChannels.filter(x => x.channel == channel).length == 0) ClientInstance.subscribe(channel);
  SubscribedChannels.push({channel, callback});
}

module.exports = {
  Start,
  ClientInstance,
  SubscribeToChannel,
  UnsubscribeChannel
};
