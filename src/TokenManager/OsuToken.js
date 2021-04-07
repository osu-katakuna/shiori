const Token = require('./Token');

const Packets = require('../BanchoEmulator/Packets');
const Logger = require('../Logger');
const ChannelManager = require('../ChannelManager');
const MultiplayerManager = require('../MultiplayerManager');
const Status = require('../Models/Status').Status;
const StatusType = require('../Models/Status').StatusType;

class OsuToken extends Token {
  constructor(user, token) {
    super(user, token);
    this.queue = [];

    this.fakeBanchoBot = {
      id: 1,
      name: "BanchoBot"
    };

    this.mutedTime = 0;
    this.gameMode = 0;
    this.tokenLoginDate = Date.now();

    this.relax = false;

    this.spectatorFrameQueue = [];
  }

  Destroy() {
    this.user.playTime = parseInt(this.user.playTime);
    this.user.playTime += Math.ceil((Date.now() - this.tokenLoginDate) / 1000);
    this.user.save();
  }

  queueSpectatorFrames() {
    for(var i = 0; i < this.spectatorFrameQueue.length; i++) {
      this.enqueue(Packets.SpectatorFrames(this.spectatorFrameQueue[i]));
      this.spectatorFrameQueue[i] = null;
    }

    this.spectatorFrameQueue = this.spectatorFrameQueue.filter(f => f != null);
  }

  get loginCheck() {
    return this.restricted || this.banned || this.user.restricted || this.user.banned;
  }

  get relaxMode() {
    return this.relax || (this.status.mods & (1 << 7)) > 1;
  }

  get stats() {
    if(this.user.cachedStats[this.gameMode < 8 ? this.gameMode : 0] == null) {
      for(var i = 0; i < 8; i++) {
        this.user.GetStats(i);
      }
    }
    return this.user.cachedStats[this.gameMode < 8 ? this.gameMode : 0] != null ? this.user.cachedStats[this.gameMode < 8 ? this.gameMode : 0] : {
      pp: 0,
      rank: 0,
      totalScore: 0,
      totalRankedScore: 0,
      playCount: 0,
      accuracy: 0,
      gameMode: this.gameMode < 8 ? (this.gameMode > 4 ? this.gameMode - 4 : this.gameMode) : 0
    };
  }

  enqueue(packet) {
    this.queue.push(packet);
  }

  Message(from, where, message) {
    where == null && (where = this.user.name);
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
    closeClient && this.CloseClient();
    this.enqueue(Packets.LoginResponse(-1));
  }

  Restrict() {
    if(this.restricted) {
      return;
    }
    Logger.Failure(`${this.user.name} was restricted.`);
    this.Message(this.fakeBanchoBot, null, "Your account has been restricted. Please check out our [https://katakuna.cc website] for more information.");
    this.SupporterTag();
    this.restricted = true;
  }

  Ban(reason = "no reason provided") {
    if(this.banned) {
      return;
    }
    Logger.Failure(`${this.user.name} was banned: ${reason}`);
    this.Message(this.fakeBanchoBot, null, "Your account has been banned from our servers. Please check out our [https://katakuna.cc website] for more information.");
    !this.loginCheck && this.SupporterTag();
    this.banned = true;
  }

  Mute(reason = "no reason provided", time = 0) {
    this.mutedTime += time;
    Logger.Failure(`${this.user.name} was ${this.mutedTime > 0 ? "muted for " + this.mutedTime + "s with reason: " + reason : "unmuted"}.`);
    this.mutedTime > 0 && this.Message(this.fakeBanchoBot, null, `You have been muted for ${this.mutedTime < 60 ? 1 : Math.round(this.mutedTime / 60)} minute(s) for the following reason: ${reason}`);
    this.enqueue(Packets.SilenceEndTime(this.mutedTime));
  }

  sendOwnStats() {
    this.enqueue(Packets.UserPanel(this.user));
    this.enqueue(Packets.UserStats(this.user));
  }

  listAccesibleChannels() {
    ChannelManager.GetAllChannels(this.user).forEach(c => {
      this.enqueue(Packets.ChannelInfo(c));
      c.autoJoin && this.enqueue(Packets.AutojoinChannel(c));
    });
  }

