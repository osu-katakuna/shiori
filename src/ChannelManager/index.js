const defaultConfiguration = {
  channels: [
    {
      type: "public",
      name: "osu",
      description: "oss channel",
      autojoin: true
    },
    {
      type: "public",
      name: "announce",
      description: "announcement channel",
      autojoin: true
    },
    {
      type: "permission",
      name: "admin",
      description: "admin area",
      autojoin: true,
      permissionRequired: "admin.*"
    },
  ]
};

const ConfigManager = new (require("../ConfigManager"))("channels", defaultConfiguration);
var RegisteredChannels = [];
var Logger = require('../logging');

const ChannelType = {
  PUBLIC_CHANNEL: 0,
  PROTECTED_CHANNEL: 1
}

class Channel {
  constructor() {
    this.name = null;
    this.type = ChannelType.PUBLIC_CHANNEL;
    this._description = null;
    this._members = [];
    this.permissionRequired = null;

    this.autoJoin = true;
  }

  get description() {
    return this._description == null ? "no description provided" : this._description;
  }

  set description(x) {
    this._description = x == null ? null : x;
  }

  get members() {
    return this._members.map(i => require("../TokenManager").FindTokenUserID(i).user);
  }

  get memberCount() {
    return this._members.length;
  }

  SendMessage(from, message) {
    this._members.filter(i => i != from.id).map(i => require("../TokenManager").FindTokenUserID(i)).forEach(t => t.Message(from, this.name, message))
  }

  Join(who) {
    this._members.push(who.id);
  }

  Leave(who) {
    this._members = this._members.filter(x => x != who.id);
  }
}

function GetChannel(channel) {
  return RegisteredChannels.filter(c => c.name == channel)[0];
}

function JoinChannel(channel, who) {
  const TokenManager = require("../TokenManager");

  if(channel[0] != "#") to = `#${channel}`;

  if(channel == "#spectator") {
    Logger.Failure(`CHANNEL MANAGER: ${who.name} tried to join the spectator channel. This is not handled YET!`);
    TokenManager.KickUserFromChannel(who.id, channel);
    return;
  }

  var ch = GetChannel(channel);

  if(ch == null) {
    Logger.Failure(`CHANNEL MANAGER: ${who.name} tried to join an inexistent channel: ${channel}`);
    TokenManager.KickUserFromChannel(who.id, channel);
    return;
  }

  if(ch.type == ChannelType.PROTECTED_CHANNEL && ch.permissionRequired != null && !who.hasPermission(ch.permissionRequired)) {
    Logger.Failure(`CHANNEL MANAGER: ${who.name} tried to join ${channel}, but it doesn't have the rights to do so.`);
    TokenManager.KickUserFromChannel(who.id, channel);
    return;
  }

  ch.Join(who);
  TokenManager.InformChannelChange(channel);
  TokenManager.JoinedUserChannel(who.id, channel);

  Logger.Success(`CHANNEL MANAGER: ${who.name} joined ${channel}.`);
}

function LeaveChannel(channel, who) {
  const TokenManager = require("../TokenManager");

  if(channel[0] != "#") return;

  if(channel == "#spectator") {
    Logger.Failure(`CHANNEL MANAGER: ${who.name} tried to leave the spectator channel. This is not handled YET!`);
    return;
  }

  var ch = GetChannel(channel);

  if(ch == null) {
    Logger.Failure(`CHANNEL MANAGER: ${who.name} tried to leave an inexistent channel(WTF?): ${to}`);
    return;
  }

  ch.Leave(who);
  TokenManager.InformChannelChange(channel);

  Logger.Success(`CHANNEL MANAGER: ${who.name} left ${channel}.`);
}

function SendMessage(to, by, message) {
  const TokenManager = require("../TokenManager");

  if(to[0] != "#") return;

  if(to == "#spectator") {
    Logger.Failure(`CHANNEL MANAGER: ${by.name} tried to send an message to the spectator channel. This is not handled YET!`);
    return;
  }

  var ch = GetChannel(to);

  if(ch == null) {
    Logger.Failure(`CHANNEL MANAGER: ${by.name} tried to send an message on ${to}, but the channel doesn't exist.`);
    return;
  }

  if(ch.type == ChannelType.PROTECTED_CHANNEL && ch.permissionRequired != null && !by.hasPermission(ch.permissionRequired)) {
    Logger.Failure(`${by.name} tried to send an message on ${to}, but it doesn't have the rights to do so.`);
    return;
  }

  Logger.Info(`CHANNEL MANAGER: ${by.name} => ${to}: ${message}`);
  ch.SendMessage(by, message);
}

function GetAllChannels(who = null) {
  return RegisteredChannels.map(c => {
    if(c.type == ChannelType.PROTECTED_CHANNEL && c.permissionRequired != null && who != null && !who.hasPermission(c.permissionRequired)) return;
    return c;
  }).filter(x => x != undefined);
}

function RegisterChannels() {
  ConfigManager.channels.forEach(c => {
    var newC = new Channel();

    newC.type = c.type.toLowerCase() == "public" ? ChannelType.PUBLIC_CHANNEL : (c.type.toLowerCase() == "permission" ? ChannelType.PROTECTED_CHANNEL : ChannelType.PUBLIC_CHANNEL);
    newC.name = c.name[0] != "#" ? `#${c.name}` : c.name;
    newC.description = c.description;
    newC.autoJoin = c.autojoin;
    if(newC.type == ChannelType.PROTECTED_CHANNEL) newC.permissionRequired = c.permissionRequired;

    RegisteredChannels.push(newC);
    Logger.Info(`CHANNEL MANAGER: Registered channel ${newC.name}, type ${newC.type}`);
  });
}

RegisterChannels()

module.exports = {
  GetChannel,
  SendMessage,
  GetAllChannels,
  JoinChannel,
  LeaveChannel
};
