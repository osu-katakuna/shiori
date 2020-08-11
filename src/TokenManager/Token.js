const Packets = require('../BanchoEmulator/Packets');
const Logger = require('../logging');
const ChannelManager = require('../ChannelManager');
const Status = require("../Models/Status").Status;
const StatusType = require("../Models/Status").StatusType;

class Token {
  constructor(user, token) {
    this.user = user;
    this.queue = [];
    this.fakeBanchoBot = {
      id: 1,
      name: "BanchoBot"
    };
    this.token = token;
    this.status = new Status();

    this.user.token = this.token;

    this.banned = false;
    this.restricted = false;
    this.mutedTime = 0;
  }

  get loginCheck() {
    return this.restricted || this.banned || this.user.restricted || this.user.banned;
  }

  enqueue(packet) {
    this.queue.push(packet);
  }

  SetStatus(s) {
    this.status = s;

    this.NotifyUserStats(this.user);
    console.log(this.queue);

    console.log(`Token ID ${this.token} of user ${this.user.name} has received new status update: ${s}`);
  }

  Message(from, where, message) {
    if(where == null) where = this.user.name;
    this.enqueue(Packets.ChatMessage(from, where, message));
  }

  Notify(message) {
    this.enqueue(Packets.Notification(message));
  }

  CloseClient() {
    this.enqueue(Packets.ForceExit());
  }

  Kick(reason = "no reason provided", closeClient = false) {
    Logger.Failure(`${this.user.name} was kicked: ${reason}; close client: ${closeClient}`);
    this.abortLogin = true;
    this.enqueue(Packets.Notification(`You have been kicked from osu!katakuna for the following reason: ${reason}`));
    if(closeClient) this.CloseClient();
    this.enqueue(Packets.LoginResponse(-1));
  }

  Restrict() {
    if(this.restricted) return;
    Logger.Failure(`${this.user.name} was restricted.`);
    this.Message(this.fakeBanchoBot, null, "Your account has been restricted. Please check out our [https://katakuna.cc website] for more information.");
    this.SupporterTag();
    this.restricted = true;
  }

  Ban(reason = "no reason provided") {
    if(this.banned) return;
    Logger.Failure(`${this.user.name} was banned: ${reason}`);
    this.Message(this.fakeBanchoBot, null, "Your account has been banned from our servers. Please check out our [https://katakuna.cc website] for more information.");
    if(!this.loginCheck) this.SupporterTag();
    this.banned = true;
  }

  Mute(reason = "no reason provided", time = 0) {
    this.mutedTime += time;
    Logger.Failure(`${this.user.name} was ${this.mutedTime > 0 ? "muted for " + this.mutedTime + "s with reason: " + reason : "unmuted"}.`);
    if(this.mutedTime > 0) this.Message(this.fakeBanchoBot, null, `You have been muted for ${this.mutedTime / 60} minutes for the following reason: ${reason}`);
    this.enqueue(Packets.SilenceEndTime(this.mutedTime));
  }

  Unmute() {
    this.Mute("Unmute", -this.mutedTime);
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

  SupporterTag() {
    this.enqueue(Packets.UserSupporterGMT(!this.loginCheck ? 1 + 4 : 1));
  }

  sendLoginResponse() {
    if(this.user.restricted) this.Restrict();

    if(this.user.banned) {
      this.Ban();
      return;
    }

    this.enqueue(Packets.LoginResponse(this.user.id)); // we have an id. we're in!
    this.enqueue(Packets.ProtocolVersion(19)); // we speek protocol version 19.

    this.SupporterTag();
    this.enqueue(Packets.SilenceEndTime(this.mutedTime));

    this.sendOwnStats();
    this.listAccesibleChannels();
    this.enqueue(Packets.ChannelInfoEnd());
  }

  NotifyUserStats(user) {
    this.enqueue(Packets.UserPanel(user));
    this.enqueue(Packets.UserStats(user));
  }
}

module.exports = Token;
