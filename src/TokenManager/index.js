const uuid = require('uuid').v4;
const Logger = require("../Logger");
const OsuToken = require("./OsuToken");
const RedisSubsystem = require("../Redis");

var tokens = [];

function CreateToken(user, token = uuid(), tokenType = OsuToken, ...extra) {
  // create the token
  tokens.push(new tokenType(user, token, ...extra));
  Logger.Success(`Created token(${tokenType.constructor.name}) ${token} for player ${user.name}`);

  RedisSubsystem.Set("shiori:online_users", OnlineUsersCount()); // update count

  return token; // return the token
}

function GetToken(token) {
  return tokens.filter(x => x.token == token)[0];
}

function FindTokenUsername(username) {
  return tokens.filter(x => x.user.name == username)[0];
}

function FindTokenUserID(id) {
  return tokens.filter(x => x.user.id == id)[0];
}

function GetTokenByUser(user) {
  return FindTokenUserID(user.id);
}

function KickUser(id, reason = "no reason provided", closeClient = false) {
  tokens.filter(x => x.user.id == id).forEach(t => t.Kick(reason, closeClient));
}

function RestrictUser(id) {
  tokens.filter(x => x.user.id == id).forEach(t => t.Restrict());
}

function MuteUser(id, reason = "no reason provided", time) {
  tokens.filter(x => x.user.id == id).forEach(t => t.Mute(reason, time));
}

function UnmuteUser(id) {
  tokens.filter(x => x.user.id == id).forEach(t => t.Unmute());
}

function BanUser(id, reason = "no reason provided") {
  tokens.filter(x => x.user.id == id).forEach(t => t.Ban(reason));
}

function CloseClient(id) {
  tokens.filter(x => x.user.id == id).forEach(t => t.CloseClient());
}

function KickUserFromChannel(id, channel) {
  tokens.filter(x => x.user.id == id).forEach(t => t.KickChannel(channel));
}

function JoinedUserChannel(id, channel) {
  tokens.filter(x => x.user.id == id).forEach(t => t.JoinedChannel(channel));
}

function InformChannelChange(channel) {
  tokens.forEach(t => t.ChannelChange(channel));
}

function SetStatus(user, s) {
  tokens.filter(x => x.user.id == user.id).forEach(t => t.SetStatus(s));
  DistributeNewStats(user);
}

function DistributeNewPanel(user) {
  tokens.filter(x => x.user.id != user.id).forEach(t => t.NotifyUserPanel(user));
}

function DistributeNewStats(user) {
  tokens.filter(x => x.user.id != user.id).forEach(t => t.NotifyUserStats(user));
}

function NewStatusUpdate(user) {
  tokens.forEach(t => t.NotifyUserStats(user));
}

function OnlineUsersCount() {
  return OnlineUsers().length;
}

function OnlineUsers() {
  return tokens.filter((value, index, self) => self.indexOf(value) === index && !value.bot).map(t => t.user); // filter tokens; we don't need BOT TOKENS!
}

function AllOnlineUsers() {
  return tokens.filter((value, index, self) => self.indexOf(value) === index).map(t => t.user); // no filtering here
}

function DestroyToken(token) {
  if(GetToken(token) == null) return;

  const t = GetToken(token);

  const ChannelManager = require("../ChannelManager");
  const MultiplayerManager = require("../MultiplayerManager");

  const user = t.user;

  ChannelManager.GetJoinedChannelsOfUser(user).forEach(c => c.Leave(user)); // make user leave all channels
  MultiplayerManager.LeaveLobby(t); // make user leave the lobby.
  if(t.inMatch) MultiplayerManager.LeaveMatch(t, t.matchID);

  t.stopTimeout();
  t.Destroy();
  tokens = tokens.filter(x => x !== t); // remove the token from the list.

  RedisSubsystem.Set("shiori:online_users", OnlineUsersCount()); // update count
  Logger.Success(`Destroyed token ${token} of user ${user.name}. Online users: ${OnlineUsersCount()}`);
}

module.exports = {
  CreateToken,
  GetToken,
  FindTokenUsername,
  FindTokenUserID,
  KickUser,
  RestrictUser,
  MuteUser,
  UnmuteUser,
  BanUser,
  CloseClient,
  InformChannelChange,
  GetTokenByUser,
  KickUserFromChannel,
  JoinedUserChannel,
  SetStatus,
  DistributeNewStats,
  DestroyToken,
  OnlineUsersCount,
  OnlineUsers,
  AllOnlineUsers,
  NewStatusUpdate,
  DistributeNewPanel
};
