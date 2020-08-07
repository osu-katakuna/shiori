const uuid = require('uuid').v4;
const Logger = require('../logging');
var Token = require("./Token");

var tokens = [];

function CreateToken(user, token = uuid()) {
  Logger.Success(`Created token ${token} for player ${user.name}`);

  tokens.push(new Token(user, token));

  return token;
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

function BanUser(id, reason = "no reason provided") {
  tokens.filter(x => x.user.id == id).forEach(t => t.Ban(reason));
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

function SetStatus(id, s) {
  tokens.filter(x => x.user.id == id).forEach(t => t.SetStatus(s));
  NotifyEveryoneAboutNewStats(id);
}

function NotifyEveryoneAboutNewStats(id) {
  const user = FindTokenUserID(id).user;
  tokens.filter(x => x.user.id != id).forEach(t => t.NotifyUserStats(user));
}

function DestroyToken(token) {
  const ChannelManager = require("../ChannelManager");

  let user = GetToken(token).user;

  ChannelManager.GetJoinedChannelsOfUser(user).forEach(c => c.Leave(user)); // make user leave all channels

  tokens = tokens.filter(x => x.token != token); // remove the token from the list.
  Logger.Success(`Destroyed token ${token} of user ${user.name}`);
}

module.exports = {
  CreateToken,
  GetToken,
  FindTokenUsername,
  FindTokenUserID,
  KickUser,
  RestrictUser,
  MuteUser,
  BanUser,
  InformChannelChange,
  GetTokenByUser,
  KickUserFromChannel,
  JoinedUserChannel,
  SetStatus,
  NotifyEveryoneAboutNewStats,
  DestroyToken
};