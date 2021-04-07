const Logger = require('../Logger');
const MultiplayerMatch = require('./MultiplayerMatch');
const TokenManager = require('../TokenManager');
const ChannelManager = require('../ChannelManager');
const Token = require('../TokenManager/Token');
const RunEvent = require('../PluginManager').CallHook;

var TokensInLobby = [];
var MultiplayerMatches = [];

function JoinLobby(token) {
  Logger.Success(`${token.user.name} joined the MP Lobby!`);
  TokensInLobby.push(token);
  MultiplayerMatches.forEach(match => token.NotifyNewMultiplayerMatch(match));
}

function GetMatchID(matchID) {
  return MultiplayerMatches.filter(m => m.id == matchID)[0]
}

function getNewMatchID() {
  for(var i = 0; i < MultiplayerMatches.length; i++) {
    if(MultiplayerMatches[i] == null) break;
  }

  return i + 1;
}

function MatchUpdate(match) {
  TokensInLobby.forEach(t => t.NotifyUpdateMultiplayerMatch(match)); // notify players
}

function JoinMatch(token, matchID, password = null) {
  var match = MultiplayerMatches.filter(m => m.id == matchID)[0];

  if(token.restricted || match == null || match.slots.length + 1 > match.slots.maxSlots || (match.password != null && match.password != password)) {
    token.NotifyFailJoinMP();
    return;
  }

  if(ChannelManager.GetMultiplayerChannelFor(match) != null) {
    token.NotifyAutoJoinChannel(ChannelManager.GetMultiplayerChannelFor(match));
  }

  match.join(token);
  MatchUpdate(match);
}

function LeaveMatch(token, matchID) {
  var match = MultiplayerMatches.filter(m => m.id == matchID)[0];
  if(match == null) return;

  if(ChannelManager.GetMultiplayerChannelFor(match) != null) {
    token.KickChannel("#multiplayer");
  }

  match.leave(token);

  if(match.slots.filter(s => s.status & 124).length == 0) {
    RunEvent("onMPMatchDisband", match);
    ChannelManager.DestroyMultiplayerChannel(match);
    MultiplayerMatches = MultiplayerMatches.filter(m => m.id != matchID);
    TokensInLobby.forEach(t => t.NotifyDisposeMultiplayerMatch(match));
    return;
  }

  MatchUpdate(match);
}

function NewMatch(name, owner, password = null, maxPlayers = 8, publicHistory = false, gameMode = 0) {
  const token = owner instanceof Token ? owner : owner.Token;

  // add checks: restricted players can't join/create multiplayer matches!
  if(token.restricted) {
    token.NotifyFailJoinMP();
    return;
  }

  var match = new MultiplayerMatch(name, token, password, maxPlayers, publicHistory);

  match.id = getNewMatchID();
  match.gameMode = gameMode;

  MultiplayerMatches.push(match); // add match to list
  TokensInLobby.forEach(t => t.NotifyNewMultiplayerMatch(match)); // notify players
  ChannelManager.RegisterMultiplayerChannel(match); // create MP Chat room
  token.NotifyAutoJoinChannel(ChannelManager.GetMultiplayerChannelFor(match));
  RunEvent("onMPMatchCreation", match);

  match.join(token); // make us join the match.

  return match;
}

function LeaveLobby(token) {
  Logger.Success(`${token.user.name} left the MP Lobby!`);
  TokensInLobby = TokensInLobby.filter(t => t !== token);
}

module.exports = {
  JoinLobby,
  LeaveLobby,
  NewMatch,
  JoinMatch,
  GetMatchID,
  MatchUpdate,
  LeaveMatch
};
