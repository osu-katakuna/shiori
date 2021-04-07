const defaultConfiguration = {
  channels: [
    {
      type: "public",
      name: "osu",
      description: "osu! main channel.",
      autojoin: true
    },
    {
      type: "public",
      name: "announce",
      description: "Announcements channel.",
      autojoin: true
    },
    {
      type: "public",
      name: "lobby",
      description: "Multiplayer Lobby.",
      autojoin: false
    },
    {
      type: "permission",
      name: "admin",
      description: "Administration area.",
      autojoin: true,
      permissionRequired: "admin.*"
    },
  ]
};

const ConfigManager = new (require("../ConfigManager"))("channels", defaultConfiguration);
var RegisteredChannels = [];
var Logger = require('../Logger');

const ChannelType = {
  PUBLIC_CHANNEL: 0,
  PROTECTED_CHANNEL: 1,
  RESERVED_CHANNEL: 2
}

const MAXIMUM_CACHE_LENGTH = 100;

class Channel {
  constructor() {
    this.name = null;
    this.type = ChannelType.PUBLIC_CHANNEL;
    this._description = null;
    this._members = [];
    this.permissionRequired = null;
    this.messageCache = [];
    this._mid = 1;

    this.autoJoin = false;
  }

  get description() {
    return this._description == null ? "no description provided" : this._description;
  }

  set description(x) {
    this._description = x == null ? null : x;
  }

  get members() {
    return this._members.filter((i, pos, self) => self.indexOf(i) == pos).map(i => require("../TokenManager").FindTokenUserID(i)).filter(u => u != undefined); // do checks if the tokens do still exist and remove duplicates
  }

  get memberCount() {
    return this.members.length;
  }

  SendMessage(from, message) {
    if(this.messageCache.length + 1 > MAXIMUM_CACHE_LENGTH) {
      this.messageCache = this.messageCache.slice(1); // remove first message make sure to keep max objects son
    }
    const md = {
      from,
      message,
      id: this._mid++,
      time: new Date()
    };
    this.messageCache.push(md);
    this.members.filter(m => m.user.id !== from.id).forEach(t => t.Message(from, this.name, message, md.id, md.time));
  }

  Join(who) {
    if(this._members.includes(who.id)) { // check if the ID isn't joined already...
      return;
    }
    this._members.push(who.id);
  }

  Leave(who) {
    Logger.Info(`${who.name} left ${this.name}`);
    this._members = this._members.filter(x => x != who.id);
  }
}

class SpectatorChannel extends Channel {
  constructor(player = null) {
    super();
    this.name = "#spectator";
    this.type = ChannelType.RESERVED_CHANNEL;
    this._description = "Spectator channel.";
    this.spectatedPlayer = player;
  }

  get members() {
    return this.spectatedPlayer.Token.mySpectators.map(s => s.user).concat(this.spectatedPlayer).map(i => i.Token).filter(u => u != undefined); // do checks if the tokens do still exist
  }
}

class MultiplayerChannel extends Channel {
  constructor(match = null) {
    super();
    this.name = "#multiplayer";
    this.type = ChannelType.RESERVED_CHANNEL;
    this._description = "Multiplayer room channel.";
    this.match = match;
  }

  get members() {
    return this.match.slots.filter(slot => slot.status & 124).map(s => s.player).filter(u => u != undefined);
  }
}

function GetChannel(channel) {
  return RegisteredChannels.filter(c => c.type != ChannelType.RESERVED_CHANNEL && c.name == channel)[0];
}

function GetSpectatorChannelFor(who) {
  return RegisteredChannels.filter(c => c instanceof SpectatorChannel && c.spectatedPlayer === who)[0];
}

function RegisterSpectatorChannel(who) {
  Logger.Info(`CHANNEL MANAGER: Created spectator channel for user ${who.name}`);
  RegisteredChannels.push(new SpectatorChannel(who));
}

function DestroySpectatorChannel(who) {
  Logger.Info(`CHANNEL MANAGER: Destroyed spectator channel of user ${who.name}`);
  GetSpectatorChannelFor(who).members.forEach(m => m.KickChannel("#spectator"));
  who.Token.KickChannel("#spectator");
  RegisteredChannels = RegisteredChannels.filter(c => c instanceof SpectatorChannel && c.spectatedPlayer !== who);
}

function GetMultiplayerChannelFor(match) {
  return RegisteredChannels.filter(c => c instanceof MultiplayerChannel && c.match === match)[0];
}

function RegisterMultiplayerChannel(match) {
  Logger.Info(`CHANNEL MANAGER: Created Multiplayer channel for match #${match.id}`);
  RegisteredChannels.push(new MultiplayerChannel(match));
}

function DestroyMultiplayerChannel(match) {
  Logger.Info(`CHANNEL MANAGER: Destroyed Multiplayer channel of match #${match.id}`);
  RegisteredChannels = RegisteredChannels.filter(c => c instanceof MultiplayerChannel && c.match.id == match.id);
}