  ChannelChange(channel) {
    if(channel == "#spectator") {
      const c = ChannelManager.GetSpectatorChannelFor(this.user);
      c != null && this.enqueue(Packets.ChannelInfo(c));
      return;
    }

    if(channel == "#multiplayer") {
      const match = MultiplayerManager.GetMatchID(this.matchID);
      if(match == null) {
        return;
      }

      const c = ChannelManager.GetMultiplayerChannelFor(match);

      c != null && this.enqueue(Packets.ChannelInfo(c));

      return;
    }

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
    this.user.restricted && this.Restrict();

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

  NotifyUserPanel(user) {
    this.enqueue(Packets.UserPanel(user));
  }

  NotifyUserStats(user) {
    this.enqueue(Packets.UserStats(user));
  }

  NotifyFriends(id_list) {
    this.enqueue(Packets.FriendsList(id_list));
  }

  NotifySpectatorJoined(user) {
    if(this.mySpectators.filter(spectator => spectator.user.id == user.id).length == 0) { // make sure we prevent multiple spectators showing up...
      this.enqueue(Packets.SpectatorJoined(user));
      this.mySpectators.forEach(s => {
        s.user.Token.enqueue(Packets.FellowSpectatorJoined(user))
        user.Token.enqueue(Packets.FellowSpectatorJoined(s.user));
        !s.hasMap && user.Token.enqueue(Packets.SpectatorNoBeatmap(s.user));
      });
    }

    if(ChannelManager.GetSpectatorChannelFor(this.user) == null) {
      ChannelManager.RegisterSpectatorChannel(this.user);
      this.enqueue(Packets.AutojoinChannel(ChannelManager.GetSpectatorChannelFor(this.user)));
    }

    user.Token.enqueue(Packets.AutojoinChannel(ChannelManager.GetSpectatorChannelFor(this.user)));

    this.mySpectators.push({
      user,
      hasMap: true
    });
  }

  NotifyAutoJoinChannel(channel) {
    this.enqueue(Packets.AutojoinChannel(channel));
  }

  NotifySpectatorLeft(user) {
    this.mySpectators = this.mySpectators.filter(spectator => spectator.user != user);
    if(this.mySpectators.filter(spectator => spectator.user.id == user.id).length == 0) { // make sure we prevent informing the spectated that some one left befure making sure that they TRULY stopped spectating...
      this.enqueue(Packets.SpectatorLeft(user));
      this.mySpectators.forEach(u => u.user.Token.enqueue(Packets.FellowSpectatorLeft(user)));
    }
    // if there are no more spectators, destroy the spectator channel allocated for us.
    (this.mySpectators.length == 0 && ChannelManager.GetSpectatorChannelFor(this.user) != null) && ChannelManager.DestroySpectatorChannel(this.user);
  }

  NotifySpectatorNoMap(user) {
    this.mySpectators.filter(spectator => spectator.user === user).forEach(s => { s.hasMap = false; });
    this.enqueue(Packets.SpectatorNoBeatmap(user));
    this.mySpectators.filter(spectator => spectator.user.id != user.id).forEach(u => u.user.Token.enqueue(Packets.SpectatorNoBeatmap(user)));
  }

  SendSpectatorFrame(frame) {
    this.mySpectators.forEach(s => s.user.Token.NotifyNewFrame(frame));
  }

  NotifyNewFrame(frame) {
    this.spectatorFrameQueue.push(frame);
  }

  NotifyMPLobby(match) {
    this.enqueue(Packets.MatchInfo(match));
  }

  NotifyJoinedMPLobby(match) {
    this.enqueue(Packets.MatchInfo(match, true));
  }

  NotifyFailJoinMP() {
    this.enqueue(Packets.MatchJoinFailure());
  }

  NotifyNewMultiplayerMatch(match) {
    this.enqueue(Packets.NewMatchInfo(match));
  }

  NotifyUpdateMultiplayerMatch(match) {
    this.enqueue(Packets.NewMatchInfo(match));
  }

  NotifyDisposeMultiplayerMatch(match) {
    this.enqueue(Packets.DisposeMatch(match));
  }

  NotifyMPMatchStarting(match) {
    this.enqueue(Packets.MatchStart(match));
  }

  NotifyMPMatchStarted() {
    this.enqueue(Packets.AllPlayersLoadedMatch());
  }

  NotifyMPSkip() {
    this.enqueue(Packets.MatchExecuteSkip());
  }

  NotifyMPComplete() {
    this.enqueue(Packets.MatchComplete());
  }

  NotifyMPPlayerScoreUpdate(score) {
    this.enqueue(Packets.ScoreFrame(score));
  }

  NotifyMPPlayerFailed(slot) {
    this.enqueue(Packets.UserFailed(slot));
  }

  NotifyMPHost() {
    this.enqueue(Packets.MatchTransferHost());
  }
}

module.exports = OsuToken;
