const uuid = require('uuid').v4;
const Logger = require("../logging");
const OsuToken = require("./OsuToken");
const BotToken = require("./BotToken");
const RedisSubsystem = require("../Redis");

var tokens = [];

function CreateToken(user, token = uuid()) {
  // create the token
  tokens.push(new OsuToken(user, token));
  Logger.Success(`Created token ${token} for player ${user.name}`);

  RedisSubsystem.Set("shiori:online_users", OnlineUsersCount()); // update count

  return token; // return the token
}

function RegisterBot(user, token = uuid()) {
  // create the token
  tokens.push(new BotToken(user, token));
  Logger.Success(`Created token ${token} for bot ${user.name}`);

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
  return tokens.filter((value, index, self) => self.indexOf(value) === index).map(t => t.user);
}

function DestroyToken(token) {
  const ChannelManager = require("../ChannelManager");

  let user = GetToken(token).user;

  ChannelManager.GetJoinedChannelsOfUser(user).forEach(c => c.Leave(user)); // make user leave all channels

  tokens = tokens.filter(x => x.token != token); // remove the token from the list.

  RedisSubsystem.Set("shiori:online_users", OnlineUsersCount()); // update count
  Logger.Success(`Destroyed token ${token} of user ${user.name}`);
}

module.exports = {
  CreateToken,
  RegisterBot,
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
  NewStatusUpdate,
  DistributeNewPanel
};
