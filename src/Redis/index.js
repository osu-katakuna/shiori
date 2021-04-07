const util = require("util");

var Logger = require("../Logger");
var Redis = require("redis");
var ShioriConfig = require("../Shiori/ShioriConfig");

var ClientInstance = null;
var DatabaseInstance = null;
var SubscribedChannels = [];

function OnMessageEvent(channel, args) {
  Logger.Info(`Redis Message on channel '${channel}': ${args}`);
  SubscribedChannels.filter(x => x.channel == channel).forEach(s => s.callback(args));
}

function Publish(channel, args) {
  ClientInstance.publish(channel, args);
}

function ErrorHandler(err) {
  Logger.Failure("REDIS:", err);
}

function Start() {
  if(ShioriConfig.redis.enabled == null || ShioriConfig.redis.enabled == false) return;

  ClientInstance = Redis.createClient({
    host: ShioriConfig.redis.host,
    port: ShioriConfig.redis.port,
    password: ShioriConfig.redis.password == null || ShioriConfig.redis.password.length < 1 ? undefined : ShioriConfig.redis.password,
  });

  DatabaseInstance = ClientInstance.duplicate();

  ClientInstance.on("error", ErrorHandler);
  DatabaseInstance.on("error", ErrorHandler);

  ClientInstance.on("message", OnMessageEvent);
  DatabaseInstance.on("message", OnMessageEvent);

  ClientInstance.on("subscribe", function(channel, count) {
    Logger.Info(`Subscribed Redis Channel '${channel}'.`);
  });

  ClientInstance.on("unsubscribe", function(channel, count) {
    Logger.Info(`Unsubscribed Redis Channel '${channel}'.`);
    SubscribedChannels = SubscribedChannels.filter(x => x.channel != channel);
  });

  DatabaseInstance.monitor(function(err, res) {
    console.log("Entering monitoring mode.");
  });
}

function UnsubscribeChannel(channel) {
  ClientInstance.unsubscribe(channel);
}

function SubscribeToChannel(channel, callback) {
  if(ShioriConfig.redis.enabled == null || ShioriConfig.redis.enabled == false) return;

  if(SubscribedChannels.filter(x => x.channel == channel).length == 0) ClientInstance.subscribe(channel);
  SubscribedChannels.push({channel, callback});
}

async function Set(what, value) {
  if(ShioriConfig.redis.enabled == null || ShioriConfig.redis.enabled == false) return;

  return await util.promisify(DatabaseInstance.set).bind(DatabaseInstance)(what, value);
}

async function Get(what) {
  if(ShioriConfig.redis.enabled == null || ShioriConfig.redis.enabled == false) return;

  return await util.promisify(DatabaseInstance.get).bind(DatabaseInstance)(what);
}

module.exports = {
  Start,
  ClientInstance,
  SubscribeToChannel,
  UnsubscribeChannel,
  Set,
  Get,
  Publish
};
