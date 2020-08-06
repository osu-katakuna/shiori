const Packets = require('../BanchoEmulator/Packets');
const Logger = require('../logging');
const ChannelManager = require('../ChannelManager');

class Token {
  constructor(user, token) {
    this.user = user;
    this.queue = [];
    this.fakeBanchoBot = {
      id: 1,
      name: "BanchoBot"
    };
    this.token = token;
  }

  enqueue(packet) {
    this.queue.push(packet);
  }

  Message(from, where, message) {
    if(where == null) where = this.user.name;
    this.enqueue(Packets.ChatMessage(from, where, message));
  }

  Notify(message) {
    this.enqueue(Packets.Notification(message));
  }

  Kick(reason = "no reason provided", closeClient = false) {
    Logger.Failure(`${this.user.name} was kicked: ${reason}; close client: ${closeClient}`);
    this.abortLogin = true;
    this.enqueue(Packets.Notification(`You have been kicked from osu!katakuna for the following reason: ${reason}`));
    if(closeClient) this.enqueue(Packets.ForceExit());
    this.enqueue(Packets.LoginResponse(-1));
  }

  Restrict() {
    Logger.Failure(`${this.user.name} was restricted.`);
    this.Message(this.fakeBanchoBot, null, "Your account has been restricted. Please check out our [https://katakuna.cc website] for more information.");
  }

  Ban(reason = "no reason provided") {
    Logger.Failure(`${this.user.name} was banned: ${reason}`);
    this.Message(this.fakeBanchoBot, null, "Your account has been banned from our servers. Please check out our [https://katakuna.cc website] for more information.");
  }

  Mute(reason = "no reason provided", time) {
    Logger.Failure(`${this.user.name} was ${time > 0 ? "muted for " + time + "s with reason: " + reason : "unmuted"}.`);
    if(time > 0) this.Message(this.fakeBanchoBot, null, `You have been muted for ${time / 60} minutes for the following reason: ${reason}`);
    this.enqueue(Packets.SilenceEndTime(time));
  }

  sendOwnStats() {
    this.enqueue(Packets.UserPanel(this.user));
    this.enqueue(Packets.UserStats(this.user));
  }

  listAccesibleChannels() {
    ChannelManager.GetAllChannels(this.user).forEach(c => {
      this.enqueue(Packets.ChannelInfo(c));
      if(c.autoJoin) this.enqueue(Packets.AutojoinChannel(c));
    });
  }

  ChannelChange(channel) {
    this.enqueue(Packets.ChannelInfo(ChannelManager.GetChannel(channel)));
  }

  JoinedChannel(channel) {
    this.enqueue(Packets.JoinChatChannel(channel));
  }

  KickChannel(channel) {
    this.enqueue(Packets.KickedChatChannel(channel));
  }

  sendLoginResponse() {
    this.enqueue(Packets.LoginResponse(this.user.id)); // we have an id. we're in!
    this.enqueue(Packets.ProtocolVersion(19)); // we speek protocol version 19.

    this.enqueue(Packets.UserSupporterGMT(5)); // give supporter to the user automatically.
    this.sendOwnStats();
    this.listAccesibleChannels();
    this.enqueue(Packets.ChannelInfoEnd());
  }

  NotifyNewUser(user) {
    this.enqueue(Packets.UserPanel(user));
    this.enqueue(Packets.UserStats(user));
  }
}

module.exports = Token;
