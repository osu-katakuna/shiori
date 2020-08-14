const Logger = require('../logging');
const ChannelManager = require('../ChannelManager');
const Status = require("../Models/Status").Status;

class Token {
  constructor(user, token) {
    this.user = user;

    this.token = token;
    this.status = new Status();

    this.user.token = this.token;

    this.banned = false;
    this.restricted = false;
  }

  get stats() {
    return {
      pp: 0,
      rank: 0,
      totalScore: 0,
      totalRankedScore: 0,
      playCount: 0,
      accuracy: 0,
      gameMode: 0
    };
  }

  enqueue(packet) {
    Logger.Failure(`Token Base: Not implemented - Enqueue`);
  }

  SetStatus(s) {
    this.status = s;
    this.gameMode = this.status.gameMode;

    console.log(`Token ID ${this.token} -> ${this.user.name} has updated its status.`);
    this.user.NewStatus();
  }

  Message(from, where, message) {
    if(where == null) where = this.user.name;
    Logger.Failure(`Token Base: Not implemented - Message(${from}, ${where}, ${message})`);
  }

  Notify(message) {
    Logger.Failure(`Token Base: Not implemented - Notify(${message})`);
  }

  CloseClient() {
    Logger.Failure(`Token Base: Not implemented - CloseClient`);
  }

  Kick(reason = "no reason provided", closeClient = false) {
    Logger.Failure(`${this.user.name} was kicked: ${reason}; close client: ${closeClient}`);
  }

  Restrict() {
    if(this.restricted) return;
    Logger.Failure(`${this.user.name} was restricted.`);
  }

  Ban(reason = "no reason provided") {
    if(this.banned) return;
    Logger.Failure(`${this.user.name} was banned: ${reason}`);
  }

  Mute(reason = "no reason provided", time = 0) {
    this.mutedTime += time;
    Logger.Failure(`${this.user.name} was ${this.mutedTime > 0 ? "muted for " + this.mutedTime + "s with reason: " + reason : "unmuted"}.`);
  }

  Unmute() {
    this.Mute("Unmute", -this.mutedTime);
  }

  listAccesibleChannels() {
    ChannelManager.GetAllChannels(this.user).forEach(c => {
      this.enqueue(Packets.ChannelInfo(c));
      if(c.autoJoin) this.enqueue(Packets.AutojoinChannel(c));
    });
  }

  ChannelChange(channel) {
    Logger.Failure(`Token Base: Not implemented - ChannelChange(${channel})`);
  }

  JoinedChannel(channel) {
    Logger.Failure(`Token Base: Not implemented - JoinedChannel(${channel})`);
  }

  KickChannel(channel) {
    Logger.Failure(`Token Base: Not implemented - KickChannel(${channel})`);
  }

  NotifyUserPanel(user) {
    Logger.Failure(`Token Base: Not implemented - NotifyUserPanel(${user})`);
  }

  NotifyUserStats(user) {
    Logger.Failure(`Token Base: Not implemented - NotifyUserStats(${user})`);
  }

  NotifyFriends(id_list) {
    Logger.Failure(`Token Base: Not implemented - NotifyFriends(${id_list})`);
  }
}

module.exports = Token;
