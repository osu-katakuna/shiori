const Logger = require('../Logger');
const ChannelManager = require('../ChannelManager');
const Status = require("../Models/Status").Status;
const Packets = require('../BanchoEmulator/Packets');

class Token {
  constructor(user, token) {
    this.bot = false;
    this.user = user;

    this.token = token;
    this.status = new Status();

    this.user.token = this.token;

    this.banned = false;
    this.restricted = false;

    this.inMatch = false;
    this.matchID = -1;

    this.mySpectators = [];
    this.spectatedUser = null;

    this.timeout = null;
    this.resetTimeout();
  }

  stopTimeout() {
    if(this.timeout != null) clearTimeout(this.timeout);
  }

  resetTimeout() {
    if(this.timeout != null) clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      var TokenManager = require("./index");
      Logger.Info(`${this.token} => ${this.user.name} has timed out.`);
      TokenManager.DestroyToken(this.token);
    }, 60000);
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

  Spectate(user) {
    if(this.spectatedUser) this.StopSpectating();
    user.Token.NotifySpectatorJoined(this.user);
    this.spectatedUser = user;
  }

  StopSpectating() {
    if(this.spectatedUser) {
      this.spectatedUser.Token.NotifySpectatorLeft(this.user);
      this.spectatedUser = null;
    }
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

  Destroy() {
    Logger.Failure(`Token Base: Not implemented - Destroy`);
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

  NotifySpectatorJoined(user) {
    Logger.Failure(`Token Base: Not implemented - NotifySpectatorJoined(${user})`);
  }

  NotifySpectatorLeft(user) {
    Logger.Failure(`Token Base: Not implemented - NotifySpectatorLeft(${user})`);
  }

  NotifySpectatorNoMap(user) {
    Logger.Failure(`Token Base: Not implemented - NotifySpectatorNoMap(${user})`);
  }

  SendSpectatorFrame(frame) {
    Logger.Failure(`Token Base: Not implemented - SendSpectatorFrame(${frame})`);
  }

  NotifyNewFrame(frame) {
    Logger.Failure(`Token Base: Not implemented - NotifyNewFrame(${frame})`);
  }

  NotifyNewMultiplayerMatch(match) {
    Logger.Failure(`Token Base: Not implemented - NotifyNewMultiplayerMatch(${match})`);
  }

  NotifyUpdateMultiplayerMatch(match) {
    Logger.Failure(`Token Base: Not implemented - NotifyUpdateMultiplayerMatch(${match})`);
  }

  NotifyMPLobby(match) {
    Logger.Failure(`Token Base: Not implemented - NotifyMPLobby(${match})`);
  }

  NotifyJoinedMPLobby(match) {
    Logger.Failure(`Token Base: Not implemented - NotifyJoinedMPLobby(${match})`);
  }

  NotifyFailJoinMP() {
    Logger.Failure(`Token Base: Not implemented - NotifyFailJoinMP`);
  }

  NotifyDisposeMultiplayerMatch(match) {
    Logger.Failure(`Token Base: Not implemented - NotifyDisposeMultiplayerMatch(${match})`);
  }

  NotifyMPMatchStarting(match) {
    Logger.Failure(`Token Base: Not implemented - NotifyMPMatchStarting(${match})`);
  }

  NotifyMPMatchStarted() {
    Logger.Failure(`Token Base: Not implemented - NotifyMPMatchStarted`);
  }

  NotifyMPSkip() {
    Logger.Failure(`Token Base: Not implemented - NotifyMPSkip`);
  }

  NotifyMPComplete() {
    Logger.Failure(`Token Base: Not implemented - NotifyMPComplete`);
  }

  NotifyMPPlayerScoreUpdate(score) {
    Logger.Failure(`Token Base: Not implemented - NotifyMPPlayerScoreUpdate(${score})`);
  }

  NotifyMPPlayerFailed(slot) {
    Logger.Failure(`Token Base: Not implemented - NotifyMPPlayerFailed(${slot})`);
  }

  NotifyMPHost() {
    Logger.Failure(`Token Base: Not implemented - NotifyMPHost`);
  }

  NotifyMPKick() {
    Logger.Failure(`Token Base: Not implemented - NotifyMPKick`);
  }

  NotifyAutoJoinChannel(channel) {
    Logger.Failure(`Token Base: Not implemented - NotifyAutoJoinChannel(${channel})`);
  }
}

module.exports = Token;
