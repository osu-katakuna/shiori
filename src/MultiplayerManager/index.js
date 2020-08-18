const Logger = require('../logging');
const MultiplayerMatch = require('./MultiplayerMatch');
const TokenManager = require('../TokenManager');
const Token = require('../TokenManager/Token');

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

  if(match == null || match.slots.length + 1 > match.slots.maxSlots || (match.password != null && match.password == password)) {
    token.NotifyFailJoinMP();
    return;
  }

  match.join(token);
  MatchUpdate(match);
}

function LeaveMatch(token, matchID) {
  var match = MultiplayerMatches.filter(m => m.id == matchID)[0];
  match.leave(token);
  MatchUpdate(match);
}

function NewMatch(name, owner, password = null, maxPlayers = 8, publicHistory = false, gameMode = 0) {
  const token = owner instanceof Token ? owner : owner.Token;
  var match = new MultiplayerMatch(name, token, password, maxPlayers, publicHistory);

  match.id = getNewMatchID();
  match.gameMode = gameMode;

  MultiplayerMatches.push(match); // add match to list
  TokensInLobby.forEach(t => t.NotifyNewMultiplayerMatch(match)); // notify players

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
