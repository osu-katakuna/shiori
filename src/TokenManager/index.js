const uuid = require('uuid').v4;
const Logger = require('../logging');
var Token = require("./Token");

var tokens = [];

function CreateToken(user, token = uuid()) {
  Logger.Success(`Created token ${token} for player ${user.name}`);
  tokens[token] = new Token(user);
  return token;
}

function GetToken(token) {
  return tokens[token];
}

function FindTokenUsername(username) {
  return tokens.filter(x => x.user.name == username)[0];
}

function FindTokenUserID(id) {
  return tokens.filter(x => x.user.id == id)[0];
}

module.exports = {
  CreateToken,
  GetToken,
  FindTokenUsername,
  FindTokenUserID
};