function JoinChannel(channel, who) {
  const TokenManager = require("../TokenManager");

  channel[0] != "#" && (channel = `#${channel}`);

  if(channel == "#spectator" && who.spectatedUser != null) {
    TokenManager.InformChannelChange(channel);
    TokenManager.JoinedUserChannel(who.id, channel);
    return;
  }

  if(channel == "#multiplayer" && who.inMatch) {
    TokenManager.InformChannelChange(channel);
    TokenManager.JoinedUserChannel(who.id, channel);
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

  if(channel[0] != "#") {
    return;
  }

  if(channel == "#spectator") {
    TokenManager.InformChannelChange(channel);
    return;
  }

  if(channel == "#multiplayer") {
    TokenManager.InformChannelChange(channel);
    return;
  }

  var ch = GetChannel(channel);

  if(ch == null) {
    Logger.Failure(`CHANNEL MANAGER: ${who.name} tried to leave an inexistent channel(WTF?): ${channel}`);
    return;
  }

  ch.Leave(who);
  TokenManager.InformChannelChange(channel);

  Logger.Success(`CHANNEL MANAGER: ${who.name} left ${channel}.`);
}

function SendMessage(to, by, message) {
  const TokenManager = require("../TokenManager");
  const PluginManager = require("../PluginManager");

  if(to[0] != "#") {
    return;
  }

  if(to == "#spectator") {
    const ch = by.Token.spectatedUser == null ? GetSpectatorChannelFor(by) : GetSpectatorChannelFor(by.Token.spectatedUser);
    const name = by.Token.spectatedUser == null ? by.name : by.Token.spectatedUser.name;

    if(ch != null) {
      Logger.Info(`CHANNEL MANAGER: ${by.name} => SPECTATOR(${name}): ${message}`);
      if(!PluginManager.CallHook("onPublicMessage", ch, by, message)) {
        ch.SendMessage(by, message);
      }
      else Logger.Info(`CHANNEL MANAGER: A plugin managed the message. The message will be not sent over.`);

      return;
    }
  }

  if(to == "#multiplayer") {
    const ch = RegisteredChannels.filter(i => i instanceof MultiplayerChannel && i.match.id == by.Token.matchID)[0];

    if(ch != null) {
      Logger.Info(`CHANNEL MANAGER: ${by.name} => MULTIPLAYER(MP#${ch.match.id}): ${message}`);
      if(!PluginManager.CallHook("onPublicMessage", ch, by, message)) {
        ch.SendMessage(by, message);
      }
      else Logger.Info(`CHANNEL MANAGER: A plugin managed the message. The message will be not sent over.`);

      return;
    }
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
  if(!PluginManager.CallHook("onPublicMessage", ch, by, message)) {
    ch.SendMessage(by, message);
  }
  else Logger.Info(`CHANNEL MANAGER: A plugin managed the message. The message will be not sent over.`);
}

function GetAllChannels(who = null) {
  return RegisteredChannels.map(c => {
    if(c.type == ChannelType.RESERVED_CHANNEL || (c.type == ChannelType.PROTECTED_CHANNEL && c.permissionRequired != null && who != null && !who.hasPermission(c.permissionRequired))) {
      return;
    }
    return c;
  }).filter(x => x != undefined);
}

function GetJoinedChannelsOfUser(who = null) {
  if(who == null) { 
    return;
  }

  return RegisteredChannels.filter(x => x.members.filter(m => m != null && m.id == who.id).length > 0);
}

function RegisterChannels() {
  ConfigManager.channels.forEach(c => {
    var newC = new Channel();

    newC.type = c.type.toLowerCase() == "public" ? ChannelType.PUBLIC_CHANNEL : (c.type.toLowerCase() == "permission" ? ChannelType.PROTECTED_CHANNEL : ChannelType.PUBLIC_CHANNEL);
    newC.name = c.name[0] != "#" ? `#${c.name}` : c.name;
    newC.description = c.description;
    newC.autoJoin = c.autojoin;
    newC.type == ChannelType.PROTECTED_CHANNEL && (newC.permissionRequired = c.permissionRequired);

    RegisteredChannels.push(newC);
    Logger.Info(`CHANNEL MANAGER: Registered channel ${newC.name}, type ${newC.type}`);
  });
}

RegisterChannels();

module.exports = {
  GetChannel,
  SendMessage,
  GetAllChannels,
  JoinChannel,
  LeaveChannel,
  GetJoinedChannelsOfUser,
  GetSpectatorChannelFor,
  RegisterSpectatorChannel,
  DestroySpectatorChannel,
  GetMultiplayerChannelFor,
  RegisterMultiplayerChannel,
  DestroyMultiplayerChannel
};
